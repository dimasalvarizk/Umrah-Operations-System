import { useState, useRef } from 'react';
import { ChevronDown, Upload, Check, X, Eye } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import FilePreviewModal, { type FilePreviewData } from '../../common/FilePreviewModal';

interface UploadedFileItem {
  name: string;
  size?: number;
  url?: string;
  type?: string;
  uploadedAt?: string;
  categoryTitle?: string;
}

interface FileUploadButtonProps {
  id: string;
  categoryTitle?: string;
  fileInfo?: UploadedFileItem;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onView: (fileData: FilePreviewData) => void;
}

function FileUploadButton({ id, categoryTitle, fileInfo, onUpload, onRemove, onView }: FileUploadButtonProps) {
  const { isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        onChange={handleChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
      />
      {fileInfo ? (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-[11px] font-normal transition shadow-2xs hover:bg-emerald-100/70">
          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onView({
                name: fileInfo.name,
                size: fileInfo.size,
                url: fileInfo.url,
                type: fileInfo.type,
                uploadedAt: fileInfo.uploadedAt,
                categoryTitle: categoryTitle || fileInfo.categoryTitle,
              });
            }}
            className="truncate max-w-[80px] sm:max-w-[110px] hover:underline text-emerald-800 font-medium cursor-pointer text-left rtl:text-right"
            title={fileInfo.name}
          >
            {fileInfo.name}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onView({
                name: fileInfo.name,
                size: fileInfo.size,
                url: fileInfo.url,
                type: fileInfo.type,
                uploadedAt: fileInfo.uploadedAt,
                categoryTitle: categoryTitle || fileInfo.categoryTitle,
              });
            }}
            className="text-emerald-600 hover:text-emerald-900 p-0.5 rounded cursor-pointer transition hover:bg-emerald-200/50"
            title={isRTL ? 'معاينة الملف' : 'View / Preview file'}
          >
            <Eye className="w-3 h-3 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer transition hover:bg-red-50"
            title={isRTL ? 'إزالة الملف' : 'Remove file'}
          >
            <X className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-md transition shadow-2xs cursor-pointer active:scale-95"
        >
          <span className="font-normal">{isRTL ? 'رفع ملف' : 'Upload File'}</span>
          <Upload className="w-3 h-3 text-slate-500 shrink-0 stroke-[2]" />
        </button>
      )}
    </div>
  );
}

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
  uploadedFiles?: Record<string, UploadedFileItem>;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<Record<string, UploadedFileItem>>>;
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
  uploadedFiles: parentUploadedFiles,
  setUploadedFiles: parentSetUploadedFiles,
}: Step4PermitsNotesProps) {
  const { t, isRTL } = useLanguage();
  const [localUploadedFiles, setLocalUploadedFiles] = useState<Record<string, UploadedFileItem>>({});

  const [previewFile, setPreviewFile] = useState<FilePreviewData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const files = parentUploadedFiles ?? localUploadedFiles;
  const setFiles = parentSetUploadedFiles ?? setLocalUploadedFiles;

  const handleFileUpload = (fieldKey: string, file: File, categoryTitle: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFiles((prev) => ({
        ...prev,
        [fieldKey]: {
          name: file.name,
          size: file.size,
          url: dataUrl,
          type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          uploadedAt: new Date().toLocaleDateString('en-GB'),
          categoryTitle: categoryTitle,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileRemove = (fieldKey: string) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleViewFile = (fileData: FilePreviewData) => {
    setPreviewFile(fileData);
    setIsPreviewOpen(true);
  };

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
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'تفويج الوصول' : 'Arrival Grouping'}
              </label>
              <FileUploadButton
                id="file-arrivalGrouping"
                categoryTitle={isRTL ? 'تفويج الوصول' : 'Arrival Grouping'}
                fileInfo={files['arrivalGrouping']}
                onUpload={(f) => handleFileUpload('arrivalGrouping', f, isRTL ? 'تفويج الوصول' : 'Arrival Grouping')}
                onRemove={() => handleFileRemove('arrivalGrouping')}
                onView={handleViewFile}
              />
            </div>
            <div className="relative">
              <select
                value={arrivalGrouping}
                onChange={(e) => setArrivalGrouping(e.target.value)}
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

          {/* Inter-City Grouping */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping'}
              </label>
              <FileUploadButton
                id="file-interCityGrouping"
                categoryTitle={isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping'}
                fileInfo={files['interCityGrouping']}
                onUpload={(f) => handleFileUpload('interCityGrouping', f, isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping')}
                onRemove={() => handleFileRemove('interCityGrouping')}
                onView={handleViewFile}
              />
            </div>
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
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'تفويج المغادرة' : 'Departure Grouping'}
              </label>
              <FileUploadButton
                id="file-departureGrouping"
                categoryTitle={isRTL ? 'تفويج المغادرة' : 'Departure Grouping'}
                fileInfo={files['departureGrouping']}
                onUpload={(f) => handleFileUpload('departureGrouping', f, isRTL ? 'تفويج المغادرة' : 'Departure Grouping')}
                onRemove={() => handleFileRemove('departureGrouping')}
                onView={handleViewFile}
              />
            </div>
            <div className="relative">
              <select
                value={departureGrouping}
                onChange={(e) => setDepartureGrouping(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="لا يوجد">{isRTL ? 'لا يوجد' : 'None'}</option>
                <option value="معلق">{t('common.pending', 'معلق')}</option>
                <option value="مكتمل">{t('common.completed', 'مكتمل')}</option>
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
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'مزارات مكة' : 'Makkah Ziyarat Places'}
              </label>
              <FileUploadButton
                id="file-makkahZiyarat"
                categoryTitle={isRTL ? 'مزارات مكة' : 'Makkah Ziyarat Places'}
                fileInfo={files['makkahZiyarat']}
                onUpload={(f) => handleFileUpload('makkahZiyarat', f, isRTL ? 'مزارات مكة' : 'Makkah Ziyarat Places')}
                onRemove={() => handleFileRemove('makkahZiyarat')}
                onView={handleViewFile}
              />
            </div>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل المزارات المطلوبة بمكة (مثال: غار حراء، جبل ثور)' : 'e.g. Cave of Hira, Mount Thawr'}
              value={makkahZiyarat}
              onChange={(e) => setMakkahZiyarat(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'مزارات المدينة' : 'Madinah Ziyarat Places'}
              </label>
              <FileUploadButton
                id="file-madinahZiyarat"
                categoryTitle={isRTL ? 'مزارات المدينة' : 'Madinah Ziyarat Places'}
                fileInfo={files['madinahZiyarat']}
                onUpload={(f) => handleFileUpload('madinahZiyarat', f, isRTL ? 'مزارات المدينة' : 'Madinah Ziyarat Places')}
                onRemove={() => handleFileRemove('madinahZiyarat')}
                onView={handleViewFile}
              />
            </div>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل المزارات المطلوبة بالمدينة (مثال: مسجد قباء، جبل أحد)' : 'e.g. Quba Mosque, Mount Uhud'}
              value={madinahZiyarat}
              onChange={(e) => setMadinahZiyarat(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Permits / Agreements */}
      <div className="pt-1">
        <h3 className="text-sm font-bold text-slate-900">
          {isRTL ? 'الاتفاقيات والتصاريح' : 'Permits & Agreements'}
        </h3>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Umrah Permit */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {t('groups.umrah_permit', 'تصريح عمرة')}
              </label>
              <FileUploadButton
                id="file-umrahPermit"
                categoryTitle={isRTL ? 'تصريح عمرة' : 'Umrah Permit'}
                fileInfo={files['umrahPermit']}
                onUpload={(f) => handleFileUpload('umrahPermit', f, isRTL ? 'تصريح عمرة' : 'Umrah Permit')}
                onRemove={() => handleFileRemove('umrahPermit')}
                onView={handleViewFile}
              />
            </div>
            <div className="relative">
              <select
                value={umrahPermitStatus}
                onChange={(e) => setUmrahPermitStatus(e.target.value)}
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

          {/* Rawdah Men */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {t('groups.rawdah_men', 'تصاريح الروضة - رجال')}
              </label>
              <FileUploadButton
                id="file-rawdahMen"
                categoryTitle={isRTL ? 'تصاريح الروضة - رجال' : 'Rawdah Permit (Men)'}
                fileInfo={files['rawdahMen']}
                onUpload={(f) => handleFileUpload('rawdahMen', f, isRTL ? 'تصاريح الروضة - رجال' : 'Rawdah Permit (Men)')}
                onRemove={() => handleFileRemove('rawdahMen')}
                onView={handleViewFile}
              />
            </div>
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
            <div className="flex items-center gap-2">
              <label className="text-xs font-normal text-slate-600 block">
                {t('groups.rawdah_women', 'تصاريح الروضة - نساء')}
              </label>
              <FileUploadButton
                id="file-rawdahWomen"
                categoryTitle={isRTL ? 'تصاريح الروضة - نساء' : 'Rawdah Permit (Women)'}
                fileInfo={files['rawdahWomen']}
                onUpload={(f) => handleFileUpload('rawdahWomen', f, isRTL ? 'تصاريح الروضة - نساء' : 'Rawdah Permit (Women)')}
                onRemove={() => handleFileRemove('rawdahWomen')}
                onView={handleViewFile}
              />
            </div>
            <div className="relative">
              <select
                value={rawdahWomenPermitStatus}
                onChange={(e) => setRawdahWomenPermitStatus(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-6 pl-9 text-right' : 'pl-6 pr-9 text-left'
                }`}
              >
                <option value="لم يقدم">{isRTL ? 'لم يقدم' : 'Not Submitted'}</option>
                <option value="قيد المراجعة">{isRTL ? 'قيد المراجعة' : 'In Review'}</option>
                <option value="مقبول">{isRTL ? 'مقبول' : 'Approved'}</option>
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
        {/* Enrichment Program */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'برنامج إثرائي' : 'Enrichment Program'}
            </label>
            <FileUploadButton
              id="file-enrichmentProgram"
              categoryTitle={isRTL ? 'برنامج إثرائي' : 'Enrichment Program'}
              fileInfo={files['enrichmentProgram']}
              onUpload={(f) => handleFileUpload('enrichmentProgram', f, isRTL ? 'برنامج إثرائي' : 'Enrichment Program')}
              onRemove={() => handleFileRemove('enrichmentProgram')}
              onView={handleViewFile}
            />
          </div>
          <input
            type="text"
            placeholder={isRTL ? 'مثال: يوجد / متحف بيت الأصيل' : 'e.g. Bayt Al-Aseel Cultural Museum'}
            value={enrichmentProgram}
            onChange={(e) => setEnrichmentProgram(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-normal text-slate-600 block">
              {t('common.notes', 'ملاحظات')}
            </label>
            <FileUploadButton
              id="file-additionalNotes"
              categoryTitle={isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}
              fileInfo={files['additionalNotes']}
              onUpload={(f) => handleFileUpload('additionalNotes', f, isRTL ? 'ملاحظات إضافية' : 'Additional Notes')}
              onRemove={() => handleFileRemove('additionalNotes')}
              onView={handleViewFile}
            />
          </div>
          <input
            type="text"
            placeholder={isRTL ? 'أدخل أي ملاحظات إضافية هنا...' : 'Enter any special notes here...'}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        {/* Missing Requirements */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-normal text-slate-600 block">
              {isRTL ? 'نواقص / متطلبات' : 'Missing Requirements'}
            </label>
            <FileUploadButton
              id="file-missingRequirements"
              categoryTitle={isRTL ? 'نواقص / متطلبات' : 'Missing Requirements'}
              fileInfo={files['missingRequirements']}
              onUpload={(f) => handleFileUpload('missingRequirements', f, isRTL ? 'نواقص / متطلبات' : 'Missing Requirements')}
              onRemove={() => handleFileRemove('missingRequirements')}
              onView={handleViewFile}
            />
          </div>
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

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}
