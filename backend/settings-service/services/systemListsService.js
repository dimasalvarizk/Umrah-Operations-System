const SystemListModel = require('../models/systemListModel');

const DEFAULT_AGENTS = [
  { nameEn: 'Hasoob Al-Haiba', nameAr: 'حاسوب الهيبة', code: 'AGT-01', secondary: 'Saudi Arabia', status: 'Active', notes: 'Main agency partner' },
  { nameEn: 'ODST Group Partner', nameAr: 'مجموعة أو دي إس تي', code: 'AGT-02', secondary: 'Saudi Arabia', status: 'Active', notes: 'Core operational partner' },
  { nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران', code: 'AGT-03', secondary: 'Egypt', status: 'Active', notes: 'Tasheel Tourism sub-agent' },
  { nameEn: 'Noor Al-Iman International', nameAr: 'نور الإيمان الدولية', code: 'AGT-04', secondary: 'Egypt', status: 'Active', notes: 'Cairo regional agent' },
  { nameEn: 'Indonesia Travel Umrah', nameAr: 'إندونيسيا ترافيل', code: 'AGT-05', secondary: 'Indonesia', status: 'Active', notes: 'Al-Huda Trips partner' },
  { nameEn: 'Al-Safa Travel India', nameAr: 'الصفا ترافيل الهند', code: 'AGT-06', secondary: 'India', status: 'Active', notes: 'Mumbai & Delhi operations' },
  { nameEn: 'Ankara Tourism Agency', nameAr: 'وكالة أنقرة للسياحة', code: 'AGT-07', secondary: 'Turkey', status: 'Active', notes: 'Tasheel Turkey representative' },
  { nameEn: 'Islamic Association Indonesia', nameAr: 'رابطة الإسلام إندونيسيا', code: 'AGT-08', secondary: 'Indonesia', status: 'Active', notes: 'Jakarta groups partner' },
  { nameEn: 'Modern Amman Agency', nameAr: 'وكالة عمان الحديثة', code: 'AGT-09', secondary: 'Jordan', status: 'Active', notes: 'Al-Quds Jordan affiliate' },
  { nameEn: 'Al-Rahman Pakistan', nameAr: 'الرحمن باكستان', code: 'AGT-10', secondary: 'Pakistan', status: 'Active', notes: 'Karachi & Lahore agent' },
];

const DEFAULT_AIRLINES = [
  { nameEn: 'Saudia', nameAr: 'الخطوط السعودية', code: 'SV', secondary: 'Jeddah / Madinah', status: 'Active', notes: 'National flag carrier' },
  { nameEn: 'Flynas', nameAr: 'طيران ناس', code: 'XY', secondary: 'Riyadh / Jeddah', status: 'Active', notes: 'Domestic & Regional' },
  { nameEn: 'Garuda Indonesia', nameAr: 'جارودا إندونيسيا', code: 'GA', secondary: 'Jakarta', status: 'Active', notes: 'Direct Hajj & Umrah charter' },
  { nameEn: 'EgyptAir', nameAr: 'مصر للطيران', code: 'MS', secondary: 'Cairo / Alexandria', status: 'Active', notes: 'Daily flights' },
  { nameEn: 'Qatar Airways', nameAr: 'الخطوط القطرية', code: 'QR', secondary: 'Doha', status: 'Active', notes: 'Transit international' },
  { nameEn: 'Emirates Airlines', nameAr: 'طيران الإمارات', code: 'EK', secondary: 'Dubai', status: 'Active', notes: 'Global transit hubs' },
  { nameEn: 'Turkish Airlines', nameAr: 'الخطوط التركية', code: 'TK', secondary: 'Istanbul', status: 'Active', notes: 'European & Central Asia traffic' },
  { nameEn: 'Lion Air', nameAr: 'ليون إير', code: 'JT', secondary: 'Surabaya / Jakarta', status: 'Active', notes: 'Direct umrah charter' },
];

const DEFAULT_COUNTRIES = [
  { nameEn: 'Indonesia', nameAr: 'إندونيسيا', code: 'ID (+62)', secondary: 'Southeast Asia', status: 'Active', notes: 'High volume pilgrims' },
  { nameEn: 'Pakistan', nameAr: 'باكستان', code: 'PK (+92)', secondary: 'South Asia', status: 'Active', notes: 'High volume pilgrims' },
  { nameEn: 'Egypt', nameAr: 'مصر', code: 'EG (+20)', secondary: 'Middle East', status: 'Active', notes: 'Year-round operations' },
  { nameEn: 'Turkey', nameAr: 'تركيا', code: 'TR (+90)', secondary: 'Eurasia', status: 'Active', notes: 'Regular season & Ramadan' },
  { nameEn: 'India', nameAr: 'الهند', code: 'IN (+91)', secondary: 'South Asia', status: 'Active', notes: 'Regular groups' },
  { nameEn: 'Jordan', nameAr: 'الأردن', code: 'JO (+962)', secondary: 'Levant', status: 'Active', notes: 'Direct land & air umrah' },
  { nameEn: 'Algeria', nameAr: 'الجزائر', code: 'DZ (+213)', secondary: 'North Africa', status: 'Active', notes: 'Seasonal groups' },
  { nameEn: 'Malaysia', nameAr: 'ماليزيا', code: 'MY (+60)', secondary: 'Southeast Asia', status: 'Active', notes: 'Premium programs' },
];

const DEFAULT_BRANCHES = [
  { nameEn: 'Makkah Main Operations', nameAr: 'الفرع الرئيسي - مكة المكرمة', code: 'MKH-01', secondary: 'Ibrahim Al-Khalil St.', status: 'Active', notes: 'Main HQ operations' },
  { nameEn: 'Madinah Regional Hub', nameAr: 'فرع المدينة المنورة', code: 'MED-01', secondary: 'Central Area North', status: 'Active', notes: 'Prophet Mosque operations' },
  { nameEn: 'Jeddah Airport Terminal Desk', nameAr: 'مكتب مطار الملك عبدالعزيز - جدة', code: 'JED-AIR', secondary: 'Terminal 1 & North', status: 'Active', notes: '24/7 Pilgrim Reception' },
  { nameEn: 'Yanbu Port Logistics', nameAr: 'مكتب ميناء ينبع التجاري', code: 'YNB-01', secondary: 'Maritime Terminal', status: 'Active', notes: 'Ferry and cruise support' },
];

const DEFAULT_TRANSPORT = [
  { nameEn: 'SAPTO Transport Company', nameAr: 'شركة سابتكو للنقل', code: 'BUS-SAP', secondary: 'VIP Coaches & standard', status: 'Active', notes: 'Approved Naqaba operator' },
  { nameEn: 'Dallah Transport Fleet', nameAr: 'أسطول دله للنقل', code: 'BUS-DAL', secondary: 'Mercedes Travego / Man', status: 'Active', notes: 'VIP group logistics' },
  { nameEn: 'Rawahel Al-Mashaer', nameAr: 'رواحل المشاعر', code: 'BUS-RAW', secondary: 'Modern High-deckers', status: 'Active', notes: 'Large group transfers' },
  { nameEn: 'Qawafil International', nameAr: 'قوافل الدولية', code: 'BUS-QAW', secondary: 'King Long / Yutong', status: 'Active', notes: 'Full season contracts' },
  { nameEn: 'Al-Qaid Transport', nameAr: 'شركة القائد لخدمات النقل', code: 'BUS-QAD', secondary: 'Airport shuttles & buses', status: 'Active', notes: 'Fast response fleet' },
  { nameEn: 'Hafil Transport Company', nameAr: 'شركة حافل لنقل الحجاج', code: 'BUS-HFL', secondary: 'Approved Naqaba Fleet', status: 'Active', notes: 'Government certified mass transport' },
];

const DEFAULT_PACKAGES = [
  { nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات التنفيذية (١٤ يوم)', code: 'PKG-VIP14', secondary: '5-Star Front Row Hotels', status: 'Active', notes: 'Full Board & Private GMC transfers' },
  { nameEn: 'Premium Gold 12 Days', nameAr: 'الباقة الذهبية المميزة (١٢ يوم)', code: 'PKG-GLD12', secondary: '5-Star Walking Distance', status: 'Active', notes: 'Half Board & Luxury Bus' },
  { nameEn: 'Classic Economy 10 Days', nameAr: 'الباقة الاقتصادية الكلاسيكية (١٠ أيام)', code: 'PKG-ECO10', secondary: '4-Star Central Hotels', status: 'Active', notes: 'Bed & Breakfast, Group Coach' },
  { nameEn: 'Ramadan Last 10 Days Special', nameAr: 'برنامج العشر الأواخر من رمضان', code: 'PKG-RAM10', secondary: 'Makkah Clock Towers', status: 'Active', notes: 'Iftar & Suhoor Included' },
];

const DEFAULT_AIRPORTS = [
  { nameEn: 'Prince Mohammad Bin Abdulaziz Int. Airport - Madinah (MED)', nameAr: 'مطار الأمير محمد بن عبد العزيز الدولي - المدينة (MED)', code: 'MED', secondary: 'Madinah, KSA', status: 'Active', notes: 'GACA Approved Umrah Terminal' },
  { nameEn: 'King Abdulaziz Int. Airport - Jeddah (JED)', nameAr: 'مطار الملك عبد العزيز الدولي - جدة (JED)', code: 'JED', secondary: 'Jeddah, KSA', status: 'Active', notes: 'Hajj & Umrah Main Gateway' },
  { nameEn: 'Taif International Airport (TIF)', nameAr: 'مطار الطائف الدولي (TIF)', code: 'TIF', secondary: 'Taif, KSA', status: 'Active', notes: 'Miqat Qarn Al-Manazil Gateway' },
  { nameEn: 'King Khalid Int. Airport - Riyadh (RUH)', nameAr: 'مطار الملك خالد الدولي - الرياض (RUH)', code: 'RUH', secondary: 'Riyadh, KSA', status: 'Active', notes: 'Capital Hub & Connecting Port' },
  { nameEn: 'Yanbu Prince Abdul Mohsin Int. Airport (YNB)', nameAr: 'مطار الأمير عبد المحسن بن عبد العزيز ينبع (YNB)', code: 'YNB', secondary: 'Yanbu, KSA', status: 'Active', notes: 'Red Sea & Western Port' },
];

const DEFAULT_ROOM_TYPES = [
  { nameEn: 'Double Room (2 Persons)', nameAr: 'غرفة ثنائية (شخصين)', code: 'DBL-2', secondary: '2 Beds • 28 m²', status: 'Active', notes: '2 Standard Single Beds' },
  { nameEn: 'King Room (2 Persons)', nameAr: 'غرفة كينج فاخرة (شخصين)', code: 'KNG-2', secondary: '1 King Bed • 32 m²', status: 'Active', notes: '1 Master King Size Bed' },
  { nameEn: 'Single Room (1 Person)', nameAr: 'غرفة مفردة (شخص واحد)', code: 'SGL-1', secondary: '1 Bed • 22 m²', status: 'Active', notes: 'Private single traveler' },
  { nameEn: 'Triple Room (3 Persons)', nameAr: 'غرفة ثلاثية (٣ أشخاص)', code: 'TRP-3', secondary: '3 Beds • 30 m²', status: 'Active', notes: '3 Standard Single Beds' },
  { nameEn: 'Quad Room (4 Persons)', nameAr: 'غرفة رباعية (٤ أشخاص)', code: 'QAD-4', secondary: '4 Beds • 36 m²', status: 'Active', notes: '4 Standard Single Beds' },
  { nameEn: 'Quint Room (5 Persons)', nameAr: 'غرفة خماسية (٥ أشخاص)', code: 'QNT-5', secondary: '5 Beds • 45 m²', status: 'Active', notes: '5 Single Beds Family' },
  { nameEn: 'Family Suite (6 Persons)', nameAr: 'جناح عائلي (٦ أشخاص)', code: 'STE-6', secondary: '6 Beds • 55 m²', status: 'Active', notes: 'Connecting Suite 6 Pax' },
  { nameEn: 'Royal VIP Suite (4-6 Persons)', nameAr: 'جناح ملكي فاخر (٤-٦ أشخاص)', code: 'ROY-VIP', secondary: '4-6 Beds • 75 m²', status: 'Active', notes: 'Direct Haram View Luxury' },
];

const DEFAULT_GUIDES = [
  { nameEn: 'Youssef Makki', nameAr: 'يوسف مكي', code: 'GUD-01', secondary: 'Senior Makkah Mutawwif', status: 'Active', notes: 'Arabic, English, Indonesian' },
  { nameEn: 'Abdulrahman Saber', nameAr: 'عبد الرحمن صابر', code: 'GUD-02', secondary: 'Madinah Ziyarah Specialist', status: 'Active', notes: 'Arabic, English, Urdu' },
  { nameEn: 'Ahmed Al-Otaibi', nameAr: 'أحمد العتيبي', code: 'GUD-03', secondary: 'Historical Sites Guide', status: 'Active', notes: 'Arabic, English' },
  { nameEn: 'Faisal Al-Harbi', nameAr: 'فيصل الحربي', code: 'GUD-04', secondary: 'VIP Delegations Lead', status: 'Active', notes: 'Arabic, English, Turkish' },
  { nameEn: 'Jamal Mustafa', nameAr: 'جمال مصطفى', code: 'GUD-05', secondary: 'Airport Logistics & Guide', status: 'Active', notes: 'Arabic, English, French' },
  { nameEn: 'Tariq Al-Husseini', nameAr: 'طارق الحسيني', code: 'GUD-06', secondary: 'Hajj & Umrah Fiqh Guide', status: 'Active', notes: 'Arabic, English, Malay' },
];

const DEFAULT_ROUTES = [
  { nameEn: 'Makkah ➔ Madinah', nameAr: 'مكة ← المدينة', code: 'MKH-MED', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
  { nameEn: 'Madinah ➔ Makkah', nameAr: 'المدينة ← مكة', code: 'MED-MKH', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
  { nameEn: 'Jeddah Airport ➔ Makkah', nameAr: 'مطار جدة ← مكة', code: 'JED-MKH', secondary: 'Airport Arrival Transfer', status: 'Active', notes: 'Arrival reception' },
  { nameEn: 'Makkah ➔ Jeddah Airport', nameAr: 'مكة ← مطار جدة', code: 'MKH-JED', secondary: 'Airport Departure Transfer', status: 'Active', notes: 'Departure farewell' },
  { nameEn: 'Makkah (Rusaifah) ↔ Madinah', nameAr: 'مكة (الرصيفة) ↔ المدينة', code: 'HSR-MKH-MED', secondary: 'Haramain High Speed Train', status: 'Active', notes: 'Express bullet train' },
  { nameEn: 'Makkah ↔ Mount Thawr', nameAr: 'مكة المكرمة ↔ جبل ثور', code: 'MKH-THW', secondary: 'Makkah Historic Ziyarah', status: 'Active', notes: 'Historical ziyarah site' },
  { nameEn: 'Jakarta ➔ Jeddah (JED Airport)', nameAr: 'جاكرتا ← جدة (مطار الملك عبد العزيز)', code: 'CGK-JED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - KSA' },
  { nameEn: 'Jakarta ➔ Madinah (MED Airport)', nameAr: 'جاكرتا ← المدينة (مطار الأمير محمد)', code: 'CGK-MED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - Madinah' },
  { nameEn: 'Jeddah ➔ Jakarta', nameAr: 'جدة ← جاكرتا', code: 'JED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight to Indonesia' },
  { nameEn: 'Madinah ➔ Jakarta', nameAr: 'المدينة ← جاكرتا', code: 'MED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight from Madinah' },
];

const CATEGORY_DEFAULTS = {
  agents: DEFAULT_AGENTS,
  airlines: DEFAULT_AIRLINES,
  countries: DEFAULT_COUNTRIES,
  branches: DEFAULT_BRANCHES,
  transport: DEFAULT_TRANSPORT,
  packages: DEFAULT_PACKAGES,
  airports: DEFAULT_AIRPORTS,
  room_types: DEFAULT_ROOM_TYPES,
  guides: DEFAULT_GUIDES,
  routes: DEFAULT_ROUTES,
};

class SystemListsService {
  /**
   * Get items by category. Auto-initializes with defaults if empty.
   */
  static async getItems(category, search = '') {
    let items = await SystemListModel.getByCategory(category, search);

    // If completely empty for this category and not a search, seed defaults
    if (items.length === 0 && !search && CATEGORY_DEFAULTS[category]) {
      items = await SystemListModel.resetCategory(category, CATEGORY_DEFAULTS[category]);
    }

    return items;
  }

  static async getItemById(id) {
    return SystemListModel.getById(id);
  }

  static async createItem(data) {
    return SystemListModel.create(data);
  }

  static async updateItem(id, data) {
    return SystemListModel.update(id, data);
  }

  static async toggleStatus(id) {
    return SystemListModel.toggleStatus(id);
  }

  static async deleteItem(id) {
    return SystemListModel.delete(id);
  }

  static async resetCategory(category) {
    const defaults = CATEGORY_DEFAULTS[category];
    if (!defaults) {
      throw new Error(`Invalid category: ${category}`);
    }
    return SystemListModel.resetCategory(category, defaults);
  }

  static async getStats() {
    return SystemListModel.getStats();
  }
}

module.exports = SystemListsService;
