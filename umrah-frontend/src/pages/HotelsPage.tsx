import { useState, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  ChevronDown,
  Search,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AddHotelModal, { type NewHotelData } from '../components/hotels/AddHotelModal';
import HotelDetailsModal from '../components/hotels/HotelDetailsModal';
import { useLanguage } from '../context/LanguageContext';

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  status: string;
  rating: number; // 1 to 5
  availableRooms: number;
  pricePerNight: number;
  image: string;
}

export default function HotelsPage() {
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [hotelsList, setHotelsList] = useState<HotelItem[]>([
    {
      id: '1',
      name: isRTL ? 'فندق برج جوار الحرم السكني' : 'Borj Jowar Al-Haram Residential Hotel',
      location: isRTL ? 'مكة المكرمة' : 'Makkah',
      status: isRTL ? 'محجوز بالكامل' : 'Fully Booked',
      rating: 5,
      availableRooms: 310,
      pricePerNight: 620,
      image:
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      name: isRTL ? 'فندق المدينة السكني المتميز' : 'Madinah Premium Residential Hotel',
      location: isRTL ? 'المدينة المنورة' : 'Madinah',
      status: isRTL ? 'متاح للتسكين' : 'Available for Accommodation',
      rating: 4,
      availableRooms: 85,
      pricePerNight: 380,
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      name: isRTL ? 'فندق مكة الكبير ذو المنارتين' : 'Grand Makkah Twin Minaret Hotel',
      location: isRTL ? 'مكة المكرمة' : 'Makkah',
      status: isRTL ? 'متاح للتسكين' : 'Available for Accommodation',
      rating: 5,
      availableRooms: 120,
      pricePerNight: 450,
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '4',
      name: isRTL ? 'فندق رياض الحرم الفاخر' : 'Riyad Al-Haram Luxury Hotel',
      location: isRTL ? 'المدينة المنورة' : 'Madinah',
      status: isRTL ? 'محجوز بالكامل' : 'Fully Booked',
      rating: 5,
      availableRooms: 200,
      pricePerNight: 550,
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '5',
      name: isRTL ? 'فندق ضيافة مكة الاستثماري' : 'Diyafat Makkah Investment Hotel',
      location: isRTL ? 'مكة المكرمة' : 'Makkah',
      status: isRTL ? 'متاح للتسكين' : 'Available for Accommodation',
      rating: 4,
      availableRooms: 150,
      pricePerNight: 410,
      image:
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '6',
      name: isRTL ? 'فندق أنوار المدينة الحديث' : 'Anwar Al-Madinah Modern Hotel',
      location: isRTL ? 'المدينة المنورة' : 'Madinah',
      status: isRTL ? 'متاح للتسكين' : 'Available for Accommodation',
      rating: 3,
      availableRooms: 95,
      pricePerNight: 290,
      image:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  // Filtering
  const filteredHotels = useMemo(() => {
    return hotelsList.filter((hotel) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation =
        locationFilter === 'الكل' || hotel.location === locationFilter;

      const matchStatus =
        statusFilter === 'الكل' || hotel.status === statusFilter;

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
                ? 'text-[#f59e0b]'
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

        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Action / Filter Bar Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder={t('hotels.search_placeholder', 'البحث باسم الفندق، المدينة، أو التصنيف...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                }`}
              />
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-3.5' : 'left-3.5'
              }`} />
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Region Filter */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`appearance-none bg-[#f8fafc] hover:bg-slate-100/80 border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                  }`}
                >
                  <option value="الكل">{isRTL ? 'المنطقة: جميع المناطق' : 'Region: All Regions'}</option>
                  <option value={isRTL ? 'مكة المكرمة' : 'Makkah'}>{t('hotels.makkah', 'مكة المكرمة')}</option>
                  <option value={isRTL ? 'المدينة المنورة' : 'Madinah'}>{t('hotels.madinah', 'المدينة المنورة')}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`appearance-none bg-[#f8fafc] hover:bg-slate-100/80 border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                  }`}
                >
                  <option value="الكل">{isRTL ? 'الحالة: الكل' : 'Status: All'}</option>
                  <option value={isRTL ? 'متاح للتسكين' : 'Available for Accommodation'}>{isRTL ? 'متاح للتسكين' : 'Available for Accommodation'}</option>
                  <option value={isRTL ? 'محجوز بالكامل' : 'Fully Booked'}>{isRTL ? 'محجوز بالكامل' : 'Fully Booked'}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>

              {/* Apply Filter Button */}
              <button
                type="button"
                onClick={() => {}}
                className="bg-[#1c2844] hover:bg-[#152037] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center cursor-pointer active:scale-[0.99] whitespace-nowrap"
              >
                <span>{t('hotels.apply_filter', 'تطبيق التصفية')}</span>
              </button>

              {/* Add New Hotel Button */}
              <button
                onClick={() => setIsAddHotelOpen(true)}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{t('hotels.add_hotel', 'إضافة فندق جديد')}</span>
              </button>
            </div>
          </div>

          {/* Hotels Grid: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setIsDetailsModalOpen(true);
                }}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        hotel.location.includes('مكة') || hotel.location.includes('Makkah')
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#e0f2fe] text-[#0369a1]'
                      }`}
                    >
                      {hotel.location}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        hotel.status.includes('متاح') || hotel.status.includes('Available')
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
                      {hotel.availableRooms} {isRTL ? 'غرفة متاحة' : 'rooms available'}
                    </span>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 text-xs text-slate-500">
                      <span className="text-slate-500">{isRTL ? 'تبدأ من' : 'Starting from'}</span>
                      <span className="text-base sm:text-lg font-bold text-[#10b981]">
                        {hotel.pricePerNight}
                      </span>
                      <span>{t('common.currency', 'ر.س')} / {isRTL ? 'ليلة' : 'Night'}</span>
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
              {isRTL ? 'عرض ١-٦ من أصل ٢٤ فندق مسجل' : 'Showing 1-6 of 24 registered hotels'}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-40"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                  currentPage === 2
                    ? 'bg-[#10b981] text-white shadow-xs'
                    : 'border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                  currentPage === 1
                    ? 'bg-[#10b981] text-white shadow-xs'
                    : 'border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                className="w-8 h-8 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-40"
                disabled={currentPage === 2}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddHotelModal
        isOpen={isAddHotelOpen}
        onClose={() => setIsAddHotelOpen(false)}
        onSuccess={(newHotel: NewHotelData) => {
          setHotelsList((prev) => [
            {
              id: String(Date.now()),
              ...newHotel,
            },
            ...prev,
          ]);
        }}
      />

      <HotelDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        hotel={selectedHotel}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsAddHotelOpen(true);
        }}
      />
    </div>
  );
}
