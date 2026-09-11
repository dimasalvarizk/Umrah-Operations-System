import { X, MapPin, Building2, Bed, CheckCircle2, SquarePen, Star } from 'lucide-react';
import type { HotelItem } from '../../pages/HotelsPage';
import { useLanguage } from '../../context/LanguageContext';

interface HotelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel?: HotelItem | null;
  onEdit?: (hotel: HotelItem) => void;
}

export default function HotelDetailsModal({
  isOpen,
  onClose,
  hotel,
  onEdit,
}: HotelDetailsModalProps) {
  const { t, isRTL, direction } = useLanguage();

  if (!isOpen || !hotel) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 fill-none stroke-[2.3] ${star <= rating ? 'text-[#f59e0b]' : 'text-slate-200 stroke-[1.8]'
              }`}
          />
        ))}
      </div>
    );
  };

  const roomTypes = [
    { name: isRTL ? 'غرفة مزدوجة (Double)' : 'Double Room', capacity: isRTL ? '٢ أشخاص' : '2 Persons', price: hotel.pricePerNight, rooms: Math.round(hotel.availableRooms * 0.4) },
    { name: isRTL ? 'غرفة ثلاثية (Triple)' : 'Triple Room', capacity: isRTL ? '٣ أشخاص' : '3 Persons', price: Math.round(hotel.pricePerNight * 1.25), rooms: Math.round(hotel.availableRooms * 0.3) },
    { name: isRTL ? 'غرفة رباعية (Quad)' : 'Quad Room', capacity: isRTL ? '٤ أشخاص' : '4 Persons', price: Math.round(hotel.pricePerNight * 1.5), rooms: Math.round(hotel.availableRooms * 0.2) },
    { name: isRTL ? 'جناح عائلي فاخر (Family Suite)' : 'Family Suite', capacity: isRTL ? '٥-٦ أشخاص' : '5-6 Persons', price: Math.round(hotel.pricePerNight * 2), rooms: Math.max(5, Math.round(hotel.availableRooms * 0.1)) },
  ];

  const amenities = isRTL
    ? [
      'إنترنت واي فاي مجاني فائق السرعة',
      'حافلات ترددية مجانية للحرم على مدار الساعة',
      'مطعم وبوفيه إفطار مفتوح فاخر',
      'خدمة استقبال وغرف 24/7',
      'مكتب حجز وتفويج للمعتمرين',
      'مصاعد بانورامية وسريعة',
      'مرافق مهيأة لذوي الاحتياجات الخاصة',
      'خدمة غسيل وكي الملابس السريعة',
    ]
    : [
      'High-Speed Free Wi-Fi Internet',
      '24/7 Free Haram Shuttle Buses',
      'Gourmet Buffet & On-Site Restaurant',
      '24/7 Front Desk & Concierge Service',
      'Pilgrim Logistics & Booking Center',
      'High-Speed Panoramic Elevators',
      'Accessible Facilities for Disabled Guests',
      'Express Laundry & Dry Cleaning',
    ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[94vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-[#f8fafc] shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
              {t('hotels.hotel_details', 'تفاصيل الفندق')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                {hotel.name}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs ${hotel.location.includes('مكة') || hotel.location.includes('Makkah')
                    ? 'bg-[#fef3c7] text-[#b45309]'
                    : 'bg-[#e0f2fe] text-[#0369a1]'
                  }`}
              >
                {hotel.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 sm:px-8 py-5 space-y-6 overflow-y-auto flex-1 bg-white">
          {/* Hotel Hero Banner & Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {/* Image Preview */}
            <div className="md:col-span-1 rounded-2xl overflow-hidden border border-slate-200/80 h-48 md:h-full min-h-[190px] relative shadow-2xs">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 right-2.5">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm ${hotel.status.includes('متاح') || hotel.status.includes('Available')
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-[#fee2e2] text-[#e11d48]'
                    }`}
                >
                  {hotel.status}
                </span>
              </div>
            </div>

            {/* Quick Cards in 2x2 Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('hotels.hotel_name', 'اسم الفندق')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                  {hotel.name}
                </span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('hotels.city', 'المدينة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00c48c]" />
                  <span>{hotel.location}</span>
                </span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('hotels.stars', 'النجوم')}</span>
                <div>{renderStars(hotel.rating)}</div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('hotels.available_rooms', 'الغرف المتاحة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {hotel.availableRooms} {isRTL ? 'غرفة متاحة' : 'Rooms Available'}
                </span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between sm:col-span-2">
                <span className="text-xs text-slate-400 font-normal">{t('hotels.price_per_night', 'متوسط السعر / ليلة')}</span>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="text-slate-400">{isRTL ? 'تبدأ من' : 'From'}</span>
                  <span className="text-base font-bold text-[#00c48c]">
                    {hotel.pricePerNight}
                  </span>
                  <span className="text-slate-500">{t('common.currency', 'ر.س')} / {isRTL ? 'ليلة' : 'night'}</span>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mr-1">
                    {isRTL ? 'شامل الضريبة' : 'Inc. Tax'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Room types */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <Bed className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('hotels.room_types', 'أنواع الغرف والأسعار')}</span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className={`w-full border-collapse text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b border-slate-200/80 text-xs font-bold text-slate-600 bg-[#f8fafc]">
                    <th className="py-2.5 px-4">{t('hotels.room_types', 'نوع الغرفة')}</th>
                    <th className="py-2.5 px-4">{t('common.capacity', 'السعة القصوى')}</th>
                    <th className="py-2.5 px-4">{t('hotels.price_per_night', 'السعر لليلة')}</th>
                    <th className="py-2.5 px-4">{t('hotels.available_rooms', 'الغرف المتوفرة')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roomTypes.map((room, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-[#0f172a]">{room.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{room.capacity}</td>
                      <td className="py-2.5 px-4 font-bold text-[#00c48c]">{room.price} {t('common.currency', 'ر.س')}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{room.rooms} {isRTL ? 'غرفة' : 'Rooms'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: Amenities */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('hotels.amenities', 'المرافق والخدمات المشمولة')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="text-slate-800 font-medium">{amenity}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00c48c] shrink-0 stroke-[2.3]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-[#f8fafc] shrink-0">
          <button
            onClick={() => {
              if (onEdit) onEdit(hotel);
              onClose();
            }}
            className="bg-[#009688] hover:bg-[#00897b] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-[0.99]"
          >
            <SquarePen className="w-4 h-4 stroke-[2.5]" />
            <span>{t('common.edit', 'تعديل بيانات الفندق')}</span>
          </button>

          <button
            onClick={onClose}
            className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99] shadow-2xs"
          >
            {t('common.close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
}
