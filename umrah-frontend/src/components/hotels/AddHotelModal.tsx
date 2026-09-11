import { useState, useEffect } from 'react';
import { X, ChevronDown, Star, FileText, Plus, Pencil, Trash2, Check, Building2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { HotelItem } from '../../pages/HotelsPage';

export interface RoomTypeRow {
  id: string;
  name: string;
  capacity: string;
  price: number;
  roomsCount: number;
}

export interface NewHotelData {
  name: string;
  location: string;
  address: string;
  rating: number;
  availableRooms: number;
  pricePerNight: number;
  image: string;
  status: string;
  roomTypes?: RoomTypeRow[];
  amenities?: string[];
}

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newHotel: NewHotelData) => void;
  initialHotel?: HotelItem | null;
}

export default function AddHotelModal({
  isOpen,
  onClose,
  onSuccess,
  initialHotel,
}: AddHotelModalProps) {
  const { t, isRTL, direction } = useLanguage();

  // Form State
  const [hotelName, setHotelName] = useState('');
  const [location, setLocation] = useState<'مكة المكرمة' | 'المدينة المنورة'>('مكة المكرمة');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(4);

  // Room Types State
  const [roomTypes, setRoomTypes] = useState<RoomTypeRow[]>([]);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Draft fields for room edit/add
  const [draftName, setDraftName] = useState('');
  const [draftCapacity, setDraftCapacity] = useState('');
  const [draftPrice, setDraftPrice] = useState<number>(450);
  const [draftRoomsCount, setDraftRoomsCount] = useState<number>(20);

  // Amenities State
  const defaultAmenitiesAr = [
    'إنترنت واي فاي مجاني فائق السرعة',
    'حافلات ترددية مجانية للحرم على مدار الساعة',
    'مطعم وبوفيه إفطار مفتوح فاخر',
    'خدمة استقبال وغرف 24/7',
    'مكتب حجز وتفويج للمعتمرين',
    'مصاعد بانورامية وسريعة',
    'مرافق مهيأة لذوي الاحتياجات الخاصة',
    'خدمة غسيل وكي الملابس السريعة',
  ];

  const defaultAmenitiesEn = [
    'High-Speed Free Wi-Fi Internet',
    '24/7 Free Haram Shuttle Buses',
    'Gourmet Buffet & On-Site Restaurant',
    '24/7 Front Desk & Concierge Service',
    'Pilgrim Logistics & Booking Center',
    'High-Speed Panoramic Elevators',
    'Accessible Facilities for Disabled Guests',
    'Express Laundry & Dry Cleaning',
  ];

  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [editingAmenityIdx, setEditingAmenityIdx] = useState<number | null>(null);
  const [draftAmenityText, setDraftAmenityText] = useState('');
  const [isAddingAmenity, setIsAddingAmenity] = useState(false);
  const [newAmenityText, setNewAmenityText] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialHotel) {
        setHotelName(initialHotel.name);
        setLocation(initialHotel.location.includes('المدينة') ? 'المدينة المنورة' : 'مكة المكرمة');
        setAddress(initialHotel.address || (isRTL ? 'شارع إبراهيم الخليل، منطقة الحرم' : 'Ibrahim Al-Khalil St, Haram Zone'));
        setRating(initialHotel.rating || 4);
        if (initialHotel.roomTypes && initialHotel.roomTypes.length > 0) {
          setRoomTypes(initialHotel.roomTypes);
        } else {
          setRoomTypes([
            { id: '1', name: isRTL ? 'غرفة مزدوجة (Double)' : 'Double Room', capacity: isRTL ? '٢ أشخاص' : '2 Persons', price: initialHotel.pricePerNight || 450, roomsCount: 40 },
            { id: '2', name: isRTL ? 'غرفة ثلاثية (Triple)' : 'Triple Room', capacity: isRTL ? '٣ أشخاص' : '3 Persons', price: 600, roomsCount: 30 },
            { id: '3', name: isRTL ? 'غرفة رباعية (Quad)' : 'Quad Room', capacity: isRTL ? '٤ أشخاص' : '4 Persons', price: 750, roomsCount: 25 },
            { id: '4', name: isRTL ? 'غرفة خماسية (Quint)' : 'Quint Room', capacity: isRTL ? '٥ أشخاص' : '5 Persons', price: 900, roomsCount: 15 },
            { id: '5', name: isRTL ? 'غرفة جناح عائلي (Suite 5)' : 'Family Suite 5', capacity: isRTL ? '٦ أشخاص' : '6 Persons', price: 1100, roomsCount: 10 },
          ]);
        }

        if (initialHotel.amenities && initialHotel.amenities.length > 0) {
          setAmenitiesList(initialHotel.amenities);
        } else {
          setAmenitiesList(isRTL ? defaultAmenitiesAr : defaultAmenitiesEn);
        }
      } else {
        setHotelName('');
        setLocation('مكة المكرمة');
        setAddress('');
        setRating(4);
        setRoomTypes([
          { id: '1', name: isRTL ? 'غرفة مزدوجة (Double)' : 'Double Room', capacity: isRTL ? '٢ أشخاص' : '2 Persons', price: 450, roomsCount: 40 },
          { id: '2', name: isRTL ? 'غرفة ثلاثية (Triple)' : 'Triple Room', capacity: isRTL ? '٣ أشخاص' : '3 Persons', price: 600, roomsCount: 30 },
          { id: '3', name: isRTL ? 'غرفة رباعية (Quad)' : 'Quad Room', capacity: isRTL ? '٤ أشخاص' : '4 Persons', price: 750, roomsCount: 25 },
          { id: '4', name: isRTL ? 'غرفة خماسية (Quint)' : 'Quint Room', capacity: isRTL ? '٥ أشخاص' : '5 Persons', price: 900, roomsCount: 15 },
          { id: '5', name: isRTL ? 'غرفة جناح عائلي (Suite 5)' : 'Family Suite (Suite 5)', capacity: isRTL ? '٦ أشخاص' : '6 Persons', price: 1100, roomsCount: 10 },
        ]);
        setAmenitiesList(isRTL ? defaultAmenitiesAr : defaultAmenitiesEn);
      }
      setEditingRoomId(null);
      setIsAddingRoom(false);
      setEditingAmenityIdx(null);
      setIsAddingAmenity(false);
      setNewAmenityText('');
    }
  }, [isOpen, initialHotel, isRTL]);

  if (!isOpen) return null;

  const handleStartEdit = (room: RoomTypeRow) => {
    setEditingRoomId(room.id);
    setDraftName(room.name);
    setDraftCapacity(room.capacity);
    setDraftPrice(room.price);
    setDraftRoomsCount(room.roomsCount);
    setIsAddingRoom(false);
  };

  const handleSaveEdit = (roomId: string) => {
    if (!draftName.trim()) return;
    setRoomTypes((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              name: draftName.trim(),
              capacity: draftCapacity.trim() || (isRTL ? '٢ أشخاص' : '2 Persons'),
              price: Number(draftPrice) || 450,
              roomsCount: Number(draftRoomsCount) || 10,
            }
          : r
      )
    );
    setEditingRoomId(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRoomTypes((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleStartAdd = () => {
    setIsAddingRoom(true);
    setEditingRoomId(null);
    setDraftName('');
    setDraftCapacity(isRTL ? '٦ أشخاص' : '6 Persons');
    setDraftPrice(1100);
    setDraftRoomsCount(10);
  };

  const handleSaveAdd = () => {
    if (!draftName.trim()) return;
    const newRoom: RoomTypeRow = {
      id: String(Date.now()),
      name: draftName.trim(),
      capacity: draftCapacity.trim() || (isRTL ? '٢ أشخاص' : '2 Persons'),
      price: Number(draftPrice) || 450,
      roomsCount: Number(draftRoomsCount) || 10,
    };
    setRoomTypes((prev) => [...prev, newRoom]);
    setIsAddingRoom(false);
  };

  // Amenities Handlers
  const handleStartEditAmenity = (idx: number, text: string) => {
    setEditingAmenityIdx(idx);
    setDraftAmenityText(text);
    setIsAddingAmenity(false);
  };

  const handleSaveEditAmenity = (idx: number) => {
    if (!draftAmenityText.trim()) return;
    setAmenitiesList((prev) => {
      const next = [...prev];
      next[idx] = draftAmenityText.trim();
      return next;
    });
    setEditingAmenityIdx(null);
  };

  const handleDeleteAmenity = (idx: number) => {
    setAmenitiesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAddAmenity = () => {
    if (!newAmenityText.trim()) return;
    setAmenitiesList((prev) => [...prev, newAmenityText.trim()]);
    setNewAmenityText('');
    setIsAddingAmenity(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalRooms = roomTypes.reduce((acc, r) => acc + (Number(r.roomsCount) || 0), 0);
    const minPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map((r) => Number(r.price) || 0)) : 450;

    const newHotel: NewHotelData = {
      name: hotelName.trim() || (isRTL ? 'فندق مكة الفاخر الحديث' : 'Modern Luxury Makkah Hotel'),
      location: location === 'مكة المكرمة' ? (isRTL ? 'مكة المكرمة' : 'Makkah') : (isRTL ? 'المدينة المنورة' : 'Madinah'),
      address: address.trim() || (isRTL ? 'شارع إبراهيم الخليل، منطقة الحرم' : 'Ibrahim Al-Khalil St, Haram Zone'),
      rating: rating,
      availableRooms: totalRooms || 120,
      pricePerNight: minPrice,
      status: isRTL ? 'متاح للتسكين' : 'Available',
      roomTypes: roomTypes,
      amenities: amenitiesList,
      image:
        initialHotel?.image ||
        (location === 'مكة المكرمة'
          ? 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),
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
            {initialHotel
              ? (isRTL ? 'تعديل بيانات الفندق والغرف' : 'Edit Hotel & Room Details')
              : t('hotels.add_hotel', 'إضافة فندق جديد')}
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
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="مكة المكرمة">{t('hotels.makkah', 'مكة المكرمة')}</option>
                      <option value="المدينة المنورة">{t('hotels.madinah', 'المدينة المنورة')}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
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
                            className={`w-4 h-4 fill-none stroke-[2.3] ${
                              star <= rating
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
                      <th className="py-3 px-4 sm:px-6 font-medium">{isRTL ? 'أنواع الغرف' : 'Room Types'}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{isRTL ? 'السعة' : 'Capacity'}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{isRTL ? 'متوسط السعر / ليلة' : 'Avg. Price / Night'}</th>
                      <th className="py-3 px-4 sm:px-6 font-medium">{isRTL ? 'الغرف المتاحة' : 'Available Rooms'}</th>
                      <th className="py-3 px-3 text-center font-medium w-20">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {roomTypes.map((room) => {
                      const isEditing = editingRoomId === room.id;

                      if (isEditing) {
                        return (
                          <tr key={room.id} className="bg-emerald-50/30">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                placeholder={isRTL ? 'نوع الغرفة' : 'Room Type'}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={draftCapacity}
                                onChange={(e) => setDraftCapacity(e.target.value)}
                                placeholder={isRTL ? 'السعة (مثال: ٤ أشخاص)' : 'Capacity'}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={draftPrice}
                                  onChange={(e) => setDraftPrice(Number(e.target.value))}
                                  className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                                />
                                <span className="text-xs text-slate-500">{t('common.currency', 'ر.س')}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={draftRoomsCount}
                                  onChange={(e) => setDraftRoomsCount(Number(e.target.value))}
                                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                                />
                                <span className="text-xs text-slate-500">{isRTL ? 'غرفة' : 'Rooms'}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(room.id)}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition cursor-pointer shadow-2xs"
                                  title={isRTL ? 'حفظ' : 'Save'}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRoomId(null)}
                                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                                  title={isRTL ? 'إلغاء' : 'Cancel'}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={room.id} className="hover:bg-slate-50/60 transition-colors group">
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

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(room)}
                                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
                                title={isRTL ? 'تعديل الغرفة' : 'Edit Room'}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                title={isRTL ? 'حذف الغرفة' : 'Delete Room'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Inline Add Row */}
                    {isAddingRoom && (
                      <tr className="bg-emerald-50/40 border-t border-emerald-100">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            placeholder={isRTL ? 'مثال: غرفة جناح عائلي (Suite 5)' : 'e.g. Family Suite 5'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={draftCapacity}
                            onChange={(e) => setDraftCapacity(e.target.value)}
                            placeholder={isRTL ? 'مثال: ٦ أشخاص' : '6 Persons'}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={draftPrice}
                              onChange={(e) => setDraftPrice(Number(e.target.value))}
                              className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            />
                            <span className="text-xs text-slate-500">{t('common.currency', 'ر.س')}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={draftRoomsCount}
                              onChange={(e) => setDraftRoomsCount(Number(e.target.value))}
                              className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            />
                            <span className="text-xs text-slate-500">{isRTL ? 'غرفة' : 'Rooms'}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleSaveAdd}
                              className="p-1.5 bg-[#00c48c] hover:bg-[#00b07d] text-white rounded-md transition cursor-pointer shadow-2xs"
                              title={isRTL ? 'إضافة' : 'Add'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingRoom(false)}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                              title={isRTL ? 'إلغاء' : 'Cancel'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {!isAddingRoom && (
                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={handleStartAdd}
                    className="text-xs sm:text-sm font-bold text-[#00c48c] hover:text-[#00b07d] flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>{isRTL ? 'إضافة نوع غرفة جديد' : 'Add New Room Type'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 4: Amenities & Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0f172a] font-bold text-sm sm:text-base">
                  <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span>{isRTL ? '٤. المرافق والخدمات المشمولة' : '4. Amenities & Services'}</span>
                </div>

                {!isAddingAmenity && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingAmenity(true);
                      setEditingAmenityIdx(null);
                      setNewAmenityText('');
                    }}
                    className="text-xs sm:text-sm font-bold text-[#00c48c] hover:text-[#00b07d] flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>{isRTL ? 'إضافة مرفق جديد' : 'Add New Amenity'}</span>
                  </button>
                )}
              </div>

              {/* Add Amenity Form */}
              {isAddingAmenity && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 animate-fadeIn">
                  <input
                    type="text"
                    value={newAmenityText}
                    onChange={(e) => setNewAmenityText(e.target.value)}
                    placeholder={isRTL ? 'اسم المرفق أو الخدمة (مثال: مسبح وسبا خاص)' : 'Amenity or service name (e.g. Private Pool & Spa)'}
                    className="flex-1 bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveAddAmenity();
                      } else if (e.key === 'Escape') {
                        setIsAddingAmenity(false);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveAddAmenity}
                    className="p-2 bg-[#00c48c] hover:bg-[#00b07d] text-white rounded-lg transition cursor-pointer shadow-2xs"
                    title={isRTL ? 'إضافة' : 'Add'}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAmenity(false)}
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
                    title={isRTL ? 'إلغاء' : 'Cancel'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {amenitiesList.map((amenity, idx) => {
                  const isEditing = editingAmenityIdx === idx;

                  if (isEditing) {
                    return (
                      <div
                        key={idx}
                        className="bg-emerald-50/40 border border-emerald-300 rounded-xl px-3 py-2 flex items-center gap-2 animate-fadeIn shadow-2xs"
                      >
                        <input
                          type="text"
                          value={draftAmenityText}
                          onChange={(e) => setDraftAmenityText(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditAmenity(idx);
                            } else if (e.key === 'Escape') {
                              setEditingAmenityIdx(null);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditAmenity(idx)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition cursor-pointer shadow-2xs"
                          title={isRTL ? 'حفظ' : 'Save'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAmenityIdx(null)}
                          className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                          title={isRTL ? 'إلغاء' : 'Cancel'}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-[#f8fafc] hover:bg-slate-50/90 border border-slate-200/70 hover:border-slate-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm group transition-all"
                    >
                      <span className="text-slate-800 font-medium line-clamp-1">{amenity}</span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#00c48c] shrink-0 stroke-[2.3]" />
                        
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity border-l border-slate-200 pl-1.5 rtl:border-l-0 rtl:border-r rtl:border-slate-200 rtl:pl-0 rtl:pr-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditAmenity(idx, amenity)}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
                            title={isRTL ? 'تعديل المرفق' : 'Edit Amenity'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAmenity(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            title={isRTL ? 'حذف المرفق' : 'Delete Amenity'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              {initialHotel ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : t('common.save', 'حفظ وإدراج الفندق')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
