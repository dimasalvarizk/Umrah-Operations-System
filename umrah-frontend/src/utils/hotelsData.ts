export interface RoomTypeRow {
  id: string;
  name: string;
  capacity: string;
  price: number;
  roomsCount: number;
}

export interface HotelItem {
  id: string;
  code?: string;
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
  images?: string[];
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

export const STORAGE_KEY = 'system_list_hotels';

/**
 * Retrieve current hotels list from localStorage or empty array (no dummy fallback)
 */
export function getHotelsList(): HotelItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read hotels from localStorage:', e);
  }
  return [];
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
    if (h.code && h.code.toLowerCase() === cleanQuery) return true;
    if (h.name && h.name.toLowerCase().includes(cleanQuery)) return true;
    if (h.nameEn && h.nameEn.toLowerCase().includes(cleanQuery)) return true;
    return false;
  });
}

