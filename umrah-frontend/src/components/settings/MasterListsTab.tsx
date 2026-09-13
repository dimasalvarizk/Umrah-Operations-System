import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Building2,
  Plane,
  Globe2,
  MapPin,
  Bus,
  Tag,
  AlertTriangle,
  RotateCcw,
  Navigation,
  Bed,
  Compass,
  Route,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getSystemListsApi,
  createSystemListItemApi,
  updateSystemListItemApi,
  toggleSystemListStatusApi,
  deleteSystemListItemApi,
  resetSystemListCategoryApi,
  type ListCategory,
  type BaseListItem,
} from '../../services/settingsApi';

const DEFAULT_AGENTS: BaseListItem[] = [
  { id: '1', nameEn: 'Hasoob Al-Haiba', nameAr: 'حاسوب الهيبة', code: 'AGT-01', secondary: 'Saudi Arabia', status: 'Active', notes: 'Main agency partner' },
  { id: '2', nameEn: 'ODST Group Partner', nameAr: 'مجموعة أو دي إس تي', code: 'AGT-02', secondary: 'Saudi Arabia', status: 'Active', notes: 'Core operational partner' },
  { id: '3', nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران', code: 'AGT-03', secondary: 'Egypt', status: 'Active', notes: 'Tasheel Tourism sub-agent' },
  { id: '4', nameEn: 'Noor Al-Iman International', nameAr: 'نور الإيمان الدولية', code: 'AGT-04', secondary: 'Egypt', status: 'Active', notes: 'Cairo regional agent' },
  { id: '5', nameEn: 'Indonesia Travel Umrah', nameAr: 'إندونيسيا ترافيل', code: 'AGT-05', secondary: 'Indonesia', status: 'Active', notes: 'Al-Huda Trips partner' },
  { id: '6', nameEn: 'Al-Safa Travel India', nameAr: 'الصفا ترافيل الهند', code: 'AGT-06', secondary: 'India', status: 'Active', notes: 'Mumbai & Delhi operations' },
  { id: '7', nameEn: 'Ankara Tourism Agency', nameAr: 'وكالة أنقرة للسياحة', code: 'AGT-07', secondary: 'Turkey', status: 'Active', notes: 'Tasheel Turkey representative' },
  { id: '8', nameEn: 'Islamic Association Indonesia', nameAr: 'رابطة الإسلام إندونيسيا', code: 'AGT-08', secondary: 'Indonesia', status: 'Active', notes: 'Jakarta groups partner' },
  { id: '9', nameEn: 'Modern Amman Agency', nameAr: 'وكالة عمان الحديثة', code: 'AGT-09', secondary: 'Jordan', status: 'Active', notes: 'Al-Quds Jordan affiliate' },
  { id: '10', nameEn: 'Al-Rahman Pakistan', nameAr: 'الرحمن باكستان', code: 'AGT-10', secondary: 'Pakistan', status: 'Active', notes: 'Karachi & Lahore agent' },
];

const DEFAULT_AIRLINES: BaseListItem[] = [
  { id: '1', nameEn: 'Saudia', nameAr: 'الخطوط السعودية', code: 'SV', secondary: 'Jeddah / Madinah', status: 'Active', notes: 'National flag carrier' },
  { id: '2', nameEn: 'Flynas', nameAr: 'طيران ناس', code: 'XY', secondary: 'Riyadh / Jeddah', status: 'Active', notes: 'Domestic & Regional' },
  { id: '3', nameEn: 'Garuda Indonesia', nameAr: 'جارودا إندونيسيا', code: 'GA', secondary: 'Jakarta', status: 'Active', notes: 'Direct Hajj & Umrah charter' },
  { id: '4', nameEn: 'EgyptAir', nameAr: 'مصر للطيران', code: 'MS', secondary: 'Cairo / Alexandria', status: 'Active', notes: 'Daily flights' },
  { id: '5', nameEn: 'Qatar Airways', nameAr: 'الخطوط القطرية', code: 'QR', secondary: 'Doha', status: 'Active', notes: 'Transit international' },
  { id: '6', nameEn: 'Emirates Airlines', nameAr: 'طيران الإمارات', code: 'EK', secondary: 'Dubai', status: 'Active', notes: 'Global transit hubs' },
  { id: '7', nameEn: 'Turkish Airlines', nameAr: 'الخطوط التركية', code: 'TK', secondary: 'Istanbul', status: 'Active', notes: 'European & Central Asia traffic' },
  { id: '8', nameEn: 'Lion Air', nameAr: 'ليون إير', code: 'JT', secondary: 'Surabaya / Jakarta', status: 'Active', notes: 'Direct umrah charter' },
];

const DEFAULT_COUNTRIES: BaseListItem[] = [
  { id: '1', nameEn: 'Indonesia', nameAr: 'إندونيسيا', code: 'ID (+62)', secondary: 'Southeast Asia', status: 'Active', notes: 'High volume pilgrims' },
  { id: '2', nameEn: 'Pakistan', nameAr: 'باكستان', code: 'PK (+92)', secondary: 'South Asia', status: 'Active', notes: 'High volume pilgrims' },
  { id: '3', nameEn: 'Egypt', nameAr: 'مصر', code: 'EG (+20)', secondary: 'Middle East', status: 'Active', notes: 'Year-round operations' },
  { id: '4', nameEn: 'Turkey', nameAr: 'تركيا', code: 'TR (+90)', secondary: 'Eurasia', status: 'Active', notes: 'Regular season & Ramadan' },
  { id: '5', nameEn: 'India', nameAr: 'الهند', code: 'IN (+91)', secondary: 'South Asia', status: 'Active', notes: 'Regular groups' },
  { id: '6', nameEn: 'Jordan', nameAr: 'الأردن', code: 'JO (+962)', secondary: 'Levant', status: 'Active', notes: 'Direct land & air umrah' },
  { id: '7', nameEn: 'Algeria', nameAr: 'الجزائر', code: 'DZ (+213)', secondary: 'North Africa', status: 'Active', notes: 'Seasonal groups' },
  { id: '8', nameEn: 'Malaysia', nameAr: 'ماليزيا', code: 'MY (+60)', secondary: 'Southeast Asia', status: 'Active', notes: 'Premium programs' },
];

const DEFAULT_BRANCHES: BaseListItem[] = [
  { id: '1', nameEn: 'Makkah Main Operations', nameAr: 'الفرع الرئيسي - مكة المكرمة', code: 'MKH-01', secondary: 'Ibrahim Al-Khalil St.', status: 'Active', notes: 'Main HQ operations' },
  { id: '2', nameEn: 'Madinah Regional Hub', nameAr: 'فرع المدينة المنورة', code: 'MED-01', secondary: 'Central Area North', status: 'Active', notes: 'Prophet Mosque operations' },
  { id: '3', nameEn: 'Jeddah Airport Terminal Desk', nameAr: 'مكتب مطار الملك عبدالعزيز - جدة', code: 'JED-AIR', secondary: 'Terminal 1 & North', status: 'Active', notes: '24/7 Pilgrim Reception' },
  { id: '4', nameEn: 'Yanbu Port Logistics', nameAr: 'مكتب ميناء ينبع التجاري', code: 'YNB-01', secondary: 'Maritime Terminal', status: 'Active', notes: 'Ferry and cruise support' },
];

const DEFAULT_TRANSPORT: BaseListItem[] = [
  { id: '1', nameEn: 'SAPTO Transport Company', nameAr: 'شركة سابتكو للنقل', code: 'BUS-SAP', secondary: 'VIP Coaches & standard', status: 'Active', notes: 'Approved Naqaba operator' },
  { id: '2', nameEn: 'Dallah Transport Fleet', nameAr: 'أسطول دله للنقل', code: 'BUS-DAL', secondary: 'Mercedes Travego / Man', status: 'Active', notes: 'VIP group logistics' },
  { id: '3', nameEn: 'Rawahel Al-Mashaer', nameAr: 'رواحل المشاعر', code: 'BUS-RAW', secondary: 'Modern High-deckers', status: 'Active', notes: 'Large group transfers' },
  { id: '4', nameEn: 'Qawafil International', nameAr: 'قوافل الدولية', code: 'BUS-QAW', secondary: 'King Long / Yutong', status: 'Active', notes: 'Full season contracts' },
  { id: '5', nameEn: 'Al-Qaid Transport', nameAr: 'شركة القائد لخدمات النقل', code: 'BUS-QAD', secondary: 'Airport shuttles & buses', status: 'Active', notes: 'Fast response fleet' },
  { id: '6', nameEn: 'Hafil Transport Company', nameAr: 'شركة حافل لنقل الحجاج', code: 'BUS-HFL', secondary: 'Approved Naqaba Fleet', status: 'Active', notes: 'Government certified mass transport' },
];

const DEFAULT_PACKAGES: BaseListItem[] = [
  { id: '1', nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات التنفيذية (١٤ يوم)', code: 'PKG-VIP14', secondary: '5-Star Front Row Hotels', status: 'Active', notes: 'Full Board & Private GMC transfers' },
  { id: '2', nameEn: 'Premium Gold 12 Days', nameAr: 'الباقة الذهبية المميزة (١٢ يوم)', code: 'PKG-GLD12', secondary: '5-Star Walking Distance', status: 'Active', notes: 'Half Board & Luxury Bus' },
  { id: '3', nameEn: 'Classic Economy 10 Days', nameAr: 'الباقة الاقتصادية الكلاسيكية (١٠ أيام)', code: 'PKG-ECO10', secondary: '4-Star Central Hotels', status: 'Active', notes: 'Bed & Breakfast, Group Coach' },
  { id: '4', nameEn: 'Ramadan Last 10 Days Special', nameAr: 'برنامج العشر الأواخر من رمضان', code: 'PKG-RAM10', secondary: 'Makkah Clock Towers', status: 'Active', notes: 'Iftar & Suhoor Included' },
];

const DEFAULT_AIRPORTS: BaseListItem[] = [
  { id: '1', nameEn: 'Prince Mohammad Bin Abdulaziz Int. Airport - Madinah (MED)', nameAr: 'مطار الأمير محمد بن عبد العزيز الدولي - المدينة (MED)', code: 'MED', secondary: 'Madinah, KSA', status: 'Active', notes: 'GACA Approved Umrah Terminal' },
  { id: '2', nameEn: 'King Abdulaziz Int. Airport - Jeddah (JED)', nameAr: 'مطار الملك عبد العزيز الدولي - جدة (JED)', code: 'JED', secondary: 'Jeddah, KSA', status: 'Active', notes: 'Hajj & Umrah Main Gateway' },
  { id: '3', nameEn: 'Taif International Airport (TIF)', nameAr: 'مطار الطائف الدولي (TIF)', code: 'TIF', secondary: 'Taif, KSA', status: 'Active', notes: 'Miqat Qarn Al-Manazil Gateway' },
  { id: '4', nameEn: 'King Khalid Int. Airport - Riyadh (RUH)', nameAr: 'مطار الملك خالد الدولي - الرياض (RUH)', code: 'RUH', secondary: 'Riyadh, KSA', status: 'Active', notes: 'Capital Hub & Connecting Port' },
  { id: '5', nameEn: 'Yanbu Prince Abdul Mohsin Int. Airport (YNB)', nameAr: 'مطار الأمير عبد المحسن بن عبد العزيز ينبع (YNB)', code: 'YNB', secondary: 'Yanbu, KSA', status: 'Active', notes: 'Red Sea & Western Port' },
];

const DEFAULT_ROOM_TYPES: BaseListItem[] = [
  { id: '1', nameEn: 'Double Room (2 Persons)', nameAr: 'غرفة ثنائية (شخصين)', code: 'DBL-2', secondary: '2 Beds • 28 m²', status: 'Active', notes: '2 Standard Single Beds' },
  { id: '2', nameEn: 'King Room (2 Persons)', nameAr: 'غرفة كينج فاخرة (شخصين)', code: 'KNG-2', secondary: '1 King Bed • 32 m²', status: 'Active', notes: '1 Master King Size Bed' },
  { id: '3', nameEn: 'Single Room (1 Person)', nameAr: 'غرفة مفردة (شخص واحد)', code: 'SGL-1', secondary: '1 Bed • 22 m²', status: 'Active', notes: 'Private single traveler' },
  { id: '4', nameEn: 'Triple Room (3 Persons)', nameAr: 'غرفة ثلاثية (٣ أشخاص)', code: 'TRP-3', secondary: '3 Beds • 30 m²', status: 'Active', notes: '3 Standard Single Beds' },
  { id: '5', nameEn: 'Quad Room (4 Persons)', nameAr: 'غرفة رباعية (٤ أشخاص)', code: 'QAD-4', secondary: '4 Beds • 36 m²', status: 'Active', notes: '4 Standard Single Beds' },
  { id: '6', nameEn: 'Quint Room (5 Persons)', nameAr: 'غرفة خماسية (٥ أشخاص)', code: 'QNT-5', secondary: '5 Beds • 45 m²', status: 'Active', notes: '5 Single Beds Family' },
  { id: '7', nameEn: 'Family Suite (6 Persons)', nameAr: 'جناح عائلي (٦ أشخاص)', code: 'STE-6', secondary: '6 Beds • 55 m²', status: 'Active', notes: 'Connecting Suite 6 Pax' },
  { id: '8', nameEn: 'Royal VIP Suite (4-6 Persons)', nameAr: 'جناح ملكي فاخر (٤-٦ أشخاص)', code: 'ROY-VIP', secondary: '4-6 Beds • 75 m²', status: 'Active', notes: 'Direct Haram View Luxury' },
];

const DEFAULT_GUIDES: BaseListItem[] = [
  { id: '1', nameEn: 'Youssef Makki', nameAr: 'يوسف مكي', code: 'GUD-01', secondary: 'Senior Makkah Mutawwif', status: 'Active', notes: 'Arabic, English, Indonesian' },
  { id: '2', nameEn: 'Abdulrahman Saber', nameAr: 'عبد الرحمن صابر', code: 'GUD-02', secondary: 'Madinah Ziyarah Specialist', status: 'Active', notes: 'Arabic, English, Urdu' },
  { id: '3', nameEn: 'Ahmed Al-Otaibi', nameAr: 'أحمد العتيبي', code: 'GUD-03', secondary: 'Historical Sites Guide', status: 'Active', notes: 'Arabic, English' },
  { id: '4', nameEn: 'Faisal Al-Harbi', nameAr: 'فيصل الحربي', code: 'GUD-04', secondary: 'VIP Delegations Lead', status: 'Active', notes: 'Arabic, English, Turkish' },
  { id: '5', nameEn: 'Jamal Mustafa', nameAr: 'جمال مصطفى', code: 'GUD-05', secondary: 'Airport Logistics & Guide', status: 'Active', notes: 'Arabic, English, French' },
  { id: '6', nameEn: 'Tariq Al-Husseini', nameAr: 'طارق الحسيني', code: 'GUD-06', secondary: 'Hajj & Umrah Fiqh Guide', status: 'Active', notes: 'Arabic, English, Malay' },
];

const DEFAULT_ROUTES: BaseListItem[] = [
  { id: '1', nameEn: 'Makkah ➔ Madinah', nameAr: 'مكة ← المدينة', code: 'MKH-MED', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
  { id: '2', nameEn: 'Madinah ➔ Makkah', nameAr: 'المدينة ← مكة', code: 'MED-MKH', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
  { id: '3', nameEn: 'Jeddah Airport ➔ Makkah', nameAr: 'مطار جدة ← مكة', code: 'JED-MKH', secondary: 'Airport Arrival Transfer', status: 'Active', notes: 'Arrival reception' },
  { id: '4', nameEn: 'Makkah ➔ Jeddah Airport', nameAr: 'مكة ← مطار جدة', code: 'MKH-JED', secondary: 'Airport Departure Transfer', status: 'Active', notes: 'Departure farewell' },
  { id: '5', nameEn: 'Makkah (Rusaifah) ↔ Madinah', nameAr: 'مكة (الرصيفة) ↔ المدينة', code: 'HSR-MKH-MED', secondary: 'Haramain High Speed Train', status: 'Active', notes: 'Express bullet train' },
  { id: '6', nameEn: 'Makkah ↔ Mount Thawr', nameAr: 'مكة المكرمة ↔ جبل ثور', code: 'MKH-THW', secondary: 'Makkah Historic Ziyarah', status: 'Active', notes: 'Historical ziyarah site' },
  { id: '7', nameEn: 'Jakarta ➔ Jeddah (JED Airport)', nameAr: 'جاكرتا ← جدة (مطار الملك عبد العزيز)', code: 'CGK-JED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - KSA' },
  { id: '8', nameEn: 'Jakarta ➔ Madinah (MED Airport)', nameAr: 'جاكرتا ← المدينة (مطار الأمير محمد)', code: 'CGK-MED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - Madinah' },
  { id: '9', nameEn: 'Jeddah ➔ Jakarta', nameAr: 'جدة ← جاكرتا', code: 'JED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight to Indonesia' },
  { id: '10', nameEn: 'Madinah ➔ Jakarta', nameAr: 'المدينة ← جاكرتا', code: 'MED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight from Madinah' },
];

export default function MasterListsTab() {
  const { isRTL } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<ListCategory>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Storage states for all list categories
  const [agentsList, setAgentsList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_agents');
    return saved ? JSON.parse(saved) : DEFAULT_AGENTS;
  });

  const [airlinesList, setAirlinesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_airlines');
    return saved ? JSON.parse(saved) : DEFAULT_AIRLINES;
  });

  const [countriesList, setCountriesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_countries');
    return saved ? JSON.parse(saved) : DEFAULT_COUNTRIES;
  });

  const [branchesList, setBranchesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_branches');
    return saved ? JSON.parse(saved) : DEFAULT_BRANCHES;
  });

  const [transportList, setTransportList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_transport');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSPORT;
  });

  const [packagesList, setPackagesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_packages');
    return saved ? JSON.parse(saved) : DEFAULT_PACKAGES;
  });

  const [airportsList, setAirportsList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_airports');
    return saved ? JSON.parse(saved) : DEFAULT_AIRPORTS;
  });

  const [roomTypesList, setRoomTypesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_room_types');
    return saved ? JSON.parse(saved) : DEFAULT_ROOM_TYPES;
  });

  const [guidesList, setGuidesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_guides');
    return saved ? JSON.parse(saved) : DEFAULT_GUIDES;
  });

  const [routesList, setRoutesList] = useState<BaseListItem[]>(() => {
    const saved = localStorage.getItem('system_list_routes');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTES;
  });

  // Fetch active category from backend API
  const fetchCategoryData = async (cat: ListCategory) => {
    try {
      const items = await getSystemListsApi(cat);
      if (Array.isArray(items)) {
        switch (cat) {
          case 'agents': setAgentsList(items); break;
          case 'airlines': setAirlinesList(items); break;
          case 'countries': setCountriesList(items); break;
          case 'branches': setBranchesList(items); break;
          case 'transport': setTransportList(items); break;
          case 'packages': setPackagesList(items); break;
          case 'airports': setAirportsList(items); break;
          case 'room_types': setRoomTypesList(items); break;
          case 'guides': setGuidesList(items); break;
          case 'routes': setRoutesList(items); break;
        }
      }
    } catch (err) {
      console.warn('Backend offline, using local storage fallback for', cat, err);
    }
  };

  const fetchAllCategories = async () => {
    const cats: ListCategory[] = ['agents', 'airlines', 'countries', 'branches', 'transport', 'packages', 'airports', 'room_types', 'guides', 'routes'];
    await Promise.allSettled(cats.map((c) => fetchCategoryData(c)));
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchCategoryData(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const handleSync = (e: any) => {
      if (e?.detail?.category) {
        fetchCategoryData(e.detail.category);
      } else {
        fetchAllCategories();
      }
    };

    window.addEventListener('umrah_system_lists_updated', handleSync);
    return () => {
      window.removeEventListener('umrah_system_lists_updated', handleSync);
    };
  }, []);

  // Save to localStorage whenever modified as local backup
  useEffect(() => {
    localStorage.setItem('system_list_agents', JSON.stringify(agentsList));
  }, [agentsList]);

  useEffect(() => {
    localStorage.setItem('system_list_airlines', JSON.stringify(airlinesList));
  }, [airlinesList]);

  useEffect(() => {
    localStorage.setItem('system_list_countries', JSON.stringify(countriesList));
  }, [countriesList]);

  useEffect(() => {
    localStorage.setItem('system_list_branches', JSON.stringify(branchesList));
  }, [branchesList]);

  useEffect(() => {
    localStorage.setItem('system_list_transport', JSON.stringify(transportList));
  }, [transportList]);

  useEffect(() => {
    localStorage.setItem('system_list_packages', JSON.stringify(packagesList));
  }, [packagesList]);

  useEffect(() => {
    localStorage.setItem('system_list_airports', JSON.stringify(airportsList));
  }, [airportsList]);

  useEffect(() => {
    localStorage.setItem('system_list_room_types', JSON.stringify(roomTypesList));
  }, [roomTypesList]);

  useEffect(() => {
    localStorage.setItem('system_list_guides', JSON.stringify(guidesList));
  }, [guidesList]);

  useEffect(() => {
    localStorage.setItem('system_list_routes', JSON.stringify(routesList));
  }, [routesList]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<BaseListItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BaseListItem | null>(null);

  // Form input states
  const [nameEnInput, setNameEnInput] = useState('');
  const [nameArInput, setNameArInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [statusInput, setStatusInput] = useState<'Active' | 'Inactive'>('Active');
  const [notesInput, setNotesInput] = useState('');

  // Category metadata & labels
  const categories = [
    {
      id: 'agents' as ListCategory,
      labelEn: 'Agents & Partners',
      labelAr: 'وكلاء العمرة والشركاء',
      icon: Building2,
      count: agentsList.length,
      itemLabelEn: 'Agent / Partner',
      itemLabelAr: 'وكيل / شريك',
      codePlaceholderEn: 'Code (e.g., AGT-11)',
      secondaryLabelEn: 'Country / Region',
      secondaryLabelAr: 'الدولة / المنطقة',
    },
    {
      id: 'airlines' as ListCategory,
      labelEn: 'Airlines & Carriers',
      labelAr: 'شركات الطيران',
      icon: Plane,
      count: airlinesList.length,
      itemLabelEn: 'Airline',
      itemLabelAr: 'شركة الطيران',
      codePlaceholderEn: 'IATA Code (e.g., SV, XY, GA)',
      secondaryLabelEn: 'Hub / Main City',
      secondaryLabelAr: 'المقر / المحطة الرئيسية',
    },
    {
      id: 'countries' as ListCategory,
      labelEn: 'Countries & Nationalities',
      labelAr: 'الدول والجنسيات',
      icon: Globe2,
      count: countriesList.length,
      itemLabelEn: 'Country',
      itemLabelAr: 'الدولة',
      codePlaceholderEn: 'Country Code (e.g., SA, EG, ID)',
      secondaryLabelEn: 'Region / Continent',
      secondaryLabelAr: 'المنطقة / القارة',
    },
    {
      id: 'branches' as ListCategory,
      labelEn: 'Branches & Hubs',
      labelAr: 'الفروع والمكاتب',
      icon: MapPin,
      count: branchesList.length,
      itemLabelEn: 'Branch / Hub',
      itemLabelAr: 'فرع / مكتب',
      codePlaceholderEn: 'Branch Code (e.g., MKH-01)',
      secondaryLabelEn: 'Location / Address',
      secondaryLabelAr: 'الموقع / العنوان',
    },
    {
      id: 'transport' as ListCategory,
      labelEn: 'Transport Companies',
      labelAr: 'شركات النقل',
      icon: Bus,
      count: transportList.length,
      itemLabelEn: 'Transport Provider',
      itemLabelAr: 'شركة النقل',
      codePlaceholderEn: 'Provider Code (e.g., BUS-01)',
      secondaryLabelEn: 'Fleet Type / Service',
      secondaryLabelAr: 'نوع الأسطول / الخدمة',
    },
    {
      id: 'packages' as ListCategory,
      labelEn: 'Package & Service Types',
      labelAr: 'أنواع الباقات والبرامج',
      icon: Tag,
      count: packagesList.length,
      itemLabelEn: 'Package Type',
      itemLabelAr: 'نوع الباقة',
      codePlaceholderEn: 'Package Code (e.g., PKG-VIP)',
      secondaryLabelEn: 'Category / Tier',
      secondaryLabelAr: 'الفئة / المستوى',
    },
    {
      id: 'airports' as ListCategory,
      labelEn: 'Airports & Gateways',
      labelAr: 'المطارات والمنافذ',
      icon: Navigation,
      count: airportsList.length,
      itemLabelEn: 'Airport / Gateway',
      itemLabelAr: 'المطار / المنفذ',
      codePlaceholderEn: 'IATA Airport Code (e.g., JED, MED)',
      secondaryLabelEn: 'City / Port Location',
      secondaryLabelAr: 'المدينة / موقع المنفذ',
    },
    {
      id: 'room_types' as ListCategory,
      labelEn: 'Room Types & Suites',
      labelAr: 'أنواع الغرف والأجنحة',
      icon: Bed,
      count: roomTypesList.length,
      itemLabelEn: 'Room Type',
      itemLabelAr: 'نوع الغرفة',
      codePlaceholderEn: 'Room Code (e.g., DBL-2, ROY-VIP)',
      secondaryLabelEn: 'Capacity & Specifications',
      secondaryLabelAr: 'السعة والمواصفات',
    },
    {
      id: 'guides' as ListCategory,
      labelEn: 'Trip Guides & Mutawwifs',
      labelAr: 'المرشدين والمطوفين',
      icon: Compass,
      count: guidesList.length,
      itemLabelEn: 'Guide / Mutawwif',
      itemLabelAr: 'المرشد / المطوف',
      codePlaceholderEn: 'Guide Code (e.g., GUD-01)',
      secondaryLabelEn: 'Specialty / Spoken Languages',
      secondaryLabelAr: 'التخصص / اللغات',
    },
    {
      id: 'routes' as ListCategory,
      labelEn: 'Program Name & Routes',
      labelAr: 'برامج ومسارات الرحلات',
      icon: Route,
      count: routesList.length,
      itemLabelEn: 'Program / Route',
      itemLabelAr: 'البرنامج / المسار',
      codePlaceholderEn: 'Route Code (e.g., MKH-MED, JED-MKH)',
      secondaryLabelEn: 'Route Type / Destination',
      secondaryLabelAr: 'نوع المسار / الوجهة',
    },
  ];

  const currentCategoryMeta = categories.find((c) => c.id === activeCategory)!;

  // Active list reference
  const currentList = useMemo(() => {
    switch (activeCategory) {
      case 'agents':
        return agentsList;
      case 'airlines':
        return airlinesList;
      case 'countries':
        return countriesList;
      case 'branches':
        return branchesList;
      case 'transport':
        return transportList;
      case 'packages':
        return packagesList;
      case 'airports':
        return airportsList;
      case 'room_types':
        return roomTypesList;
      case 'guides':
        return guidesList;
      case 'routes':
        return routesList;
    }
  }, [activeCategory, agentsList, airlinesList, countriesList, branchesList, transportList, packagesList, airportsList, roomTypesList, guidesList, routesList]);

  // Set active list helper
  const setCurrentList = (updater: (prev: BaseListItem[]) => BaseListItem[]) => {
    switch (activeCategory) {
      case 'agents':
        setAgentsList(updater);
        break;
      case 'airlines':
        setAirlinesList(updater);
        break;
      case 'countries':
        setCountriesList(updater);
        break;
      case 'branches':
        setBranchesList(updater);
        break;
      case 'transport':
        setTransportList(updater);
        break;
      case 'packages':
        setPackagesList(updater);
        break;
      case 'airports':
        setAirportsList(updater);
        break;
      case 'room_types':
        setRoomTypesList(updater);
        break;
      case 'guides':
        setGuidesList(updater);
        break;
      case 'routes':
        setRoutesList(updater);
        break;
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter(
      (item) =>
        item.nameEn.toLowerCase().includes(q) ||
        item.nameAr.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.secondary && item.secondary.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  // Reset to default helper
  const handleResetToDefault = async () => {
    if (
      window.confirm(
        isRTL
          ? 'هل تريد بالتأكيد استعادة القائمة الافتراضية لهذا القسم؟'
          : 'Are you sure you want to reset this list to the initial defaults?'
      )
    ) {
      try {
        const resetItems = await resetSystemListCategoryApi(activeCategory);
        switch (activeCategory) {
          case 'agents': setAgentsList(resetItems); break;
          case 'airlines': setAirlinesList(resetItems); break;
          case 'countries': setCountriesList(resetItems); break;
          case 'branches': setBranchesList(resetItems); break;
          case 'transport': setTransportList(resetItems); break;
          case 'packages': setPackagesList(resetItems); break;
          case 'airports': setAirportsList(resetItems); break;
          case 'room_types': setRoomTypesList(resetItems); break;
          case 'guides': setGuidesList(resetItems); break;
          case 'routes': setRoutesList(resetItems); break;
        }
      } catch {
        switch (activeCategory) {
          case 'agents': setAgentsList(DEFAULT_AGENTS); break;
          case 'airlines': setAirlinesList(DEFAULT_AIRLINES); break;
          case 'countries': setCountriesList(DEFAULT_COUNTRIES); break;
          case 'branches': setBranchesList(DEFAULT_BRANCHES); break;
          case 'transport': setTransportList(DEFAULT_TRANSPORT); break;
          case 'packages': setPackagesList(DEFAULT_PACKAGES); break;
          case 'airports': setAirportsList(DEFAULT_AIRPORTS); break;
          case 'room_types': setRoomTypesList(DEFAULT_ROOM_TYPES); break;
          case 'guides': setGuidesList(DEFAULT_GUIDES); break;
          case 'routes': setRoutesList(DEFAULT_ROUTES); break;
        }
      }
      window.dispatchEvent(new CustomEvent('umrah_system_lists_updated', { detail: { category: activeCategory } }));
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      setFeedback(isRTL ? 'تمت استعادة القائمة الافتراضية بنجاح' : 'List reset to defaults successfully');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setNameEnInput('');
    setNameArInput('');
    setCodeInput('');
    setSecondaryInput('');
    setStatusInput('Active');
    setNotesInput('');
    setIsAddOpen(true);
  };

  // Submit Add Item
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEnInput.trim() && !nameArInput.trim()) return;

    const payload = {
      nameEn: nameEnInput.trim() || nameArInput.trim(),
      nameAr: nameArInput.trim() || nameEnInput.trim(),
      code: codeInput.trim() || undefined,
      secondary: secondaryInput.trim() || undefined,
      status: statusInput,
      notes: notesInput.trim() || undefined,
    };

    try {
      const created = await createSystemListItemApi(activeCategory, payload);
      setCurrentList((prev) => [created, ...prev]);
    } catch {
      const localNew: BaseListItem = { id: Date.now().toString(), ...payload };
      setCurrentList((prev) => [localNew, ...prev]);
    }

    window.dispatchEvent(new CustomEvent('umrah_system_lists_updated', { detail: { category: activeCategory } }));
    window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));

    setIsAddOpen(false);
    setFeedback(isRTL ? 'تمت إضافة العنصر بنجاح' : 'Item added successfully');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: BaseListItem) => {
    setItemToEdit(item);
    setNameEnInput(item.nameEn);
    setNameArInput(item.nameAr);
    setCodeInput(item.code || '');
    setSecondaryInput(item.secondary || '');
    setStatusInput(item.status);
    setNotesInput(item.notes || '');
    setIsEditOpen(true);
  };

  // Submit Edit Item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;

    const payload = {
      nameEn: nameEnInput.trim(),
      nameAr: nameArInput.trim(),
      code: codeInput.trim() || undefined,
      secondary: secondaryInput.trim() || undefined,
      status: statusInput,
      notes: notesInput.trim() || undefined,
    };

    try {
      await updateSystemListItemApi(activeCategory, itemToEdit.id, payload);
    } catch (err) {
      console.warn('Backend update fallback:', err);
    }

    setCurrentList((prev) =>
      prev.map((it) => (it.id === itemToEdit.id ? { ...it, ...payload } : it))
    );

    window.dispatchEvent(new CustomEvent('umrah_system_lists_updated', { detail: { category: activeCategory } }));
    window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));

    setIsEditOpen(false);
    setItemToEdit(null);
    setFeedback(isRTL ? 'تم تحديث البيانات بنجاح' : 'Item updated successfully');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Toggle Status
  const handleToggleStatus = async (item: BaseListItem) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await toggleSystemListStatusApi(activeCategory, item.id);
    } catch (err) {
      console.warn('Backend toggle fallback:', err);
    }

    setCurrentList((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
    );

    window.dispatchEvent(new CustomEvent('umrah_system_lists_updated', { detail: { category: activeCategory } }));
    window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));

    setFeedback(
      isRTL
        ? `تم تحويل الحالة إلى ${nextStatus === 'Active' ? 'نشط' : 'غير نشط'}`
        : `Status set to ${nextStatus}`
    );
    setTimeout(() => setFeedback(null), 2500);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const id = itemToDelete.id;
      setCurrentList((prev) => prev.filter((it) => it.id !== id));
      setItemToDelete(null);
      setFeedback(isRTL ? 'تم حذف العنصر من القائمة' : 'Item deleted from list');
      setTimeout(() => setFeedback(null), 3000);
      try {
        await deleteSystemListItemApi(activeCategory, id);
      } catch (err) {
        console.warn('Backend delete fallback:', err);
      }

      window.dispatchEvent(new CustomEvent('umrah_system_lists_updated', { detail: { category: activeCategory } }));
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Feedback */}
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Category Pills Navigation */}
      <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer text-center relative ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 shadow-xs font-bold'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-600 border border-slate-200/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-emerald-200/70 text-emerald-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </div>
                <span className="text-xs line-clamp-1">
                  {isRTL ? cat.labelAr : cat.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Toolbar & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRTL
                  ? `بحث في ${currentCategoryMeta.labelAr}...`
                  : `Search in ${currentCategoryMeta.labelEn}...`
              }
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition ${
                isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
          </div>

          {/* Reset Defaults button */}
          <button
            type="button"
            onClick={handleResetToDefault}
            title={isRTL ? 'استعادة القائمة الافتراضية' : 'Reset list to defaults'}
            className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer shadow-2xs text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{isRTL ? 'استعادة الافتراضي' : 'Reset Default'}</span>
          </button>
        </div>

        {/* Add New Item Button */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {isRTL
              ? `إضافة ${currentCategoryMeta.itemLabelAr} جديد`
              : `Add ${currentCategoryMeta.itemLabelEn}`}
          </span>
        </button>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold text-[11px] sm:text-xs">
                <th className="py-3.5 px-4 text-start">{isRTL ? 'الاسم بالعربية' : 'Arabic Name'}</th>
                <th className="py-3.5 px-4 text-start">{isRTL ? 'الاسم بالإنجليزية' : 'English Name'}</th>
                <th className="py-3.5 px-4 text-start">{isRTL ? 'الرمز / الكود' : 'Code / Identifier'}</th>
                <th className="py-3.5 px-4 text-start">
                  {isRTL ? currentCategoryMeta.secondaryLabelAr : currentCategoryMeta.secondaryLabelEn}
                </th>
                <th className="py-3.5 px-4 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-center">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold">
                      {isRTL ? 'لا توجد عناصر مطابقة للبحث في هذه القائمة' : 'No items match your search in this list.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="mt-3 text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'إضافة عنصر جديد الآن' : 'Add new item now'}</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    {/* Arabic Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.nameAr}
                    </td>

                    {/* English Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {item.nameEn}
                    </td>

                    {/* Code */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.code ? (
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          {item.code}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Secondary Details */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div>{item.secondary || '-'}</div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{item.notes}</div>
                      )}
                    </td>

                    {/* Status Badge & Quick Toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        title={isRTL ? 'انقر لتغيير الحالة' : 'Click to toggle status'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition active:scale-95 ${
                          item.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        <span>
                          {item.status === 'Active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold transition cursor-pointer"
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer"
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 flex items-start gap-3">
        <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800">
            {isRTL ? 'الربط التلقائي بالقوائم التشغيلية' : 'System-Wide Reference Synchronization'}
          </span>
          <p className="text-slate-500 leading-relaxed">
            {isRTL
              ? 'تنعكس هذه القوائم تلقائياً في شاشات المجموعات (Groups)، الفنادق، النقل، وإصدار الفواتير والعقود، مما يسهل إدارة الوكلاء وشركات الطيران والنقل بمرونة.'
              : 'Items configured here are referenced throughout the groups manager, hotel allocations, flight arrivals, and invoice contract generation.'}
          </p>
        </div>
      </div>

      {/* MODAL 1: ADD ITEM */}
      {isAddOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL
                    ? `إضافة ${currentCategoryMeta.itemLabelAr} جديد`
                    : `Add New ${currentCategoryMeta.itemLabelEn}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL
                    ? 'أدخل بيانات العنصر الجديد لإدراجه في القوائم المرجعية للنظام'
                    : 'Enter the details to register in the master reference list'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAdd} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-4">
                {/* Arabic Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الاسم بالعربية' : 'Arabic Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: وكالة الصفا للخدمات"
                    value={nameArInput}
                    onChange={(e) => setNameArInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition text-right"
                    dir="rtl"
                  />
                </div>

                {/* English Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الاسم بالإنجليزية' : 'English Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Al-Safa Services Agency"
                    value={nameEnInput}
                    onChange={(e) => setNameEnInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition text-left"
                    dir="ltr"
                  />
                </div>

                {/* Code & Secondary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Code */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'الرمز أو الكود' : 'Code / Identifier'}
                    </label>
                    <input
                      type="text"
                      placeholder={currentCategoryMeta.codePlaceholderEn}
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Secondary Details */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? currentCategoryMeta.secondaryLabelAr : currentCategoryMeta.secondaryLabelEn}
                    </label>
                    <input
                      type="text"
                      placeholder={isRTL ? 'تفاصيل إضافية / تصنيف' : 'Region, category, or hub'}
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Active">{isRTL ? 'نشط (مفعل في القوائم)' : 'Active (Available in system)'}</option>
                    <option value="Inactive">{isRTL ? 'غير نشط (معطل مؤقتاً)' : 'Inactive (Disabled)'}</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'ملاحظات تشغيلية' : 'Notes / Operational Details'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isRTL ? 'ملاحظات اختيارية...' : 'Optional notes...'}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {isRTL ? 'إضافة وحفظ' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ITEM */}
      {isEditOpen && itemToEdit && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL
                    ? `تعديل بيانات ${currentCategoryMeta.itemLabelAr}`
                    : `Edit ${currentCategoryMeta.itemLabelEn}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحديث التسمية أو الكود أو حالة العنصر' : 'Update names, code identifier, or status'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-4">
                {/* Arabic Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الاسم بالعربية' : 'Arabic Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameArInput}
                    onChange={(e) => setNameArInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition text-right"
                    dir="rtl"
                  />
                </div>

                {/* English Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الاسم بالإنجليزية' : 'English Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEnInput}
                    onChange={(e) => setNameEnInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition text-left"
                    dir="ltr"
                  />
                </div>

                {/* Code & Secondary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Code */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'الرمز أو الكود' : 'Code / Identifier'}
                    </label>
                    <input
                      type="text"
                      placeholder={currentCategoryMeta.codePlaceholderEn}
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Secondary Details */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? currentCategoryMeta.secondaryLabelAr : currentCategoryMeta.secondaryLabelEn}
                    </label>
                    <input
                      type="text"
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Active">{isRTL ? 'نشط (مفعل)' : 'Active'}</option>
                    <option value="Inactive">{isRTL ? 'غير نشط' : 'Inactive'}</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'ملاحظات تشغيلية' : 'Notes / Operational Details'}
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {itemToDelete && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setItemToDelete(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                {isRTL ? 'تأكيد حذف العنصر' : 'Delete Item?'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL
                  ? `هل أنت متأكد من رغبتك في حذف "${itemToDelete.nameAr} / ${itemToDelete.nameEn}" من القائمة؟`
                  : `Are you sure you want to remove "${itemToDelete.nameEn}" from the master list?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
