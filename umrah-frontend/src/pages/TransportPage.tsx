import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  ChevronDown,
  Search,
  Plus,
  Star,
  ArrowLeft,
  ArrowRight,
  Building2,
} from 'lucide-react';
import TransportDetailsModal, {
  type TransportCompany,
} from '../components/transport/TransportDetailsModal';
import AddTransportModal from '../components/transport/AddTransportModal';
import CompanyFleetView from '../components/transport/CompanyFleetView';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';

import {
  getTransportsApi,
  createTransportApi,
} from '../services/transportApi';

export default function TransportPage() {
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('الكل');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState<TransportCompany | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const [companiesList, setCompaniesList] = useState<TransportCompany[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_transports_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchTransports = async () => {
    try {
      const { transports } = await getTransportsApi({
        search: searchQuery,
        region: regionFilter,
      });
      if (Array.isArray(transports)) {
        setCompaniesList(transports);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchTransports();
  }, [searchQuery, regionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchTransports();
    };
    window.addEventListener('umrah_notification_refresh', handleRefresh);
    return () => window.removeEventListener('umrah_notification_refresh', handleRefresh);
  }, [searchQuery, regionFilter]);

  useEffect(() => {
    localStorage.setItem('umrah_transports_list', JSON.stringify(companiesList));
  }, [companiesList]);

  // Filtering
  const filteredCompanies = useMemo(() => {
    return companiesList.filter((company) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.phone.includes(q) ||
        company.region.toLowerCase().includes(q);

      const matchesRegion =
        regionFilter === 'الكل' || company.region === regionFilter;

      return matchesQuery && matchesRegion;
    });
  }, [companiesList, searchQuery, regionFilter]);

  const pageSize = 9;
  const totalItems = filteredCompanies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCompanies = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, validCurrentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, regionFilter]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;

          return (
            <div key={starIndex} className="relative">
              <Star
                className={`w-3.5 h-3.5 ${
                  isFilled
                    ? 'text-amber-500 stroke-amber-500 fill-none stroke-[2.2]'
                    : 'text-slate-300 stroke-slate-300 fill-none stroke-[2]'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status: TransportCompany['status']) => {
    switch (status) {
      case 'متاح':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#15803d]">
            {isRTL ? 'متاح' : 'Available'}
          </span>
        );
      case 'متوسط':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#fef9c3] text-[#d97706]">
            {isRTL ? 'متوسط' : 'Medium'}
          </span>
        );
      case 'محجوز':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#fee2e2] text-[#e11d48]">
            {isRTL ? 'محجوز' : 'Occupied'}
          </span>
        );
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="transport"
      />

      {/* Main Page Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={t('transport.title', 'Transportation Companies')}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          showBackButton={!!selectedCompany}
          onBackClick={() => setSelectedCompany(null)}
        />

        <main className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {selectedCompany ? (
            <CompanyFleetView
              company={selectedCompany}
              onBack={() => setSelectedCompany(null)}
            />
          ) : (
            <>
              {/* Action Row & Breadcrumb */}
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-400 transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                {/* Breadcrumb on Left */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
                  <span className="text-slate-500 font-normal">
                    {t('transport.breadcrumb_parent', 'Transportation')} &gt;
                  </span>
                  <span className="font-bold text-[#0f172a]">
                    {t('transport.breadcrumb_current', 'Companies')}
                  </span>
                </div>

                {/* Search, Filter & Add Button on Right */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[180px] sm:w-64">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isRTL ? 'البحث عن شركة...' : 'Search companies...'}
                      className={`w-full bg-white border border-slate-200/90 rounded-xl py-2 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition shadow-2xs ${
                        isRTL ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'
                      }`}
                    />
                    <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'right-3' : 'left-3'
                    }`} />
                  </div>

                  {/* Region Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="bg-white border border-slate-200/90 hover:bg-slate-50 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2 shadow-2xs cursor-pointer transition active:scale-[0.98]"
                    >
                      <span>{regionFilter === 'الكل' ? (isRTL ? 'جميع المناطق' : 'All Regions') : regionFilter}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className={`absolute mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-20 text-xs text-slate-700 animate-fadeIn ${
                        isRTL ? 'right-0' : 'left-0'
                      }`}>
                        {[
                          { id: 'الكل', label: isRTL ? 'جميع المناطق' : 'All Regions' },
                          { id: isRTL ? 'مكة المكرمة' : 'Makkah', label: isRTL ? 'مكة المكرمة' : 'Makkah' },
                          { id: isRTL ? 'المدينة المنورة' : 'Madinah', label: isRTL ? 'المدينة المنورة' : 'Madinah' },
                          { id: isRTL ? 'جدة' : 'Jeddah', label: isRTL ? 'جدة' : 'Jeddah' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setRegionFilter(item.id);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 hover:bg-slate-50 transition cursor-pointer ${
                              isRTL ? 'text-right' : 'text-left'
                            } ${
                              regionFilter === item.id
                                ? 'text-[#10b981] font-bold bg-slate-50/50'
                                : 'font-normal'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Company Button */}
                  {!isReadOnly && (
                    <button
                      onClick={() => setIsAddCompanyOpen(true)}
                      className="bg-[#10b981] hover:bg-[#059669] text-white px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>{t('transport.add_company', 'Add Company')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Companies Grid */}
              {filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center text-slate-400">
                  {isRTL ? 'لا توجد شركات نقل مطابقة لبحثك.' : 'No transport companies match your search.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedCompanies.map((company, idx) => (
                    <div
                      key={company.id}
                      className={`bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between group ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${Math.min(idx * 60 + 100, 600)}ms` }}
                    >
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {company.image ? (
                          <img
                            src={company.image}
                            alt={company.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                            <Building2 className="w-9 h-9 text-slate-300" />
                            <span className="text-[11px] font-semibold text-slate-400">{isRTL ? 'بدون صورة' : 'No Photo'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                            {company.name}
                          </h3>
                          {getStatusBadge(company.status)}
                        </div>

                        <div className="flex items-center justify-start gap-2 pt-0.5" dir="ltr">
                          {renderStars(company.rating)}
                          <span className="text-xs sm:text-sm font-bold text-slate-700">
                            {company.rating} / 5.0
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Fleet Size:</span>
                            <span className="font-bold text-slate-900">{company.fleetLabel}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Contact:</span>
                            <span
                              dir="ltr"
                              className="font-bold text-slate-900"
                            >
                              {company.phone}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2.5">
                          <button
                            onClick={() => {
                              setSelectedCompany(company);
                            }}
                            className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-[#10b981] hover:text-[#059669] transition cursor-pointer"
                          >
                            <span>{t('transport.view_details', 'View Details')}</span>
                            <ArrowIcon className="w-4 h-4 stroke-[2.2] transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Bar */}
              {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8 text-xs sm:text-sm">
                  <div className="text-slate-600 font-medium">
                    {isRTL ? (
                      <>
                        عرض <span className="font-bold text-slate-900">{Math.min(totalItems, (validCurrentPage - 1) * pageSize + 1)} - {Math.min(validCurrentPage * pageSize, totalItems)}</span> من أصل <span className="font-bold text-slate-900">{totalItems}</span> شركات
                      </>
                    ) : (
                      <>
                        Showing <span className="font-bold text-slate-900">{Math.min(totalItems, (validCurrentPage - 1) * pageSize + 1)} - {Math.min(validCurrentPage * pageSize, totalItems)}</span> of <span className="font-bold text-slate-900">{totalItems}</span> Companies
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={validCurrentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isRTL ? 'السابق' : 'Previous'}
                    </button>

                    <div className="bg-white border border-slate-200/90 text-slate-800 px-4 py-2 rounded-xl font-bold shadow-2xs">
                      {isRTL ? `صفحة ${validCurrentPage} من ${totalPages}` : `Page ${validCurrentPage} of ${totalPages}`}
                    </div>

                    <button
                      disabled={validCurrentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isRTL ? 'التالي' : 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <TransportDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
      />

      <AddTransportModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onSuccess={async (newCompany) => {
          try {
            const created = await createTransportApi(newCompany as any);
            setCompaniesList((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
            window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
          } catch (err) {
            console.error('Failed to create transport company via API:', err);
            setCompaniesList((prev) => [newCompany, ...prev]);
          }
        }}
      />
    </div>
  );
}
