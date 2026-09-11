import { useState, useMemo } from 'react';
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
import { useLanguage } from '../context/LanguageContext';

export default function ContractsPage() {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<AgreementItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Initial agreement data
  const [agreementsList, setAgreementsList] = useState<AgreementItem[]>([
    {
      id: '1',
      agreementNo: 'AGR-1125900',
      agreementName: isRTL ? 'اتفاقية فندق جراند زوار' : 'Grand Zuwar Hotel Agreement',
      entityName: isRTL ? 'فندق جراند زوار' : 'Grand Zuwar Hotel',
      type: 'فندق',
      city: isRTL ? 'مكة المكرمة' : 'Makkah',
      roomsCount: 8,
      durationDays: 4,
      startDate: '02/09/2026',
      endDate: '06/09/2026',
      totalPrice: 19200,
      status: 'نشطة',
    },
    {
      id: '2',
      agreementNo: 'AGR-2294103',
      agreementName: isRTL ? 'اتفاقية فندق جراند زوار' : 'Grand Zuwar Hotel Agreement',
      entityName: isRTL ? 'فندق جراند زوار' : 'Grand Zuwar Hotel',
      type: 'فندق',
      city: isRTL ? 'مكة المكرمة' : 'Makkah',
      roomsCount: 5,
      durationDays: 14,
      startDate: '01/09/2026',
      endDate: '15/09/2026',
      totalPrice: 45000,
      status: 'في انتظار الموافقة',
    },
    {
      id: '3',
      agreementNo: 'AGR-3382910',
      agreementName: isRTL ? 'اتفاقية فندق أنوار المدينة' : 'Anwar Al-Madinah Hotel Agreement',
      entityName: isRTL ? 'فندق أنوار المدينة' : 'Anwar Al-Madinah Hotel',
      type: 'فندق',
      city: isRTL ? 'المدينة المنورة' : 'Madinah',
      roomsCount: 3,
      durationDays: 10,
      startDate: '10/09/2026',
      endDate: '20/09/2026',
      totalPrice: 12500,
      status: 'نشطة',
    },
    {
      id: '4',
      agreementNo: 'AGR-4401824',
      agreementName: isRTL ? 'اتفاقية سكن طيبة للزوار' : 'Taiba Visitors Residence Agreement',
      entityName: isRTL ? 'سكن طيبة للزوار' : 'Taiba Visitors Residence',
      type: 'فندق',
      city: isRTL ? 'المدينة المنورة' : 'Madinah',
      roomsCount: 2,
      durationDays: 10,
      startDate: '15/08/2026',
      endDate: '25/08/2026',
      totalPrice: 8400,
      status: 'منتهية',
    },
    {
      id: '5',
      agreementNo: 'AGR-5561029',
      agreementName: isRTL ? 'اتفاقية فندق جراند زوار' : 'Grand Zuwar Hotel Agreement',
      entityName: isRTL ? 'فندق جراند زوار' : 'Grand Zuwar Hotel',
      type: 'فندق',
      city: isRTL ? 'مكة المكرمة' : 'Makkah',
      roomsCount: 6,
      durationDays: 29,
      startDate: '01/10/2026',
      endDate: '30/10/2026',
      totalPrice: 32000,
      status: 'نشطة',
    },
    {
      id: '6',
      agreementNo: 'AGR-6629104',
      agreementName: isRTL ? 'اتفاقية مجموعة فنادق البركة' : 'Al Barakah Hotels Group Agreement',
      entityName: isRTL ? 'مجموعة فنادق البركة' : 'Al Barakah Hotels Group',
      type: 'فندق',
      city: isRTL ? 'مكة المكرمة' : 'Makkah',
      roomsCount: 4,
      durationDays: 10,
      startDate: '02/09/2026',
      endDate: '12/09/2026',
      totalPrice: 64500,
      status: 'في انتظار الموافقة',
    },
    {
      id: '7',
      agreementNo: 'AGR-7738219',
      agreementName: isRTL ? 'اتفاقية نقل الحرمين السريع' : 'Haramain Express Transport Agreement',
      entityName: isRTL ? 'شركة نقل الحرمين السريع' : 'Haramain Express Transport Co.',
      type: 'نقل',
      city: isRTL ? 'مكة المكرمة' : 'Makkah',
      roomsCount: 15,
      durationDays: 30,
      startDate: '01/09/2026',
      endDate: '30/09/2026',
      totalPrice: 85000,
      status: 'نشطة',
    },
    {
      id: '8',
      agreementNo: 'AGR-8849201',
      agreementName: isRTL ? 'اتفاقية حافلات الراجحي VIP' : 'Al Rajhi VIP Buses Agreement',
      entityName: isRTL ? 'شركة الراجحي للنقل' : 'Al Rajhi Transport Co.',
      type: 'نقل',
      city: isRTL ? 'المدينة المنورة' : 'Madinah',
      roomsCount: 10,
      durationDays: 15,
      startDate: '05/09/2026',
      endDate: '20/09/2026',
      totalPrice: 42000,
      status: 'في انتظار الموافقة',
    },
  ]);

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

  // Handlers
  const handleAddSuccess = (newAgreement: AgreementItem) => {
    setAgreementsList((prev) => [newAgreement, ...prev]);
  };

  const handleOpenDetails = (agreement: AgreementItem) => {
    navigate(`/contracts/${agreement.id}`);
  };

  const handleOpenDelete = (agreement: AgreementItem) => {
    setAgreementToDelete(agreement);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (agreementToDelete) {
      setAgreementsList((prev) => prev.filter((item) => item.id !== agreementToDelete.id));
      setIsDeleteModalOpen(false);
      setAgreementToDelete(null);
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
        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Controls Bar: Search & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
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
            <div className="flex items-center gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {typeFilter === 'الكل'
                      ? t('contracts.filter_by_type', 'تصفية حسب النوع')
                      : `${t('common.filter', 'تصفية')}: ${typeFilter}`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isFilterOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-30 animate-fadeIn`}>
                    {[
                      { label: t('contracts.all_agreements', 'جميع الاتفاقيات'), val: 'الكل' },
                      { label: t('contracts.hotels_agreements', 'فنادق'), val: 'فنادق' },
                      { label: t('contracts.transport_agreements', 'شركات نقل'), val: 'نقل' },
                      { label: t('contracts.active_stat', 'الاتفاقيات النشطة'), val: 'نشطة' },
                      { label: t('contracts.pending_stat', 'اتفاقيات معلقة'), val: 'معلقة' },
                      { label: t('contracts.expired_stat', 'اتفاقيات منتهية'), val: 'منتهية' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setTypeFilter(opt.val);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer ${
                          typeFilter === opt.val ? 'text-[#16a34a] font-bold bg-slate-50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Agreement Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t('contracts.add_agreement_btn', 'إضافة اتفاقية جديدة')}</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Expired Agreements */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex justify-between items-stretch min-h-[105px]">
              <div className="flex flex-col justify-end">
                <span className="text-3xl sm:text-4xl font-bold text-[#0f172a] leading-none">
                  3
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-xs text-slate-500 font-medium">
                  {t('contracts.expired_stat', 'اتفاقيات منتهية')}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ffe3e3]/80 flex items-center justify-center shrink-0 self-end">
                  <AlertTriangle className="w-5 h-5 text-[#f03e3e] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 2: Pending Agreements */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex justify-between items-stretch min-h-[105px]">
              <div className="flex flex-col justify-end">
                <span className="text-3xl sm:text-4xl font-bold text-[#0f172a] leading-none">
                  6
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-xs text-slate-500 font-medium">
                  {t('contracts.pending_stat', 'اتفاقيات معلقة')}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fff3bf]/80 flex items-center justify-center shrink-0 self-end">
                  <Clock className="w-5 h-5 text-[#f59f00] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 3: Active Agreements */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex justify-between items-stretch min-h-[105px]">
              <div className="flex flex-col justify-end">
                <span className="text-3xl sm:text-4xl font-bold text-[#0f172a] leading-none">
                  15
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-xs text-slate-500 font-medium">
                  {t('contracts.active_stat', 'الاتفاقيات النشطة')}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#d3f9d8]/80 flex items-center justify-center shrink-0 self-end">
                  <CheckCircle2 className="w-5 h-5 text-[#2b8a3e] stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Card 4: Total Agreements */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex justify-between items-stretch min-h-[105px]">
              <div className="flex flex-col justify-end">
                <span className="text-3xl sm:text-4xl font-bold text-[#0f172a] leading-none">
                  24
                </span>
              </div>
              <div className="flex flex-col justify-between items-end text-end">
                <span className="text-xs text-slate-500 font-medium">
                  {t('contracts.total_stat', 'إجمالي الاتفاقيات')}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#d0ebff]/80 flex items-center justify-center shrink-0 self-end">
                  <FileText className="w-5 h-5 text-[#1c7ed6] stroke-[2]" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
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
                          {agreement.status === 'نشطة' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e6fcf5] text-[#0ca678]">
                              {t('contracts.status_active', 'نشطة')}
                            </span>
                          )}
                          {agreement.status === 'في انتظار الموافقة' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff9db] text-[#f59f00]">
                              {t('contracts.status_pending', 'في انتظار الموافقة')}
                            </span>
                          )}
                          {agreement.status === 'منتهية' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffe3e3] text-[#f03e3e]">
                              {t('contracts.status_expired', 'منتهية')}
                            </span>
                          )}
                        </td>

                        {/* إجراءات (حذف & عرض) */}
                        <td className="py-3 px-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* حذف */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(agreement)}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-[#ffe3e3] bg-[#fff5f5] text-[#e03131] hover:bg-[#ffe3e3] transition cursor-pointer active:scale-95"
                            >
                              {t('common.delete', 'حذف')}
                            </button>

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

