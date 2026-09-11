import { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, AlertTriangle, Check } from 'lucide-react';
import type { TripItem } from './TripDetailsModal';
import busBadge from '../../assets/bus-badge.png';
import { useLanguage } from '../../context/LanguageContext';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trip: TripItem) => void;
  initialData?: TripItem | null;
}

export const ROUTE_OPTIONS = [
  { ar: 'مكة ← المدينة', en: 'Makkah ➔ Madinah' },
  { ar: 'المدينة ← مكة', en: 'Madinah ➔ Makkah' },
  { ar: 'مطار جدة ← مكة', en: 'Jeddah Airport ➔ Makkah' },
  { ar: 'مكة ← مطار جدة', en: 'Makkah ➔ Jeddah Airport' },
  { ar: 'مكة (الرصيفة) ↔ المدينة', en: 'Makkah (Rusaifah) ↔ Madinah' },
  { ar: 'مكة المكرمة ↔ جبل ثور', en: 'Makkah ↔ Mount Thawr' },
  { ar: 'جاكرتا ← جدة', en: 'Jakarta ➔ Jeddah' },
  { ar: 'جاكرتا ← المدينة', en: 'Jakarta ➔ Madinah' },
  { ar: 'جدة ← جاكرتا', en: 'Jeddah ➔ Jakarta' },
  { ar: 'المدينة ← جاكرتا', en: 'Madinah ➔ Jakarta' },
];

export const NATIONALITY_OPTIONS = [
  { ar: 'السعودية', en: 'Saudi Arabia' },
  { ar: 'المغرب', en: 'Morocco' },
  { ar: 'إندونيسيا', en: 'Indonesia' },
  { ar: 'مصر', en: 'Egypt' },
  { ar: 'باكستان', en: 'Pakistan' },
  { ar: 'تركيا', en: 'Turkey' },
  { ar: 'الجزائر', en: 'Algeria' },
  { ar: 'الهند', en: 'India' },
  { ar: 'ماليزيا', en: 'Malaysia' },
];

export const TRANSPORT_COMPANIES = [
  {
    id: '1',
    nameAr: 'نقل الحرمين السريع',
    nameEn: 'Haramain Express Transport',
    vehicleTypeAr: 'حافلات نقل حجاج ومعتمرين 50 راكب',
    vehicleTypeEn: '50-Seater Pilgrim Mass Buses',
    driverNameAr: 'محمد العمري',
    driverNameEn: 'Mohammed Al-Omari',
    phone: '+966 50 123 4567',
    busNumber: 'BUS-101',
  },
  {
    id: '2',
    nameAr: 'شركة الراجحي للنقل',
    nameEn: 'Al Rajhi Transport',
    vehicleTypeAr: 'فانات سياحية مجهزة وحافلات VIP',
    vehicleTypeEn: 'Equipped Tourist Vans & VIP Buses',
    driverNameAr: 'سالم الدوسري',
    driverNameEn: 'Salem Al-Dossari',
    phone: '+966 50 234 5678',
    busNumber: 'RAJ-204',
  },
  {
    id: '3',
    nameAr: 'الليموزين السعودي',
    nameEn: 'Saudi Limousine',
    vehicleTypeAr: 'سيارات ليموزين VIP وفانات نقل فندقي',
    vehicleTypeEn: 'VIP Limousines & Hotel Shuttles',
    driverNameAr: 'عبد الله الشهري',
    driverNameEn: 'Abdullah Al-Shehri',
    phone: '+966 50 345 6789',
    busNumber: 'LIM-505',
  },
  {
    id: '4',
    nameAr: 'سابتكو (SAPTCO)',
    nameEn: 'SAPTCO',
    vehicleTypeAr: 'أسطول متكامل: حافلات وفانات وليموزين',
    vehicleTypeEn: 'Integrated Fleet: Buses, Vans & Limos',
    driverNameAr: 'إبراهيم الحربي',
    driverNameEn: 'Ibrahim Al-Harbi',
    phone: '+966 50 456 7890',
    busNumber: 'SAP-770',
  },
  {
    id: '5',
    nameAr: 'هلا للنقل',
    nameEn: 'Hala Transport',
    vehicleTypeAr: 'حافلات سياحية وفانات نقل جماعي',
    vehicleTypeEn: 'Tourist Coaches & Group Vans',
    driverNameAr: 'خالد الغامدي',
    driverNameEn: 'Khaled Al-Ghamdi',
    phone: '+966 50 567 8901',
    busNumber: 'HAL-330',
  },
  {
    id: '6',
    nameAr: 'النقل المكي المتميز',
    nameEn: 'Al Makkiyah Transport',
    vehicleTypeAr: 'فانات عائلية ومركبات تفويج بالمطار',
    vehicleTypeEn: 'Family Vans & Airport Transfers',
    driverNameAr: 'ماجد القحطاني',
    driverNameEn: 'Majid Al-Qahtani',
    phone: '+966 50 678 9012',
    busNumber: 'MAK-880',
  },
  {
    id: '7',
    nameAr: 'شركة تواصل للنقل',
    nameEn: 'Tawasul Transport',
    vehicleTypeAr: 'فانات نقل معتمرين وحافلات كوستر',
    vehicleTypeEn: 'Pilgrim Vans & Coaster Buses',
    driverNameAr: 'ياسر المالكي',
    driverNameEn: 'Yasser Al-Malki',
    phone: '+966 50 789 0123',
    busNumber: 'TAW-412',
  },
  {
    id: '8',
    nameAr: 'المدينة السريعة للنقل',
    nameEn: 'Al Madinah Express',
    vehicleTypeAr: 'سيارات سيدان فندقية وفانات نقل سريع',
    vehicleTypeEn: 'Hotel Sedans & Rapid Vans',
    driverNameAr: 'عادل السلمي',
    driverNameEn: 'Adel Al-Sulami',
    phone: '+966 50 890 1234',
    busNumber: 'MAD-909',
  },
  {
    id: '9',
    nameAr: 'الشركة الملكية للنقل',
    nameEn: 'Royal Transport Co.',
    vehicleTypeAr: 'حافلات فاخرة لكبار ضيوف الرحمن VIP',
    vehicleTypeEn: 'Luxury VIP Pilgrim Transporters',
    driverNameAr: 'طارق الزهراني',
    driverNameEn: 'Tariq Al-Zahrani',
    phone: '+966 50 901 2345',
    busNumber: 'ROY-001',
  },
];

export default function AddTripModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddTripModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Helper to normalize route between languages or fallback
  const normalizeRoute = (val: string, rtl: boolean) => {
    if (!val) return rtl ? 'مكة ← المدينة' : 'Makkah ➔ Madinah';
    const found = ROUTE_OPTIONS.find((r) => r.ar === val || r.en === val);
    if (found) return rtl ? found.ar : found.en;
    return val;
  };

  // Section 1: Basic Info
  const [programName, setProgramName] = useState('');
  const [code, setCode] = useState('TRP-9402');
  const [routePath, setRoutePath] = useState('مكة ← المدينة');
  const [programType, setProgramType] = useState('برنامج اقتصادي');

  // Section 2: Dates & Duration
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedDuration, setExpectedDuration] = useState('14 Nights');

  // Section 3: Pilgrims & Guide
  const [pilgrimsCount, setPilgrimsCount] = useState<string>('');
  const [guideName, setGuideName] = useState('');
  const [dominantNationality, setDominantNationality] = useState('السعودية');

  // Section 4: Transport
  const [transportCompany, setTransportCompany] = useState('نقل الحرمين السريع');
  const [transportType, setTransportType] = useState('حافلات نقل حجاج ومعتمرين 50 راكب');
  const [busNumber, setBusNumber] = useState('BUS-101');
  const [driverName, setDriverName] = useState('محمد العمري');
  const [driverPhone, setDriverPhone] = useState('+966 50 123 4567');

  const handleCompanyChange = (companyName: string) => {
    setTransportCompany(companyName);
    const matched = TRANSPORT_COMPANIES.find(
      (c) => c.nameAr === companyName || c.nameEn === companyName
    );
    if (matched) {
      setTransportType(isRTL ? matched.vehicleTypeAr : matched.vehicleTypeEn);
      setDriverName(isRTL ? matched.driverNameAr : matched.driverNameEn);
      setDriverPhone(matched.phone);
      setBusNumber(matched.busNumber);
    }
  };

  useEffect(() => {
    if (initialData) {
      setProgramName(initialData.programName || initialData.routeName);
      setCode(initialData.code);
      const initialRoute = initialData.routePath || initialData.routeName || '';
      setRoutePath(normalizeRoute(initialRoute, isRTL));
      setProgramType(initialData.programType || 'برنامج اقتصادي');
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setExpectedDuration(initialData.expectedDuration || (isRTL ? '١٤ ليلة' : '14 Nights'));
      setPilgrimsCount(String(initialData.pilgrimsCount || ''));
      setGuideName(initialData.guideName);
      setDominantNationality(initialData.dominantNationality || (isRTL ? 'السعودية' : 'Saudi Arabia'));
      setTransportCompany(initialData.transportCompany || (isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Transport'));
      setTransportType(initialData.transportType || (isRTL ? 'حافلات نقل حجاج ومعتمرين 50 راكب' : '50-Seater Pilgrim Mass Buses'));
      setBusNumber(initialData.busNumber || 'BUS-101');
      setDriverName(initialData.driverName || (isRTL ? 'محمد العمري' : 'Mohammed Al-Omari'));
      setDriverPhone(initialData.driverPhone || '+966 50 123 4567');
    } else {
      setProgramName('');
      setCode(`TRP-${Math.floor(1000 + Math.random() * 9000)}`);
      setRoutePath(isRTL ? 'مكة ← المدينة' : 'Makkah ➔ Madinah');
      setProgramType(isRTL ? 'برنامج اقتصادي' : 'Economy Package');
      setStartDate('');
      setEndDate('');
      setExpectedDuration(isRTL ? '١٤ ليلة' : '14 Nights');
      setPilgrimsCount('');
      setGuideName('');
      setDominantNationality(isRTL ? 'السعودية' : 'Saudi Arabia');
      setTransportCompany(isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Transport');
      setTransportType(isRTL ? 'حافلات نقل حجاج ومعتمرين 50 راكب' : '50-Seater Pilgrim Mass Buses');
      setBusNumber('BUS-101');
      setDriverName(isRTL ? 'محمد العمري' : 'Mohammed Al-Omari');
      setDriverPhone('+966 50 123 4567');
    }
  }, [initialData, isOpen, isRTL]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const cleanCode = code.replace(/\s*\(.*?\)/, '') || `TRP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrip: TripItem = {
      id: initialData?.id || String(Date.now()),
      code: cleanCode,
      routeName: routePath,
      programName: programName || routePath,
      routePath,
      programType,
      startDate: startDate || '01 ذو الحجة',
      endDate: endDate || '15 ذو الحجة',
      expectedDuration,
      pilgrimsCount: Number(pilgrimsCount) || 120,
      guideName: guideName || (isRTL ? 'يوسف مكي' : 'Youssef Makki'),
      dominantNationality,
      status: initialData?.status || 'قيد التنفيذ',
      transportCompany,
      transportType,
      busNumber,
      driverName,
      driverPhone,
    };

    onSuccess(newTrip);
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[95vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {initialData ? (isRTL ? 'تعديل بيانات الرحلة' : 'Edit Trip Details') : t('trips.add_trip', 'إضافة رحلة جديدة')}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 flex flex-col justify-between">
          <div className="bg-[#f8fafc] border-b border-slate-200/80 px-6 sm:px-8 py-6 space-y-6">
            {/* SECTION 1: Basic info */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '١. معلومات الرحلة الأساسية' : '1. Basic Trip Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'اسم البرنامج' : 'Program Name'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder={isRTL ? 'أدخل اسم البرنامج هنا...' : 'e.g. Makkah to Madinah VIP Express'}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.trip_code', 'رقم الرحلة')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#00c48c] font-bold font-mono focus:outline-none shadow-2xs cursor-default"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.route', 'المسار')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={routePath}
                      onChange={(e) => setRoutePath(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      {ROUTE_OPTIONS.map((opt) => (
                        <option key={opt.ar} value={isRTL ? opt.ar : opt.en}>
                          {isRTL ? opt.ar : opt.en}
                        </option>
                      ))}
                      {!ROUTE_OPTIONS.some((r) => r.ar === routePath || r.en === routePath) && routePath && (
                        <option value={routePath}>{routePath}</option>
                      )}
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'نوع البرنامج' : 'Program Type'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="برنامج اقتصادي">{isRTL ? 'برنامج اقتصادي' : 'Economy Package'}</option>
                      <option value="برنامج VIP فاخر">{isRTL ? 'برنامج VIP فاخر' : 'VIP Luxury Package'}</option>
                      <option value="برنامج مميز">{isRTL ? 'برنامج مميز' : 'Premium Package'}</option>
                      <option value="برنامج مخصص">{isRTL ? 'برنامج مخصص' : 'Custom Delegation'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Dates & Duration */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '٢. التواريخ والمدة' : '2. Dates & Schedule'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'تاريخ البدء' : 'Start Date'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder={isRTL ? 'اليوم/الشهر/السنة' : 'DD/MM/YYYY'}
                      className={`w-full bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs ${
                        isRTL ? 'pr-4 pl-10 text-right' : 'pl-4 pr-10 text-left'
                      }`}
                    />
                    <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'تاريخ الانتهاء' : 'End Date'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder={isRTL ? 'اليوم/الشهر/السنة' : 'DD/MM/YYYY'}
                      className={`w-full bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs ${
                        isRTL ? 'pr-4 pl-10 text-right' : 'pl-4 pr-10 text-left'
                      }`}
                    />
                    <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'المدة المتوقعة' : 'Est. Duration'}
                  </label>
                  <input
                    type="text"
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(e.target.value)}
                    placeholder={isRTL ? '١٤ ليلة' : '14 Nights'}
                    className="w-full bg-transparent border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-400 focus:outline-none shadow-2xs cursor-default"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Pilgrims & Guide */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '٣. تفاصيل الحجاج والمرشد' : '3. Pilgrims & Guide Info'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('groups.col_pilgrims', 'عدد المعتمرين')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    value={pilgrimsCount}
                    onChange={(e) => setPilgrimsCount(e.target.value)}
                    placeholder="120"
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.guide_name', 'مرشد الرحلة')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="">{isRTL ? 'ابحث عن مرشد...' : 'Select Guide...'}</option>
                      <option value={isRTL ? 'يوسف مكي' : 'Youssef Makki'}>{isRTL ? 'يوسف مكي' : 'Youssef Makki'}</option>
                      <option value={isRTL ? 'عبد الرحمن صابر' : 'Abdulrahman Saber'}>{isRTL ? 'عبد الرحمن صابر' : 'Abdulrahman Saber'}</option>
                      <option value={isRTL ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}>{isRTL ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}</option>
                      <option value={isRTL ? 'فيصل الحربي' : 'Faisal Al-Harbi'}>{isRTL ? 'فيصل الحربي' : 'Faisal Al-Harbi'}</option>
                      <option value={isRTL ? 'جمال مصطفى' : 'Jamal Mustafa'}>{isRTL ? 'جمال مصطفى' : 'Jamal Mustafa'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'الجنسية الغالبة' : 'Primary Nationality'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={dominantNationality}
                      onChange={(e) => setDominantNationality(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      {NATIONALITY_OPTIONS.map((nat) => (
                        <option key={nat.ar} value={isRTL ? nat.ar : nat.en}>
                          {isRTL ? nat.ar : nat.en}
                        </option>
                      ))}
                      {!NATIONALITY_OPTIONS.some((n) => n.ar === dominantNationality || n.en === dominantNationality) && dominantNationality && (
                        <option value={dominantNationality}>{dominantNationality}</option>
                      )}
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Transportation */}
          <div className="bg-white px-6 sm:px-8 py-5 space-y-4 flex-1">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#0f172a]">
              <img
                src={busBadge}
                alt="Transportation"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg shrink-0"
              />
              <span>{t('transport.title', 'شركات النقل والأسطول')}</span>
            </div>

            {/* Select Transportation Company */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('trips.transport_company', isRTL ? 'شركة النقل' : 'Transportation Company')} <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={transportCompany}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className={`w-full appearance-none bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                    isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                  }`}
                >
                  <option value="">{t('trips.select_company', isRTL ? 'اختر شركة النقل...' : 'Select Transportation Company...')}</option>
                  {TRANSPORT_COMPANIES.map((comp) => (
                    <option key={comp.id} value={isRTL ? comp.nameAr : comp.nameEn}>
                      {isRTL ? comp.nameAr : comp.nameEn}
                    </option>
                  ))}
                  {!TRANSPORT_COMPANIES.some((c) => c.nameAr === transportCompany || c.nameEn === transportCompany) && transportCompany && (
                    <option value={transportCompany}>{transportCompany}</option>
                  )}
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.vehicle_type', 'نوع المركبة')}</span>
                  <input
                    type="text"
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none flex-1 mx-3"
                  />
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.plate_number', 'رقم اللوحة / الحافلة')}</span>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="text-xs sm:text-sm font-bold text-slate-800 font-mono bg-transparent focus:outline-none flex-1 mx-3"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_name', 'اسم السائق')}</span>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none flex-1 mx-3"
                />
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_phone', 'هاتف السائق')}</span>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  dir="ltr"
                  className="text-xs sm:text-sm font-bold text-slate-800 font-mono bg-transparent focus:outline-none flex-1 mx-3"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs"
            >
              {t('common.cancel', 'إلغاء')}
            </button>

            <button
              type="submit"
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-[0.99]"
            >
              {initialData ? t('common.save', 'حفظ التعديلات') : t('trips.add_trip', 'حفظ وإدراج الرحلة')}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b] stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'هل أنت متأكد؟' : 'Are you sure?'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'هل تريد حفظ التعديلات؟' : 'Do you want to commit these changes?'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full pt-3">
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، حفظ' : 'Yes, Save'}
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#cbf7df]/80 mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-[#00c48c] stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('common.success', 'تم بنجاح!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'تم حفظ التعديلات بنجاح' : 'Trip details have been saved successfully.'}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {isRTL ? 'حسناً' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
