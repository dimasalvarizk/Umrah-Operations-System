import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  Search,
  Plus,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import AddAgreementModal, { type AgreementItem } from '../components/contracts/AddAgreementModal';
import AgreementDetailsModal from '../components/contracts/AgreementDetailsModal';
import DeleteAgreementModal from '../components/contracts/DeleteAgreementModal';
import AgreementStatusSelector, { type AgreementStatusType } from '../components/contracts/AgreementStatusSelector';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import useCountUp from '../hooks/useCountUp';
import {
  getContractsApi,
  createContractApi,
  updateContractStatusApi,
  deleteContractApi,
} from '../services/contractsApi';

export default function ContractsPage() {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<AgreementItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Initial agreement data with persistent localStorage synchronization
  const [agreementsList, setAgreementsList] = useState<AgreementItem[]>(() => {
    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchContracts = async () => {
    try {
      const { contracts } = await getContractsApi({
        search: searchQuery,
        type: typeFilter,
      });
      if (Array.isArray(contracts)) {
        setAgreementsList(contracts);
      }
    } catch {
      // Offline fallback to current state/localStorage
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [searchQuery, typeFilter]);

  // Real-time synchronization: interval polling + event listeners
  useEffect(() => {
    const handleSync = () => {
      fetchContracts();
    };

    window.addEventListener('umrah_contracts_updated', handleSync);
    window.addEventListener('umrah_notification_refresh', handleSync);
    window.addEventListener('storage', handleSync);

    const interval = setInterval(() => {
      fetchContracts();
    }, 4000);

    return () => {
      window.removeEventListener('umrah_contracts_updated', handleSync);
      window.removeEventListener('umrah_notification_refresh', handleSync);
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, [searchQuery, typeFilter]);

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options list with localized labels
  const filterOptions = useMemo(() => [
    { label: t('contracts.all_agreements', 'جميع الاتفاقيات'), val: 'الكل' },
    { label: t('contracts.hotels_agreements', 'فنادق'), val: 'فنادق' },
    { label: t('contracts.transport_agreements', 'شركات نقل'), val: 'نقل' },
    { label: t('contracts.active_stat', 'الاتفاقيات النشطة'), val: 'نشطة' },
    { label: t('contracts.pending_stat', 'اتفاقيات معلقة'), val: 'معلقة' },
    { label: t('contracts.expired_stat', 'اتفاقيات منتهية'), val: 'منتهية' },
  ], [t]);

  const selectedFilterLabel = useMemo(() => {
    if (typeFilter === 'الكل') return t('contracts.filter_by_type', 'تصفية حسب النوع');
    const matched = filterOptions.find((opt) => opt.val === typeFilter);
    return matched ? matched.label : typeFilter;
  }, [typeFilter, filterOptions, t]);

  // Dynamic Filtering
  const filteredAgreements = useMemo(() => {
    return agreementsList.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.agreementNo.toLowerCase().includes(q) ||
        item.agreementName.toLowerCase().includes(q) ||
        item.entityName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);

      const matchesType =
        typeFilter === 'الكل' ||
        (typeFilter === 'فنادق' && item.type === 'فندق') ||
        (typeFilter === 'نقل' && item.type === 'نقل') ||
        (typeFilter === 'نشطة' && item.status === 'نشطة') ||
        (typeFilter === 'معلقة' && item.status === 'في انتظار الموافقة') ||
        (typeFilter === 'منتهية' && item.status === 'منتهية');

      return matchesSearch && matchesType;
    });
  }, [agreementsList, searchQuery, typeFilter]);

  // Sync agreementsList with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('contracts_agreements_list', JSON.stringify(agreementsList));
    } catch (e) {
      console.error('Failed to save contracts list:', e);
    }
  }, [agreementsList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleStatusChange = async (agreementId: string, newStatus: AgreementStatusType) => {
    setAgreementsList((prev) =>
      prev.map((item) => (item.id === agreementId ? { ...item, status: newStatus } : item))
    );
    try {
      await updateContractStatusApi(agreementId, newStatus);
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (e) {
      console.error('Failed to update status on server:', e);
    }
  };

  const stats = useMemo(() => {
    const expired = agreementsList.filter((a) => a.status === 'منتهية').length;
    const pending = agreementsList.filter((a) => a.status === 'في انتظار الموافقة').length;
    const active = agreementsList.filter((a) => a.status === 'نشطة').length;
    const total = agreementsList.length;

    return { expired, pending, active, total };
  }, [agreementsList]);

  // Animated stat values
  const animatedTotal = useCountUp(stats.total, 800, isLoaded);
  const animatedActive = useCountUp(stats.active, 900, isLoaded);
  const animatedPending = useCountUp(stats.pending, 1000, isLoaded);
  const animatedExpired = useCountUp(stats.expired, 1100, isLoaded);

  const handleAddSuccess = async (newAgreement: AgreementItem) => {
    try {
      const created = await createContractApi(newAgreement as any);
      const toAdd = created || newAgreement;
      setAgreementsList((prev) => [toAdd, ...prev.filter((x) => x.id !== toAdd.id && x.agreementNo !== toAdd.agreementNo)]);
      setIsAddModalOpen(false);
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (e) {
      console.error('Failed to save agreement on server:', e);
      setAgreementsList((prev) => [newAgreement, ...prev.filter((x) => x.id !== newAgreement.id && x.agreementNo !== newAgreement.agreementNo)]);
      setIsAddModalOpen(false);
    }
  };

  const handleOpenDetails = (agreement: AgreementItem) => {
    navigate(`/contracts/${agreement.id}`);
  };

  const handleOpenDelete = (agreement: AgreementItem) => {
    setAgreementToDelete(agreement);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (agreementToDelete) {
      const id = agreementToDelete.id;
      setAgreementsList((prev) => prev.filter((item) => item.id !== id));
      setIsDeleteModalOpen(false);
      setAgreementToDelete(null);
      try {
        await deleteContractApi(id);
        window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
        window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
      } catch (e) {
        console.error('Failed to delete on server:', e);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="contracts"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={t('contracts.manage_title', 'إدارة الاتفاقيات')}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Page Body */}
        <main className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Top 4 Stat Cards: 2x2 on Mobile, 4 Columns on Large Screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total Agreements */}
            <div
              className={`bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 transform flex justify-between items-stretch min-h-[90px] sm:min-h-[105px] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-2xl sm:text-4xl font-bold text-[#0f172a] leading-none tracking-tight">
                  {animatedTotal}
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {t('contracts.total_stat', 'إجمالي الاتفاقيات')}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#d0ebff]/80 flex items-center justify-center shrink-0 self-end transition-transform hover:scale-110">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c7ed6] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 2: Active Agreements */}
            <div
              className={`bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 transform flex justify-between items-stretch min-h-[90px] sm:min-h-[105px] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-2xl sm:text-4xl font-bold text-[#0f172a] leading-none tracking-tight">
                  {animatedActive}
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {t('contracts.active_stat', 'الاتفاقيات النشطة')}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#d3f9d8]/80 flex items-center justify-center shrink-0 self-end transition-transform hover:scale-110">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2b8a3e] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 3: Pending Agreements */}
            <div
              className={`bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 transform flex justify-between items-stretch min-h-[90px] sm:min-h-[105px] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-2xl sm:text-4xl font-bold text-[#0f172a] leading-none tracking-tight">
                  {animatedPending}
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {t('contracts.pending_stat', 'اتفاقيات معلقة')}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fff9db]/80 flex items-center justify-center shrink-0 self-end transition-transform hover:scale-110">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59f00] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 4: Expired Agreements */}
            <div
              className={`bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 transform flex justify-between items-stretch min-h-[90px] sm:min-h-[105px] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-2xl sm:text-4xl font-bold text-[#0f172a] leading-none tracking-tight">
                  {animatedExpired}
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {t('contracts.expired_stat', 'اتفاقيات منتهية')}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ffe3e3]/80 flex items-center justify-center shrink-0 self-end transition-transform hover:scale-110">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#f03e3e] stroke-[2]" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar: Search & Action Buttons (Directly above Table) */}
          <div
            className={`relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all duration-400 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {/* Search Input */}
            <div className="relative flex-1 max-w-md min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('contracts.search_placeholder', 'البحث عن اتفاقية، فندق، أو شركة نقل...')}
                className={`w-full bg-white border border-slate-200/90 rounded-xl ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition shadow-2xs`}
              />
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Filter Dropdown */}
              <div className="relative flex-1 sm:flex-none z-30" ref={filterDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full sm:w-auto border text-slate-700 font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-[0.98] ${
                    typeFilter !== 'الكل'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className={`w-3.5 h-3.5 ${typeFilter !== 'الكل' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{selectedFilterLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>

                {isFilterOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn`}>
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setTypeFilter(opt.val);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer ${
                          typeFilter === opt.val ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Agreement Button */}
              {!isReadOnly && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 sm:flex-none bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-[0.98] whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('contracts.add_agreement_btn', 'إضافة اتفاقية جديدة')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div
            className={`relative z-10 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-500 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="overflow-x-auto touch-scroll min-h-[260px]">
              <table className="w-full min-w-[780px] text-xs sm:text-sm border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50 text-slate-700 font-bold text-[11px] sm:text-xs">
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.contract_number', 'رقم الاتفاقية')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.agreement_name', 'اسم الاتفاقية')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.hotel_name', 'اسم الفندق')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.city', 'المدينة')}</th>
                    <th className="py-3.5 px-2.5 font-bold whitespace-nowrap text-center">{t('contracts.rooms_count', 'عدد الغرف')}</th>
                    <th className="py-3.5 px-2.5 font-bold whitespace-nowrap text-center">
                      <div>{t('contracts.duration_days', 'عدد أيام الإتفاقية')}</div>
                    </th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.start_date', 'تاريخ البداية')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.end_date', 'تاريخ النهاية')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-start">{t('contracts.total_price', 'إجمالي السعر')}</th>
                    <th className="py-3.5 px-2.5 font-bold whitespace-nowrap text-center">{t('contracts.status', 'الحالة')}</th>
                    <th className="py-3.5 px-3 font-bold whitespace-nowrap text-center">{t('contracts.actions', 'إجراءات')}</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-[11px] sm:text-xs">
                  {filteredAgreements.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        {t('contracts.no_agreements_found', 'لا توجد اتفاقيات مطابقة للبحث أو التصفية الحالية')}
                      </td>
                    </tr>
                  ) : (
                    filteredAgreements.map((agreement) => (
                      <tr
                        key={agreement.id}
                        className="hover:bg-slate-50/70 transition-colors duration-150"
                      >
                        {/* رقم الاتفاقية */}
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {agreement.agreementNo}
                        </td>

                        {/* اسم الاتفاقية */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                          {agreement.agreementName}
                        </td>

                        {/* اسم الفندق */}
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {agreement.entityName}
                        </td>

                        {/* المدينة */}
                        <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                          {agreement.city}
                        </td>

                        {/* عدد الغرف */}
                        <td className="py-3 px-2.5 text-center font-bold text-slate-800 whitespace-nowrap">
                          {agreement.roomsCount}
                        </td>

                        {/* عدد أيام الاتفاقية */}
                        <td className="py-3 px-2.5 text-center font-bold text-slate-800 whitespace-nowrap">
                          {agreement.durationDays}
                        </td>

                        {/* تاريخ البداية */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {agreement.startDate}
                        </td>

                        {/* تاريخ النهاية */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {agreement.endDate}
                        </td>

                        {/* إجمالي السعر */}
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {agreement.totalPrice.toLocaleString()} {t('common.currency', 'ر.س')}
                        </td>

                        {/* الحالة */}
                        <td className="py-3 px-2.5 text-center whitespace-nowrap">
                          <AgreementStatusSelector
                            value={agreement.status}
                            disabled={isReadOnly}
                            onChange={(newStatus) => handleStatusChange(agreement.id, newStatus)}
                          />
                        </td>

                        {/* إجراءات (حذف & عرض) */}
                        <td className="py-3 px-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* حذف */}
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(agreement)}
                                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-[#ffe3e3] bg-[#fff5f5] text-[#e03131] hover:bg-[#ffe3e3] transition cursor-pointer active:scale-95"
                              >
                                {t('common.delete', 'حذف')}
                              </button>
                            )}

                            {/* عرض */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(agreement)}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-[#d3f9d8] bg-[#ebfbee] text-[#2b8a3e] hover:bg-[#d3f9d8] transition cursor-pointer active:scale-95"
                            >
                              {t('common.view', 'عرض')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Agreement Modal */}
      <AddAgreementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Agreement Details Modal */}
      <AgreementDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAgreement(null);
        }}
        agreement={selectedAgreement}
      />

      {/* Delete Agreement Confirmation Modal */}
      <DeleteAgreementModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAgreementToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        agreement={agreementToDelete}
      />
    </div>
  );
}

