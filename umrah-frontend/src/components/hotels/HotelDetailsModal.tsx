import { useState, useEffect } from 'react';
import { X, MapPin, Building2, Bed, CheckCircle2, SquarePen, Star, Plus, Pencil, Trash2, Check } from 'lucide-react';
import type { HotelItem, RoomTypeRow } from '../../pages/HotelsPage';
import { useLanguage } from '../../context/LanguageContext';

interface HotelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel?: HotelItem | null;
  onEdit?: (hotel: HotelItem) => void;
  onUpdateHotel?: (hotel: HotelItem) => void;
}

export default function HotelDetailsModal({
  isOpen,
  onClose,
  hotel,
  onEdit,
  onUpdateHotel,
}: HotelDetailsModalProps) {
  const { t, isRTL, direction } = useLanguage();

  const [rooms, setRooms] = useState<RoomTypeRow[]>([]);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Form states for editing/adding
  const [draftName, setDraftName] = useState('');
  const [draftCapacity, setDraftCapacity] = useState('');
  const [draftPrice, setDraftPrice] = useState<number>(450);
  const [draftRoomsCount, setDraftRoomsCount] = useState<number>(20);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
    if (hotel) {
      if (hotel.roomTypes && hotel.roomTypes.length > 0) {
        setRooms(hotel.roomTypes);
      } else {
        // Default 5 room types matching reference
        setRooms([
          { id: '1', name: isRTL ? 'غرفة مزدوجة (Double)' : 'Double Room', capacity: isRTL ? '٢ أشخاص' : '2 Persons', price: hotel.pricePerNight || 450, roomsCount: Math.round((hotel.availableRooms || 100) * 0.35) },
          { id: '2', name: isRTL ? 'غرفة ثلاثية (Triple)' : 'Triple Room', capacity: isRTL ? '٣ أشخاص' : '3 Persons', price: Math.round((hotel.pricePerNight || 450) * 1.3), roomsCount: Math.round((hotel.availableRooms || 100) * 0.25) },
          { id: '3', name: isRTL ? 'غرفة رباعية (Quad)' : 'Quad Room', capacity: isRTL ? '٤ أشخاص' : '4 Persons', price: Math.round((hotel.pricePerNight || 450) * 1.6), roomsCount: Math.round((hotel.availableRooms || 100) * 0.2) },
          { id: '4', name: isRTL ? 'غرفة خماسية (Quint)' : 'Quint Room', capacity: isRTL ? '٥ أشخاص' : '5 Persons', price: Math.round((hotel.pricePerNight || 450) * 2), roomsCount: Math.round((hotel.availableRooms || 100) * 0.12) },
          { id: '5', name: isRTL ? 'غرفة جناح عائلي (Suite 5)' : 'Family Suite (Suite 5)', capacity: isRTL ? '٦ أشخاص' : '6 Persons', price: Math.round((hotel.pricePerNight || 450) * 2.4), roomsCount: Math.round((hotel.availableRooms || 100) * 0.08) },
        ]);
      }

      if (hotel.amenities && hotel.amenities.length > 0) {
        setAmenitiesList(hotel.amenities);
      } else {
        setAmenitiesList(isRTL ? defaultAmenitiesAr : defaultAmenitiesEn);
      }

      setEditingRoomId(null);
      setIsAddingRoom(false);
      setEditingAmenityIdx(null);
      setIsAddingAmenity(false);
      setNewAmenityText('');
    }
  }, [hotel, isRTL]);

  if (!isOpen || !hotel) return null;

  const notifyUpdate = (newRooms: RoomTypeRow[] = rooms, newAmenities: string[] = amenitiesList) => {
    const totalRooms = newRooms.reduce((acc, r) => acc + (Number(r.roomsCount) || 0), 0);
    const minPrice = newRooms.length > 0 ? Math.min(...newRooms.map((r) => Number(r.price) || 0)) : hotel.pricePerNight;
    const updated: HotelItem = {
      ...hotel,
      roomTypes: newRooms,
      amenities: newAmenities,
      availableRooms: totalRooms || hotel.availableRooms,
      pricePerNight: minPrice || hotel.pricePerNight,
    };
    if (onUpdateHotel) {
      onUpdateHotel(updated);
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
  };

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
    const updated = rooms.map((r) =>
      r.id === roomId
        ? {
            ...r,
            name: draftName.trim(),
            capacity: draftCapacity.trim() || (isRTL ? '٢ أشخاص' : '2 Persons'),
            price: Number(draftPrice) || 450,
            roomsCount: Number(draftRoomsCount) || 10,
          }
        : r
    );
    setRooms(updated);
    setEditingRoomId(null);
    notifyUpdate(updated, amenitiesList);
  };

  const handleDeleteRoom = (roomId: string) => {
    const updated = rooms.filter((r) => r.id !== roomId);
    setRooms(updated);
    notifyUpdate(updated, amenitiesList);
  };

  const handleStartAdd = () => {
    setIsAddingRoom(true);
    setEditingRoomId(null);
    setDraftName('');
    setDraftCapacity(isRTL ? '٤ أشخاص' : '4 Persons');
    setDraftPrice(800);
    setDraftRoomsCount(15);
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
    const updated = [...rooms, newRoom];
    setRooms(updated);
    setIsAddingRoom(false);
    notifyUpdate(updated, amenitiesList);
  };

  // Amenities handlers
  const handleStartEditAmenity = (idx: number, text: string) => {
    setEditingAmenityIdx(idx);
    setDraftAmenityText(text);
    setIsAddingAmenity(false);
  };

  const handleSaveEditAmenity = (idx: number) => {
    if (!draftAmenityText.trim()) return;
    const updated = [...amenitiesList];
    updated[idx] = draftAmenityText.trim();
    setAmenitiesList(updated);
    setEditingAmenityIdx(null);
    notifyUpdate(rooms, updated);
  };

  const handleDeleteAmenity = (idx: number) => {
    const updated = amenitiesList.filter((_, i) => i !== idx);
    setAmenitiesList(updated);
    notifyUpdate(rooms, updated);
  };

  const handleSaveAddAmenity = () => {
    if (!newAmenityText.trim()) return;
    const updated = [...amenitiesList, newAmenityText.trim()];
    setAmenitiesList(updated);
    setNewAmenityText('');
    setIsAddingAmenity(false);
    notifyUpdate(rooms, updated);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 fill-none stroke-[2.3] ${
              star <= rating ? 'text-[#f59e0b]' : 'text-slate-200 stroke-[1.8]'
            }`}
          />
        ))}
      </div>
    );
  };

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
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs ${
                  hotel.location.includes('مكة') || hotel.location.includes('Makkah')
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
          {/* Toast Alert */}
          {showSuccessToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-fadeIn shadow-2xs">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>{isRTL ? 'تم حفظ وتحديث بيانات الغرف والأسعار بنجاح!' : 'Room details and rates updated successfully!'}</span>
            </div>
          )}

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
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm ${
                    hotel.status.includes('متاح') || hotel.status.includes('Available')
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

          {/* SECTION 1: Room types & pricing table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f172a] font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                  <Bed className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span>{isRTL ? '٣. الغرف والأسعار لليلة الواحدة' : '3. Room Types & Pricing per Night'}</span>
              </div>
            </div>

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
                  {rooms.map((room) => {
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
                        <td className="py-3 px-4 sm:px-6 font-bold text-[#0f172a]">{room.name}</td>
                        <td className="py-3 px-4 sm:px-6 text-slate-600 font-medium">{room.capacity}</td>
                        <td className="py-3 px-4 sm:px-6 font-bold text-[#00c48c]">{room.price} {t('common.currency', 'ر.س')}</td>
                        <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">{room.roomsCount} {isRTL ? 'غرفة' : 'Rooms'}</td>
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

            {/* Add Room Type Button matching mockup */}
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

          {/* SECTION 2: Amenities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#0f172a] font-bold text-sm">
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
