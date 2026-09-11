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
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type ListCategory =
  | 'agents'
  | 'airlines'
  | 'countries'
  | 'branches'
  | 'transport'
  | 'packages';

export interface BaseListItem {
  id: string;
  nameEn: string;
  nameAr: string;
  code?: string;
  secondary?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

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

  // Save to localStorage whenever modified
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
      itemLabelEn: 'Country / Nationality',
      itemLabelAr: 'الدولة / الجنسية',
      codePlaceholderEn: 'ISO & Dial Code (e.g., ID +62)',
      secondaryLabelEn: 'Region / Continent',
      secondaryLabelAr: 'الإقليم / القارة',
    },
    {
      id: 'branches' as ListCategory,
      labelEn: 'Branches & Hubs',
      labelAr: 'الفروع والمراكز التشغيلية',
      icon: MapPin,
      count: branchesList.length,
      itemLabelEn: 'Branch / Hub',
      itemLabelAr: 'الفرع / المركز',
      codePlaceholderEn: 'Branch Code (e.g., MKH-01)',
      secondaryLabelEn: 'Address / Location',
      secondaryLabelAr: 'الموقع / العنوان',
    },
    {
      id: 'transport' as ListCategory,
      labelEn: 'Transport Companies',
      labelAr: 'شركات النقل والحافلات',
      icon: Bus,
      count: transportList.length,
      itemLabelEn: 'Transport Company',
      itemLabelAr: 'شركة النقل',
      codePlaceholderEn: 'Company Code (e.g., BUS-05)',
      secondaryLabelEn: 'Vehicle Specs / Fleet Type',
      secondaryLabelAr: 'نوع الأسطول والخدمة',
    },
    {
      id: 'packages' as ListCategory,
      labelEn: 'Package & Service Types',
      labelAr: 'باقات وبرامج العمرة',
      icon: Tag,
      count: packagesList.length,
      itemLabelEn: 'Package Tier',
      itemLabelAr: 'نوع البرنامج / الباقة',
      codePlaceholderEn: 'Package Code (e.g., PKG-VIP)',
      secondaryLabelEn: 'Hotel Tier / Highlights',
      secondaryLabelAr: 'تصنيف الفنادق والمزايا',
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
    }
  }, [activeCategory, agentsList, airlinesList, countriesList, branchesList, transportList, packagesList]);

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
  const handleResetToDefault = () => {
    if (
      window.confirm(
        isRTL
          ? 'هل تريد بالتأكيد استعادة القائمة الافتراضية لهذا القسم؟'
          : 'Are you sure you want to reset this list to the initial defaults?'
      )
    ) {
      switch (activeCategory) {
        case 'agents':
          setAgentsList(DEFAULT_AGENTS);
          break;
        case 'airlines':
          setAirlinesList(DEFAULT_AIRLINES);
          break;
        case 'countries':
          setCountriesList(DEFAULT_COUNTRIES);
          break;
        case 'branches':
          setBranchesList(DEFAULT_BRANCHES);
          break;
        case 'transport':
          setTransportList(DEFAULT_TRANSPORT);
          break;
        case 'packages':
          setPackagesList(DEFAULT_PACKAGES);
          break;
      }
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
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEnInput.trim() && !nameArInput.trim()) return;

    const newItem: BaseListItem = {
      id: Date.now().toString(),
      nameEn: nameEnInput.trim() || nameArInput.trim(),
      nameAr: nameArInput.trim() || nameEnInput.trim(),
      code: codeInput.trim() || undefined,
      secondary: secondaryInput.trim() || undefined,
      status: statusInput,
      notes: notesInput.trim() || undefined,
    };

    setCurrentList((prev) => [newItem, ...prev]);
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
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;

    setCurrentList((prev) =>
      prev.map((it) =>
        it.id === itemToEdit.id
          ? {
              ...it,
              nameEn: nameEnInput.trim(),
              nameAr: nameArInput.trim(),
              code: codeInput.trim() || undefined,
              secondary: secondaryInput.trim() || undefined,
              status: statusInput,
              notes: notesInput.trim() || undefined,
            }
          : it
      )
    );
    setIsEditOpen(false);
    setItemToEdit(null);
    setFeedback(isRTL ? 'تم تحديث البيانات بنجاح' : 'Item updated successfully');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Toggle Status
  const handleToggleStatus = (item: BaseListItem) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setCurrentList((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
    );
    setFeedback(
      isRTL
        ? `تم تحويل الحالة إلى ${nextStatus === 'Active' ? 'نشط' : 'غير نشط'}`
        : `Status set to ${nextStatus}`
    );
    setTimeout(() => setFeedback(null), 2500);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setCurrentList((prev) => prev.filter((it) => it.id !== itemToDelete.id));
      setItemToDelete(null);
      setFeedback(isRTL ? 'تم حذف العنصر من القائمة' : 'Item deleted from list');
      setTimeout(() => setFeedback(null), 3000);
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
