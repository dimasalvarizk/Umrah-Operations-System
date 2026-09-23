import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  ChevronDown,
  Search,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import AddHotelModal, { type NewHotelData } from '../components/hotels/AddHotelModal';
import HotelDetailsModal from '../components/hotels/HotelDetailsModal';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import {
  type HotelItem,
  type RoomTypeRow,
} from '../utils/hotelsData';
import {
  getHotelsApi,
  createHotelApi,
  updateHotelApi,
  deleteHotelApi,
} from '../services/hotelsApi';
import { recordActivity } from '../utils/activityLogger';

export type { HotelItem, RoomTypeRow };

export default function HotelsPage() {
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [searchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [isLocationFilterOpen, setIsLocationFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelItem | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<HotelItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [hotelsList, setHotelsList] = useState<HotelItem[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_hotels_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchHotels = useCallback(async () => {
    try {
      const { hotels } = await getHotelsApi({
        search: searchQuery,
        location: locationFilter,
        status: statusFilter,
      });
      if (Array.isArray(hotels)) {
        setHotelsList(hotels);
      }
    } catch {
      // Keep existing state if backend is momentarily unreachable
    }
  }, [searchQuery, locationFilter, statusFilter]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('umrah_hotels_list', JSON.stringify(hotelsList));
  }, [hotelsList]);

  // Real-time notification & URL search parameters handling
  useEffect(() => {
    const hotelIdParam =
      searchParams.get('hotelId') ||
      searchParams.get('id') ||
      searchParams.get('openHotel');

    if (hotelIdParam && hotelsList.length > 0) {
      const matched = hotelsList.find(
        (h) =>
          String(h.id) === String(hotelIdParam) ||
          (h.name && h.name.toLowerCase().includes(hotelIdParam.toLowerCase())) ||
          (h.code && h.code.toLowerCase() === hotelIdParam.toLowerCase())
      );
      if (matched) {
        setSelectedHotel(matched);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, hotelsList]);

  // Listen for custom real-time events across windows / components
  useEffect(() => {
    const handleOpenRecord = (e: any) => {
      if (e.detail && (e.detail.type === 'hotel' || e.detail.hotelId)) {
        const hId = e.detail.hotelId || e.detail.referenceId || e.detail.id;
        const matched = hotelsList.find(
          (h) => String(h.id) === String(hId) || h.code === hId
        );
        if (matched) {
          setSelectedHotel(matched);
          setIsDetailsModalOpen(true);
        }
      }
    };

    const handleRefresh = () => {
      fetchHotels();
    };

    window.addEventListener('umrah_open_record', handleOpenRecord);
    window.addEventListener('umrah_notification_refresh', handleRefresh);

    return () => {
      window.removeEventListener('umrah_open_record', handleOpenRecord);
      window.removeEventListener('umrah_notification_refresh', handleRefresh);
    };
  }, [hotelsList, fetchHotels]);

  // Click outside to close filter dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationFilterOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const locationOptions = useMemo(() => [
    { val: 'الكل', label: isRTL ? 'جميع المناطق' : 'All Regions' },
    { val: 'مكة المكرمة', label: t('hotels.makkah', 'مكة المكرمة') },
    { val: 'المدينة المنورة', label: t('hotels.madinah', 'المدينة المنورة') },
  ], [isRTL, t]);

  const selectedLocationLabel = useMemo(() => {
    if (locationFilter === 'الكل') return isRTL ? 'جميع المناطق' : 'All Regions';
    const found = locationOptions.find((opt) => opt.val === locationFilter);
    return found ? found.label : locationFilter;
  }, [locationFilter, locationOptions, isRTL]);

  const statusOptions = useMemo(() => [
    { val: 'الكل', label: isRTL ? 'جميع الحالات' : 'All Statuses' },
    { val: isRTL ? 'متاح للتسكين' : 'Available for Accommodation', label: isRTL ? 'متاح للتسكين' : 'Available for Accommodation' },
    { val: isRTL ? 'محجوز بالكامل' : 'Fully Booked', label: isRTL ? 'محجوز بالكامل' : 'Fully Booked' },
  ], [isRTL]);

  const selectedStatusLabel = useMemo(() => {
    if (statusFilter === 'الكل') return isRTL ? 'جميع الحالات' : 'All Statuses';
    const found = statusOptions.find((opt) => opt.val === statusFilter);
    return found ? found.label : statusFilter;
  }, [statusFilter, statusOptions, isRTL]);

  // Filtering
  const filteredHotels = useMemo(() => {
    return hotelsList.filter((hotel) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        (hotel.name && hotel.name.toLowerCase().includes(q)) ||
        (hotel.nameEn && hotel.nameEn.toLowerCase().includes(q)) ||
        (hotel.location && hotel.location.toLowerCase().includes(q)) ||
        (hotel.locationEn && hotel.locationEn.toLowerCase().includes(q)) ||
        (hotel.address && hotel.address.toLowerCase().includes(q)) ||
        (hotel.addressEn && hotel.addressEn.toLowerCase().includes(q)) ||
        (hotel.code && hotel.code.toLowerCase().includes(q));

      const matchLocation =
        locationFilter === 'الكل' ||
        locationFilter === 'All' ||
        hotel.location === locationFilter ||
        hotel.locationEn === locationFilter ||
        (locationFilter === 'مكة المكرمة' && (hotel.location?.includes('مكة') || hotel.locationEn === 'Makkah')) ||
        (locationFilter === 'المدينة المنورة' && (hotel.location?.includes('المدينة') || hotel.locationEn === 'Madinah')) ||
        (locationFilter === 'Makkah' && (hotel.location?.includes('مكة') || hotel.locationEn === 'Makkah')) ||
        (locationFilter === 'Madinah' && (hotel.location?.includes('المدينة') || hotel.locationEn === 'Madinah'));

      const isAvailFilter =
        statusFilter === 'متاح للتسكين' ||
        statusFilter === 'Available for Accommodation' ||
        statusFilter === 'Available';

      const isBookedFilter =
        statusFilter === 'محجوز بالكامل' ||
        statusFilter === 'Fully Booked';

      const hotelStatus = (hotel.status || '').toLowerCase();
      const isHotelAvail =
        hotel.status?.includes('متاح') ||
        hotelStatus.includes('avail') ||
        hotel.status?.includes('نشط') ||
        hotelStatus.includes('active');

      const isHotelBooked =
        hotel.status?.includes('محجوز') ||
        hotelStatus.includes('book') ||
        hotelStatus.includes('full');

      const matchStatus =
        statusFilter === 'الكل' ||
        statusFilter === 'All' ||
        (isAvailFilter && isHotelAvail) ||
        (isBookedFilter && isHotelBooked) ||
        hotel.status === statusFilter;

      return matchSearch && matchLocation && matchStatus;
    });
  }, [searchQuery, locationFilter, statusFilter, hotelsList]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 fill-none stroke-[2.3] ${
              star <= rating
                ? 'text-[#f59e0b] fill-[#f59e0b]'
                : 'text-slate-200 stroke-[1.8]'
            }`}
          />
        ))}
      </div>
    );
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
        activeTab="hotels"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={t('hotels.title', 'إدارة الفنادق والإسكان')}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-600 text-white px-4 sm:px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.5]" />
              <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
            </div>
          )}

          {/* Action / Filter Bar Card */}
          <div
            className={`relative z-20 bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 transition-all duration-400 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder={t(
                  'hotels.search_placeholder',
                  'البحث باسم الفندق، المدينة، أو التصنيف...'
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs ${
                  isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                }`}
              />
              <Search
                className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'right-3.5' : 'left-3.5'
                }`}
              />
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Region Filter Dropdown */}
              <div className="relative z-30 flex-1 sm:flex-none" ref={locationDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationFilterOpen(!isLocationFilterOpen);
                    setIsStatusFilterOpen(false);
                  }}
                  className={`w-full sm:w-auto border px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-[0.98] ${
                    locationFilter !== 'الكل'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Filter className={`w-3.5 h-3.5 ${locationFilter !== 'الكل' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{selectedLocationLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLocationFilterOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>

                {isLocationFilterOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn`}>
                    {locationOptions.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setLocationFilter(opt.val);
                          setIsLocationFilterOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer ${
                          locationFilter === opt.val ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative z-30 flex-1 sm:flex-none" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusFilterOpen(!isStatusFilterOpen);
                    setIsLocationFilterOpen(false);
                  }}
                  className={`w-full sm:w-auto border px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-[0.98] ${
                    statusFilter !== 'الكل'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Filter className={`w-3.5 h-3.5 ${statusFilter !== 'الكل' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{selectedStatusLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatusFilterOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>

                {isStatusFilterOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn`}>
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setStatusFilter(opt.val);
                          setIsStatusFilterOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer ${
                          statusFilter === opt.val ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Hotel Button */}
              {!isReadOnly && (
                <button
                  onClick={() => {
                    setEditingHotel(null);
                    setIsAddHotelOpen(true);
                  }}
                  className="bg-[#10b981] hover:bg-[#059669] text-white px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>{t('hotels.add_hotel', 'إضافة فندق جديد')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Hotels Grid: Responsive 1 / 2 / 3 columns */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredHotels.map((hotel, idx) => (
              <div
                key={hotel.id}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setIsDetailsModalOpen(true);
                }}
                className={`bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 transform flex flex-col justify-between group cursor-pointer active:scale-[0.99] relative ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${Math.min(idx * 60 + 100, 600)}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={
                      hotel.image ||
                      (hotel.location?.includes('المدينة') || hotel.locationEn === 'Madinah'
                        ? 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80')
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        hotel.location?.includes('المدينة') || hotel.locationEn === 'Madinah'
                          ? 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Card Action Buttons (Edit & Delete) */}
                  {!isReadOnly && (
                    <div
                      className={`absolute top-3 ${
                        isRTL ? 'left-3' : 'right-3'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHotel(hotel);
                            setIsAddHotelOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-700 hover:text-[#00c48c] flex items-center justify-center backdrop-blur-xs transition shadow-md border border-slate-200/90 cursor-pointer active:scale-95"
                          title={isRTL ? 'تعديل الفندق' : 'Edit Hotel'}
                        >
                          <Pencil className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setHotelToDelete(hotel);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-rose-50 text-slate-700 hover:text-rose-600 flex items-center justify-center backdrop-blur-xs transition shadow-md border border-slate-200/90 cursor-pointer active:scale-95"
                          title={isRTL ? 'حذف الفندق' : 'Delete Hotel'}
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        hotel.location.includes('مكة') ||
                        hotel.location.includes('Makkah') ||
                        hotel.locationEn === 'Makkah'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#e0f2fe] text-[#0369a1]'
                      }`}
                    >
                      {hotel.location}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        hotel.status.includes('متاح') ||
                        hotel.status.includes('Available')
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fee2e2] text-[#e11d48]'
                      }`}
                    >
                      {hotel.status}
                    </span>
                  </div>

                  {/* Hotel Name */}
                  <h3 className="text-sm sm:text-base font-bold text-[#0f172a] line-clamp-1 group-hover:text-[#00c48c] transition-colors">
                    {hotel.name}
                  </h3>

                  {/* Rating & Rooms */}
                  <div className="flex items-center justify-between text-xs">
                    {renderStars(hotel.rating)}
                    <span className="text-slate-500 font-medium">
                      {hotel.availableRooms}{' '}
                      {isRTL ? 'غرفة متاحة' : 'rooms available'}
                    </span>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 text-xs text-slate-500">
                      <span className="text-slate-500">
                        {isRTL ? 'تبدأ من' : 'Starting from'}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#10b981]">
                        {hotel.pricePerNight}
                      </span>
                      <span>
                        {t('common.currency', 'ر.س')} / {isRTL ? 'ليلة' : 'Night'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-normal">
                      {isRTL ? 'شامل الضريبة' : 'Tax Inclusive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Pagination Bar */}
          <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              {isRTL
                ? `عرض ${
                    filteredHotels.length > 0
                      ? (Math.min(
                          currentPage,
                          Math.max(1, Math.ceil(filteredHotels.length / 6))
                        ) -
                          1) *
                          6 +
                        1
                      : 0
                  }-${Math.min(currentPage * 6, filteredHotels.length)} من أصل ${
                    hotelsList.length
                  } فندق مسجل`
                : `Showing ${
                    filteredHotels.length > 0
                      ? (Math.min(
                          currentPage,
                          Math.max(1, Math.ceil(filteredHotels.length / 6))
                        ) -
                          1) *
                          6 +
                        1
                      : 0
                  }-${Math.min(
                    currentPage * 6,
                    filteredHotels.length
                  )} of ${hotelsList.length} registered hotels`}
            </div>

            <div className="flex items-center gap-1.5">
              {(() => {
                const totalHotelPages = Math.max(
                  1,
                  Math.ceil(filteredHotels.length / 6)
                );
                const validPage = Math.min(currentPage, totalHotelPages);
                return (
                  <>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-40"
                      disabled={validPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalHotelPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                            validPage === page
                              ? 'bg-[#10b981] text-white shadow-xs'
                              : 'border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalHotelPages, p + 1))
                      }
                      className="w-8 h-8 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-40"
                      disabled={validPage >= totalHotelPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Hotel Modal */}
      <AddHotelModal
        isOpen={isAddHotelOpen}
        initialHotel={editingHotel}
        onClose={() => {
          setIsAddHotelOpen(false);
          setEditingHotel(null);
        }}
        onSuccess={async (newHotel: NewHotelData) => {
          if (editingHotel) {
            try {
              const updated = await updateHotelApi(editingHotel.id, newHotel as any);
              setHotelsList((prev) =>
                prev.map((h) =>
                  h.id === editingHotel.id ? { ...h, ...updated } : h
                )
              );
              if (selectedHotel && selectedHotel.id === editingHotel.id) {
                setSelectedHotel({ ...selectedHotel, ...updated });
              }
              window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
              showToast(isRTL ? 'تم تحديث بيانات الفندق بنجاح!' : 'Hotel updated successfully!');
            } catch (err: any) {
              setHotelsList((prev) =>
                prev.map((h) =>
                  h.id === editingHotel.id ? { ...h, ...(newHotel as any) } : h
                )
              );
              recordActivity({
                action: 'UPDATE',
                module: 'hotels',
                entityId: editingHotel.id,
                entityName: newHotel.name || editingHotel.name,
                descriptionEn: `Updated hotel details: ${newHotel.name || editingHotel.name}.`,
                descriptionAr: `تحديث بيانات الفندق: ${newHotel.name || editingHotel.name}.`,
              });
              window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
              showToast(isRTL ? 'تم حفظ التعديلات محلياً' : 'Saved changes locally.');
            }
          } else {
            try {
              const created = await createHotelApi(newHotel as any);
              setHotelsList((prev) => [created, ...prev.filter((h) => h.id !== created.id)]);
              setSearchQuery('');
              setLocationFilter('الكل');
              setStatusFilter('الكل');
              setCurrentPage(1);
              window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
              showToast(isRTL ? 'تمت إضافة الفندق الجديد وحفظه في قاعدة البيانات بنجاح!' : 'New hotel added and saved to database successfully!');
            } catch (err: any) {
              console.error('Failed to create hotel via API:', err);
              const isMadinah = newHotel.locationEn === 'Madinah' || newHotel.location?.includes('المدينة');
              const localHotel: HotelItem = {
                id: `local-${Date.now()}`,
                code: `HTL-${isMadinah ? 'MED' : 'MKH'}-${Date.now().toString().slice(-4)}`,
                ...(newHotel as any),
              };
              setHotelsList((prev) => [localHotel, ...prev]);
              setSearchQuery('');
              setLocationFilter('الكل');
              setStatusFilter('الكل');
              setCurrentPage(1);
              recordActivity({
                action: 'CREATE',
                module: 'hotels',
                entityId: localHotel.code || localHotel.id,
                entityName: localHotel.name,
                descriptionEn: `Added new hotel partner: ${localHotel.name} (${localHotel.location || ''}).`,
                descriptionAr: `إضافة فندق شريك جديد: ${localHotel.name} (${localHotel.location || ''}).`,
              });
              window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
              showToast(isRTL ? 'تمت إضافة الفندق محلياً بنجاح!' : 'Hotel added locally successfully!');
            }
          }
          setEditingHotel(null);
        }}
      />

      {/* Hotel Details Modal */}
      <HotelDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        hotel={selectedHotel}
        onUpdateHotel={async (updatedHotel: HotelItem) => {
          try {
            const res = await updateHotelApi(updatedHotel.id, updatedHotel);
            window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));

            setHotelsList((prev) =>
              prev.map((h) => (h.id === updatedHotel.id ? res : h))
            );
            setSelectedHotel(res);
            showToast(isRTL ? 'تم تحديث بيانات التسكين والغرف بنجاح!' : 'Room details updated successfully!');
          } catch {
            setHotelsList((prev) =>
              prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h))
            );
            setSelectedHotel(updatedHotel);
            recordActivity({
              action: 'UPDATE',
              module: 'hotels',
              entityId: updatedHotel.id,
              entityName: updatedHotel.name,
              descriptionEn: `Updated hotel room details: ${updatedHotel.name}.`,
              descriptionAr: `تحديث تفاصيل تسكين وغرف الفندق: ${updatedHotel.name}.`,
            });
          }
        }}
        onEdit={(hotelToEdit: HotelItem) => {
          setIsDetailsModalOpen(false);
          setEditingHotel(hotelToEdit);
          setIsAddHotelOpen(true);
        }}
      />

      {/* Delete Hotel Confirmation Modal */}
      {hotelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-5 animate-scaleUp"
            dir={direction}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'تأكيد حذف الفندق' : 'Delete Hotel Confirmation'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL
                    ? 'هل أنت متأكد من رغبتك في حذف هذا الفندق من النظام وقاعدة البيانات؟'
                    : 'Are you sure you want to delete this hotel from the system and database?'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
              <img
                src={hotelToDelete.image}
                alt={hotelToDelete.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {hotelToDelete.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {hotelToDelete.location}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                  {hotelToDelete.pricePerNight} {t('common.currency', 'ر.س')} /{' '}
                  {isRTL ? 'ليلة' : 'Night'}
                </div>
              </div>
            </div>

            <p className="text-xs text-rose-600 bg-rose-50/80 border border-rose-200/60 rounded-xl p-3 leading-relaxed">
              {isRTL
                ? 'تنبيه: سيتم حذف جميع أسعار الغرف وبيانات التسكين المرتبطة بهذا الفندق نهائياً من قاعدة البيانات.'
                : 'Warning: All room rates and accommodation details associated with this hotel will be permanently deleted from database.'}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setHotelToDelete(null)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-slate-200 active:scale-95"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = hotelToDelete.id;
                  setHotelsList((prev) => prev.filter((h) => h.id !== id));
                  if (selectedHotel && selectedHotel.id === id) {
                    setSelectedHotel(null);
                    setIsDetailsModalOpen(false);
                  }
                  setHotelToDelete(null);
                  try {
                    await deleteHotelApi(id);
                    showToast(
                      isRTL
                        ? 'تم حذف الفندق بنجاح من قاعدة البيانات'
                        : 'Hotel deleted successfully from database.'
                    );
                    window.dispatchEvent(
                      new CustomEvent('umrah_notification_refresh')
                    );
                  } catch (err) {
                    console.error('Failed to delete hotel:', err);
                  }
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-xs active:scale-95"
              >
                {isRTL ? 'نعم، حذف الفندق' : 'Yes, Delete Hotel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
