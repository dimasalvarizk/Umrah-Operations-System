export interface RoomTypeRow {
  id: string;
  name: string;
  capacity: string;
  price: number;
  roomsCount: number;
}

export interface HotelItem {
  id: string;
  name: string;
  nameEn?: string;
  location: string;
  locationEn?: string;
  address?: string;
  addressEn?: string;
  status: string;
  rating: number; // 1 to 5
  availableRooms: number;
  pricePerNight: number;
  image: string;
  roomTypes?: RoomTypeRow[];
  amenities?: string[];
  amenitiesEn?: string[];
  distanceToHaram?: string;
}

export interface StandardRoomTypeOption {
  id: string;
  nameAr: string;
  nameEn: string;
  capacityAr: string;
  capacityEn: string;
  bedsCount: number;
  defaultSize: string;
}

export const STANDARD_ROOM_TYPES: StandardRoomTypeOption[] = [
  {
    id: 'double',
    nameAr: 'غرفة ثنائية (Double Room)',
    nameEn: 'Double Room',
    capacityAr: 'شخصين (٢)',
    capacityEn: '2 Persons',
    bedsCount: 2,
    defaultSize: '28 م²',
  },
  {
    id: 'king',
    nameAr: 'غرفة كينج فاخرة (King Room)',
    nameEn: 'King Room',
    capacityAr: 'شخصين (٢)',
    capacityEn: '2 Persons',
    bedsCount: 1,
    defaultSize: '32 م²',
  },
  {
    id: 'single',
    nameAr: 'غرفة مفردة (Single Room)',
    nameEn: 'Single Room',
    capacityAr: 'شخص واحد (١)',
    capacityEn: '1 Person',
    bedsCount: 1,
    defaultSize: '22 م²',
  },
  {
    id: 'triple',
    nameAr: 'غرفة ثلاثية (Triple Room)',
    nameEn: 'Triple Room',
    capacityAr: '٣ أشخاص',
    capacityEn: '3 Persons',
    bedsCount: 3,
    defaultSize: '30 م²',
  },
  {
    id: 'quad',
    nameAr: 'غرفة رباعية (Quad Room)',
    nameEn: 'Quad Room',
    capacityAr: '٤ أشخاص',
    capacityEn: '4 Persons',
    bedsCount: 4,
    defaultSize: '36 م²',
  },
  {
    id: 'quint',
    nameAr: 'غرفة خماسية (Quint Room)',
    nameEn: 'Quint Room',
    capacityAr: '٥ أشخاص',
    capacityEn: '5 Persons',
    bedsCount: 5,
    defaultSize: '45 م²',
  },
  {
    id: 'family_suite',
    nameAr: 'جناح عائلي (Family Suite)',
    nameEn: 'Family Suite',
    capacityAr: '٦ أشخاص',
    capacityEn: '6 Persons',
    bedsCount: 6,
    defaultSize: '55 م²',
  },
  {
    id: 'royal_suite',
    nameAr: 'جناح ملكي فاخر (Royal Suite)',
    nameEn: 'Royal VIP Suite',
    capacityAr: '٤-٦ أشخاص',
    capacityEn: '4-6 Persons',
    bedsCount: 4,
    defaultSize: '75 م²',
  },
];

export const DEFAULT_AMENITIES_AR = [
  'إنترنت واي فاي مجاني فائق السرعة',
  'حافلات ترددية مجانية للحرم على مدار الساعة',
  'مطعم وبوفيه إفطار مفتوح فاخر',
  'خدمة استقبال وغرف 24/7',
  'مكتب حجز وتفويج للمعتمرين',
  'مصاعد بانورامية وسريعة',
  'مرافق مهيأة لذوي الاحتياجات الخاصة',
  'خدمة غسيل وكي الملابس السريعة',
];

export const DEFAULT_AMENITIES_EN = [
  'High-Speed Free Wi-Fi Internet',
  '24/7 Free Haram Shuttle Buses',
  'Gourmet Buffet & On-Site Restaurant',
  '24/7 Front Desk & Concierge Service',
  'Pilgrim Logistics & Booking Center',
  'High-Speed Panoramic Elevators',
  'Accessible Facilities for Disabled Guests',
  'Express Laundry & Dry Cleaning',
];

export const DEFAULT_HOTELS: HotelItem[] = [
  {
    id: 'hotel-grand-zuwar',
    name: 'فندق جراند زوار للضيافة السياحي',
    nameEn: 'Grand Zuwar Hospitality Hotel',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    address: 'شارع إبراهيم الخليل، المنطقة المركزية، مكة المكرمة',
    addressEn: 'Ibrahim Al-Khalil St, Central Area, Makkah',
    status: 'متاح للتسكين',
    rating: 5,
    availableRooms: 180,
    pricePerNight: 450,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '350m to Holy Haram',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 450, roomsCount: 60 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 600, roomsCount: 45 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 750, roomsCount: 40 },
      { id: '4', name: 'غرفة خماسية (Quint)', capacity: '٥ أشخاص', price: 900, roomsCount: 20 },
      { id: '5', name: 'جناح تنفيذي عائلي (VIP Suite)', capacity: '٦ أشخاص', price: 1250, roomsCount: 15 },
    ],
  },
  {
    id: '1',
    name: 'فندق برج جوار الحرم السكني',
    nameEn: 'Borj Jowar Al-Haram Residential Hotel',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    address: 'شارع أجياد العام، مكة المكرمة',
    addressEn: 'Ajyad Main Street, Makkah',
    status: 'محجوز بالكامل',
    rating: 5,
    availableRooms: 120,
    pricePerNight: 480,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '200m to Clock Tower',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 480, roomsCount: 40 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 650, roomsCount: 30 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 800, roomsCount: 25 },
      { id: '4', name: 'غرفة خماسية (Quint)', capacity: '٥ أشخاص', price: 950, roomsCount: 15 },
      { id: '5', name: 'جناح ملكي (Royal Suite)', capacity: '٦ أشخاص', price: 1400, roomsCount: 10 },
    ],
  },
  {
    id: '2',
    name: 'فندق المدينة السكني المتميز',
    nameEn: 'Madinah Premium Residential Hotel',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    address: 'المنطقة المركزية الشمالية، المدينة المنورة',
    addressEn: 'Central North Zone, Madinah',
    status: 'متاح للتسكين',
    rating: 4,
    availableRooms: 85,
    pricePerNight: 380,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '400m to Prophet Mosque',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 380, roomsCount: 35 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 520, roomsCount: 30 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 680, roomsCount: 20 },
    ],
  },
  {
    id: '3',
    name: 'فندق مكة الكبير ذو المنارتين',
    nameEn: 'Grand Makkah Twin Minaret Hotel',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    address: 'طريق أجياد، مكة المكرمة',
    addressEn: 'Ajyad Road, Makkah',
    status: 'متاح للتسكين',
    rating: 5,
    availableRooms: 150,
    pricePerNight: 450,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '500m to Haram Courtyard',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 450, roomsCount: 50 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 600, roomsCount: 40 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 750, roomsCount: 35 },
      { id: '4', name: 'غرفة خماسية (Quint)', capacity: '٥ أشخاص', price: 900, roomsCount: 25 },
    ],
  },
  {
    id: '4',
    name: 'فندق رياض الحرم الفاخر',
    nameEn: 'Riyad Al-Haram Luxury Hotel',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    address: 'شارع السلام، المدينة المنورة',
    addressEn: 'Al-Salam St, Madinah',
    status: 'محجوز بالكامل',
    rating: 5,
    availableRooms: 200,
    pricePerNight: 550,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '150m to Bab Al-Salam',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 550, roomsCount: 70 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 720, roomsCount: 60 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 890, roomsCount: 45 },
      { id: '4', name: 'جناح رئاسي (Presidential Suite)', capacity: '٦ أشخاص', price: 1600, roomsCount: 25 },
    ],
  },
  {
    id: '5',
    name: 'فندق ضيافة مكة الاستثماري',
    nameEn: 'Diyafat Makkah Investment Hotel',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    address: 'حي المعابدة، مكة المكرمة',
    addressEn: 'Al-Maabda, Makkah',
    status: 'متاح للتسكين',
    rating: 4,
    availableRooms: 150,
    pricePerNight: 410,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '1.2km (Shuttle 24/7)',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 410, roomsCount: 50 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 550, roomsCount: 50 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 700, roomsCount: 50 },
    ],
  },
  {
    id: '6',
    name: 'فندق أنوار المدينة الحديث',
    nameEn: 'Anwar Al-Madinah Modern Hotel',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    address: 'المنطقة المركزية الغربية، المدينة المنورة',
    addressEn: 'Central West Zone, Madinah',
    status: 'متاح للتسكين',
    rating: 4,
    availableRooms: 95,
    pricePerNight: 350,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '300m to Prophet Mosque Gate 8',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 350, roomsCount: 45 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 480, roomsCount: 30 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 620, roomsCount: 20 },
    ],
  },
  {
    id: '7',
    name: 'سكن طيبة للزوار',
    nameEn: 'Taiba Visitors Residence',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    address: 'طريق قربان، المدينة المنورة',
    addressEn: 'Qurban Road, Madinah',
    status: 'متاح للتسكين',
    rating: 3,
    availableRooms: 75,
    pricePerNight: 280,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '600m to Mosque',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة ثنائية (Double)', capacity: '٢ أشخاص', price: 280, roomsCount: 30 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 390, roomsCount: 25 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 490, roomsCount: 20 },
    ],
  },
  {
    id: '8',
    name: 'مجموعة فنادق البركة',
    nameEn: 'Al Barakah Hotels Group',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    address: 'حي العزيزية الشمالية، مكة المكرمة',
    addressEn: 'North Aziziyah, Makkah',
    status: 'متاح للتسكين',
    rating: 4,
    availableRooms: 220,
    pricePerNight: 390,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    distanceToHaram: '1.5km (Free Express Shuttle)',
    amenities: DEFAULT_AMENITIES_AR,
    amenitiesEn: DEFAULT_AMENITIES_EN,
    roomTypes: [
      { id: '1', name: 'غرفة مزدوجة (Double)', capacity: '٢ أشخاص', price: 390, roomsCount: 80 },
      { id: '2', name: 'غرفة ثلاثية (Triple)', capacity: '٣ أشخاص', price: 520, roomsCount: 70 },
      { id: '3', name: 'غرفة رباعية (Quad)', capacity: '٤ أشخاص', price: 660, roomsCount: 45 },
      { id: '4', name: 'غرفة خماسية (Quint)', capacity: '٥ أشخاص', price: 800, roomsCount: 25 },
    ],
  },
];

const STORAGE_KEY = 'system_list_hotels';

/**
 * Retrieve current hotels list from localStorage or fallback to defaults
 */
export function getHotelsList(): HotelItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read hotels from localStorage:', e);
  }

  // First time initialization: write defaults to storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOTELS));
  } catch {}

  return DEFAULT_HOTELS;
}

/**
 * Save updated hotels list to localStorage
 */
export function saveHotelsList(hotels: HotelItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  } catch (e) {
    console.error('Failed to save hotels to localStorage:', e);
  }
}

/**
 * Find hotel by ID or Name (supports Arabic and English names matching)
 */
export function getHotelByIdOrName(idOrName: string): HotelItem | undefined {
  if (!idOrName) return undefined;
  const hotels = getHotelsList();
  const cleanQuery = idOrName.trim().toLowerCase();

  return hotels.find((h) => {
    if (h.id === idOrName) return true;
    if (h.name && h.name.toLowerCase().includes(cleanQuery)) return true;
    if (h.nameEn && h.nameEn.toLowerCase().includes(cleanQuery)) return true;
    if (cleanQuery.includes(h.name.toLowerCase())) return true;
    if (h.nameEn && cleanQuery.includes(h.nameEn.toLowerCase())) return true;
    return false;
  }) || hotels[0];
}
