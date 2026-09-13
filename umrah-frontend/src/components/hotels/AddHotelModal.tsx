import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronDown,
  Star,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Check,
  Building2,
  CheckCircle2,
  Upload,
  Loader2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { HotelItem } from '../../utils/hotelsData';

export interface RoomTypeRow {
  id: string;
  name: string;
  capacity: string;
  price: number;
  roomsCount: number;
}

export interface ShowcasePhoto {
  id: string;
  title: string;
  url: string;
  isCustom?: boolean;
}

export interface NewHotelData {
  id?: string;
  name: string;
  nameEn?: string;
  location: string;
  locationEn?: string;
  address: string;
  addressEn?: string;
  rating: number;
  availableRooms: number;
  pricePerNight: number;
  image: string;
  images?: string[];
  status: string;
  roomTypes?: RoomTypeRow[];
  amenities?: string[];
}

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newHotel: NewHotelData) => Promise<void> | void;
  initialHotel?: HotelItem | null;
}

const DEFAULT_ROOM_TYPES: RoomTypeRow[] = [
  {
    id: '1',
    name: 'Double Room',
    capacity: '2 Persons',
    price: 450,
    roomsCount: 40,
  },
  {
    id: '2',
    name: 'Triple Room',
    capacity: '3 Persons',
    price: 600,
    roomsCount: 30,
  },
  {
    id: '3',
    name: 'Quad Room',
    capacity: '4 Persons',
    price: 750,
    roomsCount: 25,
  },
  {
    id: '4',
    name: 'Quint Room',
    capacity: '5 Persons',
    price: 900,
    roomsCount: 15,
  },
  {
    id: '5',
    name: 'Family Suite (Suite 5)',
    capacity: '6 Persons',
    price: 1100,
    roomsCount: 10,
  },
];

const DEFAULT_AMENITIES = [
  'High-Speed Free Wi-Fi Internet',
  '24/7 Free Haram Shuttle Buses',
  'Gourmet Buffet & On-Site Restaurant',
  '24/7 Front Desk & Concierge Service',
  'Pilgrim Logistics & Booking Center',
  'High-Speed Panoramic Elevators',
  'Accessible Facilities for Disabled Guests',
  'Express Laundry & Dry Cleaning',
];

const DEFAULT_AMENITIES_AR = [
  'إنترنت واي فاي مجاني فائق السرعة',
  'حافلات ترددية مجانية للحرم على مدار الساعة',
  'مطعم وبوفيه إفطار مفتوح فاخر',
  'خدمة استقبال وغرف 24/7',
  'مكتب حجز وتفويج للمعتمرين',
  'مصاعد بانورامية وسريعة',
  'مرافق مهيأة لذوي الاحتياجات الخاصة',
  'خدمة غسيل وكي الملابس السريعة',
];

const SUGGESTED_PHOTO_CATEGORIES = [
  'Hotel bedroom',
  'Hotel bathroom',
  'Hotel mosque view',
];

export default function AddHotelModal({
  isOpen,
  onClose,
  onSuccess,
  initialHotel,
}: AddHotelModalProps) {
  const { isRTL, direction } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingTagRef = useRef<string | null>(null);

  // Form State
  const [hotelName, setHotelName] = useState('');
  const [city, setCity] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [address, setAddress] = useState('');
  const [stars, setStars] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Photos State (pure real data from user upload or database, no dummy unsplash)
  const [photos, setPhotos] = useState<ShowcasePhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Room Types State
  const [roomTypes, setRoomTypes] = useState<RoomTypeRow[]>(DEFAULT_ROOM_TYPES);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Draft fields for room edit/add
  const [draftName, setDraftName] = useState('');
  const [draftCapacity, setDraftCapacity] = useState('');
  const [draftPrice, setDraftPrice] = useState<number>(450);
  const [draftRoomsCount, setDraftRoomsCount] = useState<number>(20);

  // Amenities State
  const [amenitiesList, setAmenitiesList] = useState<string[]>(DEFAULT_AMENITIES);
  const [activeAmenities, setActiveAmenities] = useState<Record<string, boolean>>({});
  const [editingAmenityIdx, setEditingAmenityIdx] = useState<number | null>(null);
  const [draftAmenityText, setDraftAmenityText] = useState('');
  const [isAddingAmenity, setIsAddingAmenity] = useState(false);
  const [newAmenityText, setNewAmenityText] = useState('');

  // Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setUploadError(null);
      setIsSubmitting(false);

      if (initialHotel) {
        setHotelName(initialHotel.name || initialHotel.nameEn || '');
        const isMadinah =
          initialHotel.location?.includes('المدينة') ||
          initialHotel.location?.toLowerCase().includes('madinah') ||
          initialHotel.locationEn?.toLowerCase().includes('madinah');
        setCity(isMadinah ? 'Madinah' : 'Makkah');
        setAddress(initialHotel.address || initialHotel.addressEn || '');
        setStars(initialHotel.rating || 5);

        // Load Photos from real hotel record
        if (initialHotel.images && initialHotel.images.length > 0) {
          setPhotos(
            initialHotel.images.map((url: string, idx: number) => ({
              id: `photo-${idx}-${Date.now()}`,
              title:
                idx === 0
                  ? 'Hotel bedroom'
                  : idx === 1
                  ? 'Hotel bathroom'
                  : idx === 2
                  ? 'Hotel mosque view'
                  : `Showcase Photo ${idx + 1}`,
              url: typeof url === 'string' ? url : (url as any).url || '',
            }))
          );
        } else if (initialHotel.image) {
          setPhotos([
            {
              id: 'photo-0',
              title: 'Main Photo',
              url: initialHotel.image,
            },
          ]);
        } else {
          setPhotos([]);
        }

        // Load Room Types
        if (initialHotel.roomTypes && initialHotel.roomTypes.length > 0) {
          setRoomTypes(initialHotel.roomTypes);
        } else {
          setRoomTypes(DEFAULT_ROOM_TYPES);
        }

        // Load Amenities
        if (initialHotel.amenities && initialHotel.amenities.length > 0) {
          setAmenitiesList(initialHotel.amenities);
          const activeMap: Record<string, boolean> = {};
          initialHotel.amenities.forEach((a) => {
            activeMap[a] = true;
          });
          setActiveAmenities(activeMap);
        } else {
          const list = isRTL ? DEFAULT_AMENITIES_AR : DEFAULT_AMENITIES;
          setAmenitiesList(list);
          const activeMap: Record<string, boolean> = {};
          list.forEach((a) => {
            activeMap[a] = true;
          });
          setActiveAmenities(activeMap);
        }
      } else {
        // Fresh Add Form (no dummy fake data)
        setHotelName('');
        setCity('Makkah');
        setAddress('');
        setStars(5);
        setPhotos([]);
        setRoomTypes(DEFAULT_ROOM_TYPES);
        const list = isRTL ? DEFAULT_AMENITIES_AR : DEFAULT_AMENITIES;
        setAmenitiesList(list);
        const activeMap: Record<string, boolean> = {};
        list.forEach((a) => {
          activeMap[a] = true;
        });
        setActiveAmenities(activeMap);
      }

      setEditingRoomId(null);
      setIsAddingRoom(false);
      setEditingAmenityIdx(null);
      setIsAddingAmenity(false);
      setNewAmenityText('');
    }
  }, [isOpen, initialHotel, isRTL]);

  if (!isOpen) return null;

  // File Upload Handlers (converts real files to Base64 data URLs)
  const processFiles = (files: FileList | File[], targetTag?: string) => {
    setUploadError(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setUploadError(
          isRTL
            ? `الملف ${file.name} ليس صورة صالحة.`
            : `File "${file.name}" is not a supported image format.`
        );
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(
          isRTL
            ? `الملف ${file.name} يتجاوز الحجم الأقصى المسموح (5 ميجابايت).`
            : `File "${file.name}" exceeds 5MB size limit.`
        );
        continue;
      }
      validFiles.push(file);
    }

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        if (base64Url) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          const assignedTitle =
            targetTag ||
            (index === 0 && photos.length === 0
              ? 'Hotel bedroom'
              : index === 1 && photos.length <= 1
              ? 'Hotel bathroom'
              : index === 2 && photos.length <= 2
              ? 'Hotel mosque view'
              : cleanName || 'Hotel Photo');

          setPhotos((prev) => [
            ...prev,
            {
              id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              title: assignedTitle,
              url: base64Url,
              isCustom: true,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    pendingTagRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, pendingTagRef.current || undefined);
    }
    e.target.value = '';
  };

  const triggerUploadWithTag = (tag: string) => {
    pendingTagRef.current = tag;
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Room Types Handlers
  const handleStartEditRoom = (room: RoomTypeRow) => {
    setEditingRoomId(room.id);
    setDraftName(room.name);
    setDraftCapacity(room.capacity);
    setDraftPrice(room.price);
    setDraftRoomsCount(room.roomsCount);
    setIsAddingRoom(false);
  };

  const handleSaveEditRoom = (roomId: string) => {
    if (!draftName.trim()) return;
    setRoomTypes((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              name: draftName.trim(),
              capacity: draftCapacity.trim() || '2 Persons',
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

  const handleStartAddRoom = () => {
    setIsAddingRoom(true);
    setEditingRoomId(null);
    setDraftName('');
    setDraftCapacity('2 Persons');
    setDraftPrice(500);
    setDraftRoomsCount(20);
  };

  const handleSaveAddRoom = () => {
    if (!draftName.trim()) return;
    const newRoom: RoomTypeRow = {
      id: `room-${Date.now()}`,
      name: draftName.trim(),
      capacity: draftCapacity.trim() || '2 Persons',
      price: Number(draftPrice) || 450,
      roomsCount: Number(draftRoomsCount) || 10,
    };
    setRoomTypes((prev) => [...prev, newRoom]);
    setIsAddingRoom(false);
  };

  // Amenities Handlers
  const handleToggleAmenity = (amenity: string) => {
    setActiveAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  const handleStartEditAmenity = (idx: number, text: string) => {
    setEditingAmenityIdx(idx);
    setDraftAmenityText(text);
    setIsAddingAmenity(false);
  };

  const handleSaveEditAmenity = (idx: number) => {
    if (!draftAmenityText.trim()) return;
    const oldText = amenitiesList[idx];
    const newText = draftAmenityText.trim();
    setAmenitiesList((prev) => {
      const next = [...prev];
      next[idx] = newText;
      return next;
    });
    setActiveAmenities((prev) => {
      const copy = { ...prev };
      const wasActive = copy[oldText] ?? true;
      delete copy[oldText];
      copy[newText] = wasActive;
      return copy;
    });
    setEditingAmenityIdx(null);
  };

  const handleDeleteAmenity = (idx: number) => {
    const text = amenitiesList[idx];
    setAmenitiesList((prev) => prev.filter((_, i) => i !== idx));
    setActiveAmenities((prev) => {
      const copy = { ...prev };
      delete copy[text];
      return copy;
    });
  };

  const handleSaveAddAmenity = () => {
    if (!newAmenityText.trim()) return;
    const text = newAmenityText.trim();
    setAmenitiesList((prev) => [...prev, text]);
    setActiveAmenities((prev) => ({ ...prev, [text]: true }));
    setNewAmenityText('');
    setIsAddingAmenity(false);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!hotelName.trim()) {
      setFormError(
        isRTL ? 'يرجى إدخال اسم الفندق' : 'Please enter the hotel name.'
      );
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!address.trim()) {
      setFormError(
        isRTL ? 'يرجى إدخال عنوان الفندق' : 'Please enter the hotel address.'
      );
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalRooms = roomTypes.reduce(
        (acc, r) => acc + (Number(r.roomsCount) || 0),
        0
      );
      const minPrice =
        roomTypes.length > 0
          ? Math.min(...roomTypes.map((r) => Number(r.price) || 0))
          : 450;

      // Filter active amenities
      const selectedAmenities = amenitiesList.filter(
        (a) => activeAmenities[a] !== false
      );

      const defaultMakkahImg =
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80';
      const defaultMadinahImg =
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80';
      const fallbackImage = city === 'Madinah' ? defaultMadinahImg : defaultMakkahImg;

      const imageUrls = photos.map((p) => p.url);
      const mainImage = imageUrls.length > 0 ? imageUrls[0] : (initialHotel?.image || fallbackImage);

      const locationArabic = city === 'Makkah' ? 'مكة المكرمة' : 'المدينة المنورة';

      const payload: NewHotelData = {
        id: initialHotel?.id,
        name: hotelName.trim(),
        nameEn: hotelName.trim(),
        location: locationArabic,
        locationEn: city,
        address: address.trim(),
        addressEn: address.trim(),
        rating: stars,
        availableRooms: totalRooms || 0,
        pricePerNight: minPrice,
        status: isRTL ? 'متاح للتسكين' : 'Available for Accommodation',
        image: mainImage,
        images: imageUrls.length > 0 ? imageUrls : [mainImage],
        roomTypes: roomTypes,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : amenitiesList,
      };

      if (onSuccess) {
        await onSuccess(payload);
      }

      // Trigger realtime refresh event for navbar notifications and other listeners
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      onClose();
    } catch (err: any) {
      console.error('Error submitting hotel:', err);
      setFormError(
        err.message ||
          (isRTL ? 'فشل حفظ بيانات الفندق' : 'Failed to save hotel data to database.')
      );
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
              {initialHotel
                ? isRTL
                  ? 'تعديل بيانات الفندق والغرف'
                  : 'Edit Hotel & Room Details'
                : isRTL
                ? 'إضافة فندق جديد'
                : 'Add New Hotel'}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto flex-1 bg-white">
          <div className="px-6 sm:px-8 py-6 space-y-7">
            {/* Form Error Banner */}
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 1: Hotel Basic Information                                       */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  {isRTL ? 'معلومات الفندق الأساسية' : 'Hotel Basic Information'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Hotel Name */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{isRTL ? 'اسم الفندق' : 'Hotel Name'}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hilton Jabal Omar Makkah"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{isRTL ? 'المدينة' : 'City'}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value as 'Makkah' | 'Madinah')
                      }
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="Makkah">
                        {isRTL ? 'مكة المكرمة (Makkah)' : 'Makkah'}
                      </option>
                      <option value="Madinah">
                        {isRTL ? 'المدينة المنورة (Madinah)' : 'Madinah'}
                      </option>
                    </select>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                        isRTL ? 'left-3' : 'right-3'
                      }`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{isRTL ? 'العنوان' : 'Address'}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Al-Khalil St, Central Haram Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
                  />
                </div>

                {/* Stars Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                    <span>{isRTL ? 'النجوم' : 'Stars'}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                    <div
                      className="flex items-center gap-1.5"
                      dir="ltr"
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeVal = hoverRating !== null ? hoverRating : stars;
                        const isFilled = star <= activeVal;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStars(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className="cursor-pointer transition transform hover:scale-110 p-0.5 focus:outline-none"
                            title={`${star} ${star === 1 ? 'Star' : 'Stars'}`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                isFilled
                                  ? 'text-[#f59e0b] fill-[#f59e0b] stroke-[#f59e0b]'
                                  : 'text-slate-200 fill-transparent stroke-[1.8]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {isRTL ? 'انقر للتقييم' : 'Click to rate'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: Hotel Showcase Photos                                          */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>
                    {isRTL ? 'صور الفندق والواجهة' : 'Hotel Showcase Photos'}
                  </span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {photos.length}{' '}
                  {isRTL ? 'صور تم رفعها' : 'uploaded photos'}
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  pendingTagRef.current = null;
                  fileInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-[#00c48c] bg-emerald-50/40 scale-[0.99]'
                    : 'border-[#00c48c]/60 hover:border-[#00c48c] bg-white hover:bg-emerald-50/10'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00c48c] flex items-center justify-center">
                  <FileText className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 pt-0.5">
                  {isRTL
                    ? 'اسحب الصور هنا أو انقر للتصفح والرفع'
                    : 'Drag photos here or click to browse'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isRTL
                    ? 'الصيغ المدعومة: PNG, JPG (الحد الأقصى 5 ميجابايت لكل صورة)'
                    : 'Supported formats: PNG, JPG (Max 5MB)'}
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2 font-medium">
                  {uploadError}
                </p>
              )}

              {/* Quick Tag Upload Suggestions / Uploaded Photos List */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">
                    {isRTL ? 'إضافة سريعة لأقسام:' : 'Target Photo Slots:'}
                  </span>
                  {SUGGESTED_PHOTO_CATEGORIES.map((cat) => {
                    const hasUploaded = photos.some((p) => p.title.toLowerCase() === cat.toLowerCase());
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => triggerUploadWithTag(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                          hasUploaded
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5 text-[#00c48c]" />
                        <span>{cat}</span>
                        {hasUploaded && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Showcase Photos Grid */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-50 aspect-video flex flex-col justify-end"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                        {/* Delete Photo Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(photo.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 shadow-sm"
                          title={isRTL ? 'حذف الصورة' : 'Remove Photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Photo Title/Tag */}
                        <div className="relative p-2 text-[11px] font-semibold text-white truncate z-10 drop-shadow-sm">
                          {photo.title}
                        </div>
                      </div>
                    ))}

                    {/* Add Photo Button Slot */}
                    <button
                      type="button"
                      onClick={() => {
                        pendingTagRef.current = null;
                        fileInputRef.current?.click();
                      }}
                      className="rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 aspect-video flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-600 transition cursor-pointer"
                    >
                      <Upload className="w-5 h-5 stroke-[2]" />
                      <span className="text-[11px] font-bold">
                        {isRTL ? 'إضافة صورة' : 'Add Photo'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-300" />
                    <span>
                      {isRTL
                        ? 'لم يتم رفع أي صور بعد. يرجى سحب الصور أو النقر على الأزرار أعلاه.'
                        : 'No showcase photos uploaded yet. Drag photos or click above to upload.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 3: Room Types & Pricing per Night                                 */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  {isRTL
                    ? 'أنواع الغرف والأسعار لليلة الواحدة'
                    : 'Room Types & Pricing per Night'}
                </span>
              </h3>

              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                <table
                  className={`w-full border-collapse text-xs sm:text-sm ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  <thead>
                    <tr className="border-b border-slate-200/80 text-xs font-bold text-slate-500 bg-[#f8fafc]">
                      <th className="py-3 px-4 sm:px-6 font-medium">
                        {isRTL ? 'أنواع الغرف' : 'Room Types'}
                      </th>
                      <th className="py-3 px-4 sm:px-6 font-medium">
                        {isRTL ? 'السعة' : 'Capacity'}
                      </th>
                      <th className="py-3 px-4 sm:px-6 font-medium">
                        {isRTL ? 'متوسط السعر / ليلة' : 'Avg. Price / Night'}
                      </th>
                      <th className="py-3 px-4 sm:px-6 font-medium">
                        {isRTL ? 'الغرف المتاحة' : 'Available Rooms'}
                      </th>
                      <th className="py-3 px-3 text-center font-medium w-20">
                        {isRTL ? 'الإجراءات' : 'Actions'}
                      </th>
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
                                placeholder="Room Type"
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={draftCapacity}
                                onChange={(e) =>
                                  setDraftCapacity(e.target.value)
                                }
                                placeholder="Capacity (e.g. 2 Persons)"
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={draftPrice}
                                  onChange={(e) =>
                                    setDraftPrice(Number(e.target.value))
                                  }
                                  className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                                />
                                <span className="text-xs text-slate-500">
                                  SAR
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={draftRoomsCount}
                                  onChange={(e) =>
                                    setDraftRoomsCount(Number(e.target.value))
                                  }
                                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                                />
                                <span className="text-xs text-slate-500">
                                  Rooms
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditRoom(room.id)}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition cursor-pointer shadow-2xs"
                                  title="Save"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRoomId(null)}
                                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={room.id}
                          className="hover:bg-slate-50/60 transition-colors group"
                        >
                          <td className="py-3 px-4 sm:px-6 font-bold text-[#0f172a]">
                            {room.name}
                          </td>

                          <td className="py-3 px-4 sm:px-6 text-slate-600 font-medium">
                            {room.capacity}
                          </td>

                          <td className="py-3 px-4 sm:px-6 font-bold text-[#00c48c]">
                            {room.price} SAR
                          </td>

                          <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">
                            {room.roomsCount} Rooms
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEditRoom(room)}
                                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
                                title="Edit Room"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                title="Delete Room"
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
                            placeholder="e.g. Executive Haram View"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={draftCapacity}
                            onChange={(e) => setDraftCapacity(e.target.value)}
                            placeholder="e.g. 2 Persons"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={draftPrice}
                              onChange={(e) =>
                                setDraftPrice(Number(e.target.value))
                              }
                              className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            />
                            <span className="text-xs text-slate-500">SAR</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={draftRoomsCount}
                              onChange={(e) =>
                                setDraftRoomsCount(Number(e.target.value))
                              }
                              className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            />
                            <span className="text-xs text-slate-500">
                              Rooms
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleSaveAddRoom}
                              className="p-1.5 bg-[#00c48c] hover:bg-[#00b07d] text-white rounded-md transition cursor-pointer shadow-2xs"
                              title="Add"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingRoom(false)}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                              title="Cancel"
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
                    onClick={handleStartAddRoom}
                    className="text-xs sm:text-sm font-bold text-[#00c48c] hover:text-[#00b07d] flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {isRTL ? 'إضافة نوع غرفة جديد' : 'Add New Room Type'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 4: Amenities & Services                                           */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <span>
                    {isRTL ? 'المرافق والخدمات' : 'Amenities & Services'}
                  </span>
                </h3>

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
                    <span>
                      {isRTL ? 'إضافة مرفق جديد' : 'Add New Amenity'}
                    </span>
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
                    placeholder={
                      isRTL
                        ? 'اسم المرفق أو الخدمة'
                        : 'Amenity or service name (e.g. 24/7 Room Service)'
                    }
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
                    title="Add"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAmenity(false)}
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Amenities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {amenitiesList.map((amenity, idx) => {
                  const isEditing = editingAmenityIdx === idx;
                  const isActive = activeAmenities[amenity] !== false;

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
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAmenityIdx(null)}
                          className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`border rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm group transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-[#f8fafc] hover:bg-slate-50/90 border-slate-200/80 text-slate-800'
                          : 'bg-slate-50/50 border-slate-200/50 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="font-medium line-clamp-1">{amenity}</span>

                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAmenity(amenity);
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                            isActive
                              ? 'text-[#00c48c]'
                              : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 stroke-[2.3] ${
                              isActive ? 'text-[#00c48c]' : 'text-slate-300'
                            }`}
                          />
                        </button>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity border-l border-slate-200 pl-1 rtl:border-l-0 rtl:border-r rtl:border-slate-200 rtl:pl-0 rtl:pr-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditAmenity(idx, amenity);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
                            title="Edit Amenity"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAmenity(idx);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            title="Delete Amenity"
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
              disabled={isSubmitting}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-[0.99] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRTL ? 'جاري الحفظ...' : 'Saving to Database...'}</span>
                </>
              ) : initialHotel ? (
                isRTL ? (
                  'حفظ التعديلات'
                ) : (
                  'Save Changes'
                )
              ) : isRTL ? (
                'حفظ وإدراج الفندق'
              ) : (
                'Save Hotel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
