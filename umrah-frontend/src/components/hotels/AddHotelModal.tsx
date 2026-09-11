import { useState } from 'react';
import { X, ChevronDown, Star, FileText, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface NewHotelData {
  name: string;
  location: string;
  address: string;
  rating: number;
  availableRooms: number;
  pricePerNight: number;
  image: string;
  status: string;
}

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newHotel: NewHotelData) => void;
}

interface RoomTypeRow {
  id: string;
  name: string;
  capacity: string;
  price: number;
  roomsCount: number;
}

export default function AddHotelModal({
  isOpen,
  onClose,
  onSuccess,
}: AddHotelModalProps) {
  const { t, isRTL, direction } = useLanguage();

  // Form State
  const [hotelName, setHotelName] = useState('');
  const [location, setLocation] = useState<'مكة المكرمة' | 'المدينة المنورة'>('مكة المكرمة');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(4);

  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomTypeRow[]>([
    {
      id: '1',
      name: isRTL ? 'غرفة مزدوجة (Double)' : 'Double Room',
      capacity: isRTL ? '٢ أشخاص' : '2 Persons',
      price: 450,
      roomsCount: 40,
    },
    {
      id: '2',
      name: isRTL ? 'غرفة ثلاثية (Triple)' : 'Triple Room',
      capacity: isRTL ? '٣ أشخاص' : '3 Persons',
      price: 600,
      roomsCount: 30,
    },
    {
      id: '3',
      name: isRTL ? 'غرفة رباعية (Quad)' : 'Quad Room',
      capacity: isRTL ? '٤ أشخاص' : '4 Persons',
      price: 750,
      roomsCount: 25,
    },
    {
      id: '4',
      name: isRTL ? 'غرفة خماسية (Quint)' : 'Family Suite (Quint)',
      capacity: isRTL ? '٥ أشخاص' : '5 Persons',
      price: 900,
      roomsCount: 15,
    },
  ]);

  if (!isOpen) return null;

  const handleAddRoomType = () => {
    const nextIndex = roomTypes.length + 1;
    const newRoom: RoomTypeRow = {
      id: String(Date.now()),
      name: isRTL ? `غرفة جناح عائلي (Suite ${nextIndex})` : `Family Executive Suite ${nextIndex}`,
      capacity: isRTL ? '٦ أشخاص' : '6 Persons',
      price: 1100,
      roomsCount: 10,
    };
    setRoomTypes([...roomTypes, newRoom]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalRooms = roomTypes.reduce((acc, r) => acc + r.roomsCount, 0);
    const minPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map((r) => r.price)) : 450;

    const newHotel: NewHotelData = {
      name: hotelName.trim() || (isRTL ? 'فندق مكة الفاخر الحديث' : 'Modern Luxury Makkah Hotel'),
      location: location === 'مكة المكرمة' ? (isRTL ? 'مكة المكرمة' : 'Makkah') : (isRTL ? 'المدينة المنورة' : 'Madinah'),
      address: address.trim() || (isRTL ? 'شارع إبراهيم الخليل، منطقة الحرم' : 'Ibrahim Al-Khalil St, Haram Zone'),
      rating: rating,
      availableRooms: totalRooms || 110,
      pricePerNight: minPrice,
      status: isRTL ? 'متاح للتسكين' : 'Available',
      image:
        location === 'مكة المكرمة'
          ? 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    };

    if (onSuccess) {
      onSuccess(newHotel);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[94vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {t('hotels.add_hotel', 'إضافة فندق جديد')}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 bg-white">
          <div className="px-6 sm:px-8 py-6 space-y-7">
            {/* SECTION 1: Hotel Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                {isRTL ? '١. معلومات الفندق الأساسية' : '1. Hotel Basic Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Hotel Name */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{t('hotels.hotel_name', 'اسم الفندق')}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? 'مثال: فندق هيلتون جبل عمر' : 'e.g. Hilton Jabal Omar Makkah'}
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
                  />
                </div>

                {/* Location / Area */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{t('hotels.city', 'المدينة')}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value as 'مكة المكرمة' | 'المدينة المنورة')
                      }
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                        }`}
                    >
                      <option value="مكة المكرمة">{t('hotels.makkah', 'مكة المكرمة')}</option>
                      <option value="المدينة المنورة">{t('hotels.madinah', 'المدينة المنورة')}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-3' : 'right-3'
                      }`} />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{t('common.address', 'العنوان')}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isRTL ? 'مثال: شارع إبراهيم الخليل، منطقة الحرم' : 'e.g. Ibrahim Al-Khalil St, Central Haram Area'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
                  />
                </div>

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{t('hotels.stars', 'النجوم')}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition hover:scale-110"
                        >
                          <Star
                            className={`w-4 h-4 fill-none stroke-[2.3] ${star <= rating
                                ? 'text-[#f59e0b]'
                                : 'text-slate-200 stroke-[1.8]'
                              }`}
                          />
                        </button>
                      ))}
                    </div>

                    <span className="text-xs text-slate-400 font-normal">
                      {isRTL ? 'انقر للتقييم' : 'Click to rate'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Photos */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                {isRTL ? '٢. صور الفندق والواجهة' : '2. Hotel Showcase Photos'}
              </h3>

              <div className="border-2 border-dashed border-[#00c48c]/60 hover:border-[#00c48c] rounded-2xl p-6 sm:p-7 text-center bg-white hover:bg-emerald-50/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                <FileText className="w-9 h-9 sm:w-10 sm:h-10 text-[#00c48c] stroke-[2.2]" />
                <div className="text-xs sm:text-sm font-bold text-slate-800 pt-1">
                  {isRTL ? 'اسحب الصور هنا أو انقر للرفع المباشر' : 'Drag photos here or click to browse'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isRTL ? 'الصيغ المدعومة: PNG, JPG (الحد الأقصى 5 ميغابايت)' : 'Supported formats: PNG, JPG (Max 5MB)'}
                </div>
              </div>

              <div className="flex items-center justify-start gap-3 pt-1">
                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=300&q=80"
                    alt="Hotel bedroom"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80"
                    alt="Hotel bathroom"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80"
                    alt="Hotel mosque view"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Rooms & Pricing */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                {isRTL ? '٣. الغرف والأسعار لليلة الواحدة' : '3. Room Types & Pricing per Night'}
              </h3>

              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                <table className={`w-full border-collapse text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b border-slate-200/80 text-xs font-bold text-slate-500 bg-[#f8fafc]">
                      <th className="py-3 px-4 sm:px-6 font-medium">{t('hotels.room_types', 'أنواع الغرف')}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{t('common.capacity', 'السعة')}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{t('hotels.price_per_night', 'متوسط السعر / ليلة')}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{t('hotels.available_rooms', 'الغرف المتاحة')}</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {roomTypes.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 sm:px-6 font-bold text-[#0f172a]">
                          {room.name}
                        </td>

                        <td className="py-3 px-4 sm:px-6 text-slate-600 font-medium">
                          {room.capacity}
                        </td>

                        <td className="py-3 px-4 sm:px-6 font-bold text-[#00c48c]">
                          {room.price} {t('common.currency', 'ر.س')}
                        </td>

                        <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">
                          {room.roomsCount} {isRTL ? 'غرفة' : 'Rooms'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-start pt-1">
                <button
                  type="button"
                  onClick={handleAddRoomType}
                  className="text-xs sm:text-sm font-bold text-[#00c48c] hover:text-[#00b07d] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isRTL ? 'إضافة نوع غرفة جديد' : 'Add Room Type'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-white shrink-0 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99]"
            >
              {t('common.cancel', 'إلغاء')}
            </button>

            <button
              type="submit"
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-6 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-[0.99]"
            >
              {t('common.save', 'حفظ وإدراج الفندق')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
