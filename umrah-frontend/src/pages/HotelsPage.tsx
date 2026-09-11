import { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import AddHotelModal, { type NewHotelData } from '../components/hotels/AddHotelModal';
import HotelDetailsModal from '../components/hotels/HotelDetailsModal';
import { useLanguage } from '../context/LanguageContext';
import {
  type HotelItem,
  type RoomTypeRow,
  getHotelsList,
  saveHotelsList,
} from '../utils/hotelsData';

export type { HotelItem, RoomTypeRow };

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
  const [editingHotel, setEditingHotel] = useState<HotelItem | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<HotelItem | null>(null);

  const [hotelsList, setHotelsList] = useState<HotelItem[]>(() => getHotelsList());

  useEffect(() => {
    saveHotelsList(hotelsList);
  }, [hotelsList]);

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
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer active:scale-[0.99] relative"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Card Action Buttons (Edit & Delete) */}
                  <div
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5 z-10`}
                    onClick={(e) => e.stopPropagation()}
                  >
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
        initialHotel={editingHotel}
        onClose={() => {
          setIsAddHotelOpen(false);
          setEditingHotel(null);
        }}
        onSuccess={(newHotel: NewHotelData) => {
          if (editingHotel) {
            setHotelsList((prev) =>
              prev.map((h) =>
                h.id === editingHotel.id
                  ? {
                      ...h,
                      ...newHotel,
                    }
                  : h
              )
            );
            if (selectedHotel && selectedHotel.id === editingHotel.id) {
              setSelectedHotel({
                ...selectedHotel,
                ...newHotel,
              });
            }
          } else {
            setHotelsList((prev) => [
              {
                id: String(Date.now()),
                ...newHotel,
              },
              ...prev,
            ]);
          }
          setEditingHotel(null);
        }}
      />

      <HotelDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        hotel={selectedHotel}
        onUpdateHotel={(updatedHotel: HotelItem) => {
          setHotelsList((prev) =>
            prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h))
          );
          setSelectedHotel(updatedHotel);
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
                  {isRTL ? 'هل أنت متأكد من رغبتك في حذف هذا الفندق من النظام؟' : 'Are you sure you want to delete this hotel from the system?'}
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
                <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">{hotelToDelete.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{hotelToDelete.location}</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                  {hotelToDelete.pricePerNight} {t('common.currency', 'ر.س')} / {isRTL ? 'ليلة' : 'Night'}
                </div>
              </div>
            </div>

            <p className="text-xs text-rose-600 bg-rose-50/80 border border-rose-200/60 rounded-xl p-3 leading-relaxed">
              {isRTL
                ? 'تنبيه: سيتم حذف جميع أسعار الغرف وبيانات التسكين المرتبطة بهذا الفندق نهائياً من النظام.'
                : 'Warning: All room rates and accommodation details associated with this hotel will be permanently deleted.'}
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
                onClick={() => {
                  setHotelsList((prev) => prev.filter((h) => h.id !== hotelToDelete.id));
                  if (selectedHotel && selectedHotel.id === hotelToDelete.id) {
                    setSelectedHotel(null);
                    setIsDetailsModalOpen(false);
                  }
                  setHotelToDelete(null);
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
