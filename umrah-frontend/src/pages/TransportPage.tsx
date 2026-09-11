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
} from 'lucide-react';
import fleetMain from '../assets/fleet-main.png';
import TransportDetailsModal, {
  type TransportCompany,
} from '../components/transport/TransportDetailsModal';
import AddTransportModal from '../components/transport/AddTransportModal';
import CompanyFleetView from '../components/transport/CompanyFleetView';
import { useLanguage } from '../context/LanguageContext';

export default function TransportPage() {
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('الكل');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState<TransportCompany | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const [companiesList, setCompaniesList] = useState<TransportCompany[]>([]);

  useEffect(() => {
    setCompaniesList([
      {
        id: '1',
        name: isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Tr...',
        status: 'متاح',
        rating: 5.0,
        fleetSize: 18,
        fleetLabel: isRTL ? '18 مركبة' : '18 Vehicles',
        phone: '+966 50 123 4567',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'حافلات نقل حجاج ومعتمرين 50 راكب' : '50-Seater Pilgrim Mass Buses',
        image:
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        name: isRTL ? 'شركة الراجحي للنقل' : 'Al Rajhi Transport',
        status: 'متاح',
        rating: 4.5,
        fleetSize: 24,
        fleetLabel: isRTL ? '24 مركبة' : '24 Vehicles',
        phone: '+966 50 234 5678',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'فانات سياحية مجهزة وحافلات VIP' : 'Equipped Tourist Vans & VIP Buses',
        image:
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        name: isRTL ? 'الليموزين السعودي' : 'Saudi Limousine',
        status: 'متوسط',
        rating: 4.0,
        fleetSize: 15,
        fleetLabel: isRTL ? '15 مركبة' : '15 Vehicles',
        phone: '+966 50 345 6789',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'سيارات ليموزين VIP وفانات نقل فندقي' : 'VIP Limousines & Hotel Shuttles',
        image: fleetMain,
      },
      {
        id: '4',
        name: isRTL ? 'سابتكو (SAPTCO)' : 'SAPTCO',
        status: 'متاح',
        rating: 4.5,
        fleetSize: 42,
        fleetLabel: isRTL ? '42 مركبة' : '42 Vehicles',
        phone: '+966 50 456 7890',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'أسطول متكامل: حافلات وفانات وليموزين' : 'Integrated Fleet: Buses, Vans & Limos',
        image:
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '5',
        name: isRTL ? 'هلا للنقل' : 'Hala Transport',
        status: 'متاح',
        rating: 4.0,
        fleetSize: 20,
        fleetLabel: isRTL ? '20 مركبة' : '20 Vehicles',
        phone: '+966 50 567 8901',
        region: isRTL ? 'جدة' : 'Jeddah',
        vehicleCategory: isRTL ? 'حافلات سياحية وفانات نقل جماعي' : 'Tourist Coaches & Group Vans',
        image:
          'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '6',
        name: isRTL ? 'النقل المكي المتميز' : 'Al Makkiyah Transport',
        status: 'محجوز',
        rating: 3.5,
        fleetSize: 8,
        fleetLabel: isRTL ? '8 مركبات' : '8 Vehicles',
        phone: '+966 50 678 9012',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'فانات عائلية ومركبات تفويج بالمطار' : 'Family Vans & Airport Transfers',
        image:
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '7',
        name: isRTL ? 'شركة تواصل للنقل' : 'Tawasul Transport',
        status: 'متاح',
        rating: 4.0,
        fleetSize: 12,
        fleetLabel: isRTL ? '12 مركبة' : '12 Vehicles',
        phone: '+966 50 789 0123',
        region: isRTL ? 'مكة المكرمة' : 'Makkah',
        vehicleCategory: isRTL ? 'فانات نقل معتمرين وحافلات كوستر' : 'Pilgrim Vans & Coaster Buses',
        image:
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '8',
        name: isRTL ? 'المدينة السريعة للنقل' : 'Al Madinah Express',
        status: 'متوسط',
        rating: 3.5,
        fleetSize: 10,
        fleetLabel: isRTL ? '10 مركبات' : '10 Vehicles',
        phone: '+966 50 890 1234',
        region: isRTL ? 'المدينة المنورة' : 'Madinah',
        vehicleCategory: isRTL ? 'سيارات سيدان فندقية وفانات نقل سريع' : 'Hotel Sedans & Rapid Vans',
        image:
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '9',
        name: isRTL ? 'الشركة الملكية للنقل' : 'Royal Transport Co.',
        status: 'متاح',
        rating: 5.0,
        fleetSize: 30,
        fleetLabel: isRTL ? '30 مركبة' : '30 Vehicles',
        phone: '+966 50 901 2345',
        region: isRTL ? 'المدينة المنورة' : 'Madinah',
        vehicleCategory: isRTL ? 'حافلات فاخرة لكبار ضيوف الرحمن VIP' : 'Luxury VIP Pilgrim Transporters',
        image:
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      },
    ]);
  }, [isRTL]);

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;
          const isHalf = !isFilled && rating >= starIndex - 0.5;

          return (
            <div key={starIndex} className="relative">
              <Star
                className={`w-3.5 h-3.5 ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 stroke-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50 stroke-amber-400'
                    : 'text-amber-400 stroke-amber-400 fill-none stroke-[1.8]'
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

        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {selectedCompany ? (
            <CompanyFleetView
              company={selectedCompany}
              onBack={() => setSelectedCompany(null)}
            />
          ) : (
            <>
              {/* Action Row & Breadcrumb */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:w-64">
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
                      className="bg-white border border-slate-200/90 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2 shadow-2xs cursor-pointer transition"
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
                  <button
                    onClick={() => setIsAddCompanyOpen(true)}
                    className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>{t('transport.add_company', 'Add Company')}</span>
                  </button>
                </div>
              </div>

              {/* Companies Grid */}
              {filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                  {isRTL ? 'لا توجد شركات نقل مطابقة لبحثك.' : 'No transport companies match your search.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={company.image}
                          alt={company.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8 text-xs sm:text-sm">
                <div className="text-slate-600 font-medium">
                  {isRTL ? (
                    <>عرض <span className="font-bold text-slate-900">9</span> من <span className="font-bold text-slate-900">24</span> شركات</>
                  ) : (
                    <>Showing <span className="font-bold text-slate-900">9</span> of <span className="font-bold text-slate-900">24</span> Companies</>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isRTL ? 'السابق' : 'Previous'}
                  </button>

                  <div className="bg-white border border-slate-200/90 text-slate-800 px-4 py-2 rounded-xl font-bold shadow-2xs">
                    {isRTL ? `صفحة ${currentPage} من 3` : `Page ${currentPage} of 3`}
                  </div>

                  <button
                    disabled={currentPage >= 3}
                    onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                    className="bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isRTL ? 'التالي' : 'Next'}
                  </button>
                </div>
              </div>
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
        onSuccess={(newCompany) => {
          setCompaniesList((prev) => [newCompany, ...prev]);
        }}
      />
    </div>
  );
}
