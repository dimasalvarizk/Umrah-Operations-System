import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { getSystemListsApi, type BaseListItem } from '../../../services/settingsApi';

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
  agreementNumber = '',
  setAgreementNumber,
  subAgent,
  setSubAgent,
  mainAgent,
  setMainAgent,
  pilgrimsCount,
  setPilgrimsCount,
  nationality,
  setNationality,
  packageType = '',
  setPackageType,
}: Step1BasicInfoProps) {
  const { t, isRTL } = useLanguage();

  const [agentsList, setAgentsList] = useState<BaseListItem[]>([]);
  const [countriesList, setCountriesList] = useState<BaseListItem[]>([]);
  const [packagesList, setPackagesList] = useState<BaseListItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadMasterLists() {
      try {
        const [agents, countries, packages] = await Promise.all([
          getSystemListsApi('agents').catch(() => []),
          getSystemListsApi('countries').catch(() => []),
          getSystemListsApi('packages').catch(() => []),
        ]);
        if (isMounted) {
          setAgentsList(agents.filter((a) => a.status === 'Active'));
          setCountriesList(countries.filter((c) => c.status === 'Active'));
          setPackagesList(packages.filter((p) => p.status === 'Active'));
        }
      } catch (err) {
        console.error('Failed to load system master lists for Step 1:', err);
      }
    }
    loadMasterLists();

    const handleSystemListUpdate = () => {
      loadMasterLists();
    };
    window.addEventListener('umrah_system_lists_updated', handleSystemListUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('umrah_system_lists_updated', handleSystemListUpdate);
    };
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
              {packagesList.map((pkg: BaseListItem) => {
                const label = isRTL ? pkg.nameAr : pkg.nameEn;
                const sub = pkg.secondary ? ` - ${pkg.secondary}` : '';
                return (
                  <option key={pkg.id} value={label}>
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

      {/* Row 3 */}
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
              {agentsList.map((agent) => {
                const label = isRTL ? agent.nameAr : agent.nameEn;
                return (
                  <option key={agent.id} value={label}>
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
              {agentsList.map((agent) => {
                const label = isRTL ? agent.nameAr : agent.nameEn;
                return (
                  <option key={agent.id} value={label}>
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

      {/* Row 4 */}
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
              onClick={() => setPilgrimsCount((prev) => Math.max(1, (prev || 1) - 1))}
              className="w-11 py-2.5 bg-[#f8fafc] flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold transition cursor-pointer active:bg-slate-200/80"
            >
              -
            </button>

            {/* Number Display */}
            <input
              type="number"
              min={1}
              value={pilgrimsCount || ''}
              placeholder="0"
              onChange={(e) => setPilgrimsCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 text-center font-bold text-slate-800 text-sm py-2.5 bg-white focus:outline-none"
            />

            {/* Plus Button */}
            <button
              type="button"
              onClick={() => setPilgrimsCount((prev) => (prev || 0) + 1)}
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
              {countriesList.map((item) => {
                const label = isRTL ? item.nameAr : item.nameEn;
                return (
                  <option key={item.id} value={label}>
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
