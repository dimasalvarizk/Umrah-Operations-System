import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step1BasicInfoProps {
  groupName: string;
  setGroupName: (val: string) => void;
  groupCode: string;
  setGroupCode: (val: string) => void;
  subAgent: string;
  setSubAgent: (val: string) => void;
  mainAgent: string;
  setMainAgent: (val: string) => void;
  pilgrimsCount: number;
  setPilgrimsCount: React.Dispatch<React.SetStateAction<number>>;
  nationality: string;
  setNationality: (val: string) => void;
}

export default function Step1BasicInfo({
  groupName,
  setGroupName,
  groupCode,
  setGroupCode,
  subAgent,
  setSubAgent,
  mainAgent,
  setMainAgent,
  pilgrimsCount,
  setPilgrimsCount,
  nationality,
  setNationality,
}: Step1BasicInfoProps) {
  const { t, isRTL } = useLanguage();

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

        {/* Group Code */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
            <span>{t('groups.col_code', 'رقم المجموعة')}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('groups.group_code_placeholder', 'GRP-2401')}
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
          />
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
          <input
            type="text"
            placeholder={isRTL ? 'مثال: شركة تسهيل' : 'e.g. Tasheel Tours'}
            value={subAgent}
            onChange={(e) => setSubAgent(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
          />
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
              <option value={isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067'}>
                {isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067'}
              </option>
              <option value={isRTL ? 'أودست للسياحة والسفر - 2114' : 'ODST Travel and Tourism - 2114'}>
                {isRTL ? 'أودست للسياحة والسفر - 2114' : 'ODST Travel and Tourism - 2114'}
              </option>
              <option value={isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'}>{isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'}</option>
              <option value={isRTL ? 'نور الإيمان الدولية' : 'Noor Al-Iman Intl'}>{isRTL ? 'نور الإيمان الدولية' : 'Noor Al-Iman Intl'}</option>
              <option value={isRTL ? 'إندونيسيا ترافيل' : 'Indonesia Travel'}>{isRTL ? 'إندونيسيا ترافيل' : 'Indonesia Travel'}</option>
              <option value={isRTL ? 'الصفا ترافيل الهند' : 'Safa Travel India'}>{isRTL ? 'الصفا ترافيل الهند' : 'Safa Travel India'}</option>
              <option value={isRTL ? 'وكالة أنقرة للسياحة' : 'Ankara Tours Agency'}>{isRTL ? 'وكالة أنقرة للسياحة' : 'Ankara Tours Agency'}</option>
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
              <option value={isRTL ? 'إندونيسيا' : 'Indonesia'}>{isRTL ? 'إندونيسيا' : 'Indonesia'}</option>
              <option value={isRTL ? 'باكستان' : 'Pakistan'}>{isRTL ? 'باكستان' : 'Pakistan'}</option>
              <option value={isRTL ? 'مصر' : 'Egypt'}>{isRTL ? 'مصر' : 'Egypt'}</option>
              <option value={isRTL ? 'تركيا' : 'Turkey'}>{isRTL ? 'تركيا' : 'Turkey'}</option>
              <option value={isRTL ? 'الهند' : 'India'}>{isRTL ? 'الهند' : 'India'}</option>
              <option value={isRTL ? 'الأردن' : 'Jordan'}>{isRTL ? 'الأردن' : 'Jordan'}</option>
              <option value={isRTL ? 'المغرب' : 'Morocco'}>{isRTL ? 'المغرب' : 'Morocco'}</option>
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
