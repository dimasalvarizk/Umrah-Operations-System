import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step4PermitsNotesProps {
  arrivalGrouping: string;
  setArrivalGrouping: (val: string) => void;
  interCityGrouping: string;
  setInterCityGrouping: (val: string) => void;
  departureGrouping: string;
  setDepartureGrouping: (val: string) => void;
  makkahZiyarat: string;
  setMakkahZiyarat: (val: string) => void;
  madinahZiyarat: string;
  setMadinahZiyarat: (val: string) => void;
  umrahPermitStatus: string;
  setUmrahPermitStatus: (val: string) => void;
  rawdahMenPermitStatus: string;
  setRawdahMenPermitStatus: (val: string) => void;
  rawdahWomenPermitStatus: string;
  setRawdahWomenPermitStatus: (val: string) => void;
  enrichmentProgram: string;
  setEnrichmentProgram: (val: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (val: string) => void;
  missingRequirements: string;
  setMissingRequirements: (val: string) => void;
}

export default function Step4PermitsNotes({
  arrivalGrouping,
  setArrivalGrouping,
  interCityGrouping,
  setInterCityGrouping,
  departureGrouping,
  setDepartureGrouping,
  makkahZiyarat,
  setMakkahZiyarat,
  madinahZiyarat,
  setMadinahZiyarat,
  umrahPermitStatus,
  setUmrahPermitStatus,
  rawdahMenPermitStatus,
  setRawdahMenPermitStatus,
  rawdahWomenPermitStatus,
  setRawdahWomenPermitStatus,
  enrichmentProgram,
  setEnrichmentProgram,
  additionalNotes,
  setAdditionalNotes,
  missingRequirements,
  setMissingRequirements,
}: Step4PermitsNotesProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Section 1: Grouping & Movements */}
      <div>
        <h3 className="text-sm font-bold text-slate-900">
          {isRTL ? 'التنقلات والتفويج' : 'Grouping & Movement Logistics'}
        </h3>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Arrival Grouping */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'تفويج الوصول' : 'Arrival Grouping'}
            </label>
            <div className="relative">
              <select
                value={arrivalGrouping}
                onChange={(e) => setArrivalGrouping(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="مكتمل">{t('common.completed', 'مكتمل')}</option>
                <option value="معلق">{t('common.pending', 'معلق')}</option>
                <option value="قيد التنفيذ">{t('common.in_progress', 'قيد التنفيذ')}</option>
                <option value="لا يوجد">{isRTL ? 'لا يوجد' : 'None'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Inter-City Grouping */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping'}
            </label>
            <div className="relative">
              <select
                value={interCityGrouping}
                onChange={(e) => setInterCityGrouping(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="معلق">{t('common.pending', 'معلق')}</option>
                <option value="مكتمل">{t('common.completed', 'مكتمل')}</option>
                <option value="قيد التنفيذ">{t('common.in_progress', 'قيد التنفيذ')}</option>
                <option value="لا يوجد">{isRTL ? 'لا يوجد' : 'None'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Departure Grouping */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'تفويج المغادرة' : 'Departure Grouping'}
            </label>
            <div className="relative">
              <select
                value={departureGrouping}
                onChange={(e) => setDepartureGrouping(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="لا يوجد">{isRTL ? 'لا يوجد' : 'None'}</option>
                <option value="مكتمل">{t('common.completed', 'مكتمل')}</option>
                <option value="معلق">{t('common.pending', 'معلق')}</option>
                <option value="قيد التنفيذ">{t('common.in_progress', 'قيد التنفيذ')}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>
        </div>

        {/* Row 2: Ziyarat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'مزارات مكة' : 'Makkah Ziyarat Places'}
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل المزارات المطلوبة بمكة' : 'e.g. Cave of Hira, Mount Thawr'}
              value={makkahZiyarat}
              onChange={(e) => setMakkahZiyarat(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'مزارات المدينة' : 'Madinah Ziyarat Places'}
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل المزارات المطلوبة بالمدينة' : 'e.g. Quba Mosque, Mount Uhud'}
              value={madinahZiyarat}
              onChange={(e) => setMadinahZiyarat(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Permits */}
      <div className="pt-1">
        <h3 className="text-sm font-bold text-slate-900">
          {isRTL ? 'التصاريح والمسار الإلكتروني' : 'Official Permits & Masar'}
        </h3>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Umrah Permit */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {t('groups.umrah_permit', 'تصريح عمرة')}
            </label>
            <div className="relative">
              <select
                value={umrahPermitStatus}
                onChange={(e) => setUmrahPermitStatus(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-6 pl-9 text-right' : 'pl-6 pr-9 text-left'
                }`}
              >
                <option value="مقبول">{isRTL ? 'مقبول' : 'Approved'}</option>
                <option value="قيد المراجعة">{isRTL ? 'قيد المراجعة' : 'In Review'}</option>
                <option value="لم يقدم">{isRTL ? 'لم يقدم' : 'Not Submitted'}</option>
                <option value="مرفوض">{isRTL ? 'مرفوض' : 'Rejected'}</option>
              </select>
              <span className={`w-2 h-2 rounded-full bg-[#10b981] absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-2.5' : 'left-2.5'
              }`} />
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Rawdah Men */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {t('groups.rawdah_men', 'تصاريح الروضة - رجال')}
            </label>
            <div className="relative">
              <select
                value={rawdahMenPermitStatus}
                onChange={(e) => setRawdahMenPermitStatus(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-6 pl-9 text-right' : 'pl-6 pr-9 text-left'
                }`}
              >
                <option value="قيد المراجعة">{isRTL ? 'قيد المراجعة' : 'In Review'}</option>
                <option value="مقبول">{isRTL ? 'مقبول' : 'Approved'}</option>
                <option value="لم يقدم">{isRTL ? 'لم يقدم' : 'Not Submitted'}</option>
                <option value="مرفوض">{isRTL ? 'مرفوض' : 'Rejected'}</option>
              </select>
              <span className={`w-2 h-2 rounded-full bg-[#f59e0b] absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-2.5' : 'left-2.5'
              }`} />
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Rawdah Women */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-slate-600 block">
              {t('groups.rawdah_women', 'تصاريح الروضة - نساء')}
            </label>
            <div className="relative">
              <select
                value={rawdahWomenPermitStatus}
                onChange={(e) => setRawdahWomenPermitStatus(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-6 pl-9 text-right' : 'pl-6 pr-9 text-left'
                }`}
              >
                <option value="لم يقدم">{isRTL ? 'لم يقدم' : 'Not Submitted'}</option>
                <option value="مقبول">{isRTL ? 'مقبول' : 'Approved'}</option>
                <option value="قيد المراجعة">{isRTL ? 'قيد المراجعة' : 'In Review'}</option>
                <option value="مرفوض">{isRTL ? 'مرفوض' : 'Rejected'}</option>
              </select>
              <span className={`w-2 h-2 rounded-full bg-[#94a3b8] absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-2.5' : 'left-2.5'
              }`} />
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Notes & Requirements */}
      <div className="pt-1">
        <h3 className="text-sm font-bold text-slate-900">
          {isRTL ? 'ملاحظات إضافية' : 'Additional Notes & Requirements'}
        </h3>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-normal text-slate-600 block">
            {isRTL ? 'برنامج إثرائي' : 'Enrichment Program'}
          </label>
          <input
            type="text"
            placeholder={isRTL ? 'مثال: يوجد / متحف بيت الأصيل' : 'e.g. Yes / Bayt Al-Aseel Cultural Museum'}
            value={enrichmentProgram}
            onChange={(e) => setEnrichmentProgram(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-normal text-slate-600 block">
            {t('common.notes', 'ملاحظات')}
          </label>
          <input
            type="text"
            placeholder={isRTL ? 'أدخل أي ملاحظات إضافية هنا...' : 'Enter any special notes here...'}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-normal text-slate-600 block">
            {isRTL ? 'نواقص / متطلبات' : 'Missing Requirements'}
          </label>
          <input
            type="text"
            placeholder={isRTL ? 'أدخل أي متطلبات ناقصة للمجموعة...' : 'Enter any missing documents or permits...'}
            value={missingRequirements}
            onChange={(e) => setMissingRequirements(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
          <p className="text-[11px] sm:text-xs text-red-500 font-normal pt-0.5">
            {isRTL ? 'سيتم تسجيلها تلقائياً في سجل النواقص والملاحظات' : 'Will be automatically logged in the operations notes registry'}
          </p>
        </div>
      </div>
    </div>
  );
}
