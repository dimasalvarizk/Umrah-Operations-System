import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step1BasicInfoProps {
  groupName: string;
  setGroupName: (val: string) => void;
  groupCode: string;
  setGroupCode: (val: string) => void;
  agreementNumber?: string;
  setAgreementNumber?: (val: string) => void;
  subAgent: string;
  setSubAgent: (val: string) => void;
  mainAgent: string;
  setMainAgent: (val: string) => void;
  pilgrimsCount: number;
  setPilgrimsCount: React.Dispatch<React.SetStateAction<number>>;
  nationality: string;
  setNationality: (val: string) => void;
  packageType?: string;
  setPackageType?: (val: string) => void;
}

export default function Step1BasicInfo({
  groupName,
  setGroupName,
  groupCode,
  setGroupCode,
  agreementNumber = 'AGR-1125900',
  setAgreementNumber,
  subAgent,
  setSubAgent,
  mainAgent,
  setMainAgent,
  pilgrimsCount,
  setPilgrimsCount,
  nationality,
  setNationality,
  packageType = 'باقة كبار الشخصيات التنفيذية (١٤ يوم)',
  setPackageType,
}: Step1BasicInfoProps) {
  const { t, isRTL } = useLanguage();

  // Dynamic Agents list from system master lists
  const availableAgents = useMemo(() => {
    try {
      const saved = localStorage.getItem('system_list_agents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((a: { status: string }) => a.status === 'Active');
        }
      }
    } catch {
      // fallback
    }
    return [
      { nameEn: 'Hasoob Technology Trading - 2067', nameAr: 'حاسوب لتجارة التقنية - 2067' },
      { nameEn: 'ODST Travel and Tourism - 2114', nameAr: 'أودست للسياحة والسفر - 2114' },
      { nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران' },
      { nameEn: 'Noor Al-Iman Intl', nameAr: 'نور الإيمان الدولية' },
      { nameEn: 'Indonesia Travel', nameAr: 'إندونيسيا ترافيل' },
      { nameEn: 'Safa Travel India', nameAr: 'الصفا ترافيل الهند' },
      { nameEn: 'Ankara Tours Agency', nameAr: 'وكالة أنقرة للسياحة' },
    ];
  }, []);

  // Dynamic Sub-Agents list from system master lists & partners
  const availableSubAgents = useMemo(() => {
    const defaultSubAgents = [
      { id: 'sub-1', nameEn: 'Tasheel Tourism', nameAr: 'تسهيل للسياحة' },
      { id: 'sub-2', nameEn: 'Al-Huda Trips', nameAr: 'رحلات الهدى' },
      { id: 'sub-3', nameEn: 'Noor Al-Safa Sub-Agent', nameAr: 'تور الصفا الفرعي' },
      { id: 'sub-4', nameEn: 'Tasheel Turkey', nameAr: 'تسهيل تركيا' },
      { id: 'sub-5', nameEn: 'Tasheel Jakarta', nameAr: 'تسهيل جاكرتا' },
      { id: 'sub-6', nameEn: 'Al-Quds Jordan', nameAr: 'القدس الأردنية' },
      { id: 'sub-7', nameEn: 'Tasheel Karachi', nameAr: 'تسهيل كراتشي' },
      { id: 'sub-8', nameEn: 'Sub-Agent in Egypt', nameAr: 'الوكيل الفرعي بمصر' },
      ...availableAgents,
    ];
    const seen = new Set<string>();
    return defaultSubAgents.filter((item) => {
      const key = item.nameEn.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [availableAgents]);

  // Dynamic Countries list from system master lists
  const availableNationalities = useMemo(() => {
    try {
      const saved = localStorage.getItem('system_list_countries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: { status: string }) => c.status === 'Active');
        }
      }
    } catch {
      // fallback
    }
    return [
      { nameEn: 'Indonesia', nameAr: 'إندونيسيا' },
      { nameEn: 'Pakistan', nameAr: 'باكستان' },
      { nameEn: 'Egypt', nameAr: 'مصر' },
      { nameEn: 'Turkey', nameAr: 'تركيا' },
      { nameEn: 'India', nameAr: 'الهند' },
      { nameEn: 'Jordan', nameAr: 'الأردن' },
      { nameEn: 'Morocco', nameAr: 'المغرب' },
    ];
  }, []);

  // Dynamic Packages list from system master lists
  const availablePackages = useMemo(() => {
    try {
      const saved = localStorage.getItem('system_list_packages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: { status: string }) => p.status === 'Active');
        }
      }
    } catch {
      // fallback
    }
    return [
      { id: '1', nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات التنفيذية (١٤ يوم)', secondary: '5-Star Front Row Hotels' },
      { id: '2', nameEn: 'Premium Gold 12 Days', nameAr: 'الباقة الذهبية المميزة (١٢ يوم)', secondary: '5-Star Walking Distance' },
      { id: '3', nameEn: 'Classic Economy 10 Days', nameAr: 'الباقة الاقتصادية الكلاسيكية (١٠ أيام)', secondary: '4-Star Central Hotels' },
      { id: '4', nameEn: 'Ramadan Last 10 Days Special', nameAr: 'برنامج العشر الأواخر من رمضان', secondary: 'Makkah Clock Towers' },
    ];
  }, []);

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Group Name */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_name', 'اسم المجموعة')}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('groups.group_name_placeholder', 'اسم المجموعة أو الفوج')}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
          />
        </div>

        {/* Group Code (Nusuk Group Number) */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>{isRTL ? 'رقم المجموعة (نظام نسك)' : 'Group Number (Nusuk Code)'}</span>
              <span className="text-red-500">*</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
              {isRTL ? 'رقم نسك' : 'Nusuk Group'}
            </span>
          </label>
          <input
            type="text"
            placeholder={t('groups.group_code_placeholder', '480900XXXXXX / GRP-2401')}
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Row 2: Nusuk Agreement Number & Package Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Agreement Number (Nusuk Integrated) */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>{isRTL ? 'رقم الاتفاقية (نظام نسك / الوزارة)' : 'Agreement Number (Nusuk System)'}</span>
              <span className="text-red-500">*</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
              {isRTL ? 'معتمد في نسك' : 'Nusuk Integrated'}
            </span>
          </label>
          <input
            type="text"
            placeholder={isRTL ? 'مثال: AGR-1125900' : 'e.g. AGR-1125900'}
            value={agreementNumber}
            onChange={(e) => setAgreementNumber && setAgreementNumber(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-bold font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition shadow-2xs"
          />
        </div>

        {/* Umrah Package Tier */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>{isRTL ? 'نوع باقة وبرنامج العمرة' : 'Umrah Package Program'}</span>
              <span className="text-red-500">*</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {isRTL ? 'البرامج' : 'Packages'}
            </span>
          </label>
          <div className="relative">
            <select
              value={packageType}
              onChange={(e) => setPackageType && setPackageType(e.target.value)}
              className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
              }`}
            >
              <option value="">{isRTL ? 'اختر فئة الباقة والبرنامج...' : 'Select package tier...'}</option>
              {availablePackages.map((pkg: any, idx: number) => {
                const label = isRTL ? pkg.nameAr : pkg.nameEn;
                const sub = pkg.secondary ? ` - ${pkg.secondary}` : '';
                return (
                  <option key={pkg.id || idx} value={label}>
                    {label}{sub}
                  </option>
                );
              })}
            </select>
            <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              isRTL ? 'left-3' : 'right-3'
            }`} />
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Sub Agent */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_sub_agent', 'الوكيل الفرعي')}</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={subAgent}
              onChange={(e) => setSubAgent(e.target.value)}
              className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
              }`}
            >
              <option value="">{isRTL ? 'اختر الوكيل الفرعي...' : 'Select sub-agent...'}</option>
              {availableSubAgents.map((agent, idx) => {
                const label = isRTL ? agent.nameAr : agent.nameEn;
                return (
                  <option key={agent.id || idx} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              isRTL ? 'left-3' : 'right-3'
            }`} />
          </div>
        </div>

        {/* Main Agent */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_main_agent', 'الوكيل الرئيسي')}</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={mainAgent}
              onChange={(e) => setMainAgent(e.target.value)}
              className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
              }`}
            >
              <option value="">{t('groups.agent_placeholder', 'اختر الوكيل...')}</option>
              {availableAgents.map((agent, idx) => {
                const label = isRTL ? agent.nameAr : agent.nameEn;
                return (
                  <option key={agent.id || idx} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              isRTL ? 'left-3' : 'right-3'
            }`} />
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pilgrims Count with +/- Stepper */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_pilgrims', 'عدد المعتمرين')}</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            {/* Minus Button */}
            <button
              type="button"
              onClick={() => setPilgrimsCount((prev) => Math.max(1, prev - 1))}
              className="w-11 py-2.5 bg-[#f8fafc] flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold transition cursor-pointer active:bg-slate-200/80"
            >
              -
            </button>

            {/* Number Display */}
            <input
              type="number"
              value={pilgrimsCount}
              onChange={(e) => setPilgrimsCount(Number(e.target.value))}
              className="flex-1 text-center font-bold text-slate-800 text-sm py-2.5 bg-white focus:outline-none"
            />

            {/* Plus Button */}
            <button
              type="button"
              onClick={() => setPilgrimsCount((prev) => prev + 1)}
              className="w-11 py-2.5 bg-[#f8fafc] flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold transition cursor-pointer active:bg-slate-200/80"
            >
              +
            </button>
          </div>
        </div>

        {/* Nationality */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_nationality', 'الجنسية')}</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
              }`}
            >
              <option value="">{isRTL ? 'اختر الجنسية' : 'Select Nationality'}</option>
              {availableNationalities.map((item, idx) => {
                const label = isRTL ? item.nameAr : item.nameEn;
                return (
                  <option key={item.id || idx} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              isRTL ? 'left-3' : 'right-3'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
}
