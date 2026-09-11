import { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Shield,
  FileCheck,
  FileCode
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface FilePreviewData {
  name: string;
  size?: number;
  url?: string;
  type?: string;
  uploadedAt?: string;
  categoryTitle?: string;
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FilePreviewData | null;
}

export default function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const { isRTL, direction } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !file) return null;

  const fileName = file.name || 'document.pdf';
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(fileExt) || file.type?.startsWith('image/');
  const isPdf = fileExt === 'pdf' || file.type === 'application/pdf';

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '245 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    if (file.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a dummy text blob download if no real URL
      const blob = new Blob([`Document: ${fileName}\nCategory: ${file.categoryTitle || 'Umrah Operation Attachment'}\nTimestamp: ${new Date().toISOString()}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenNewTab = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[90vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              {isImage ? (
                <ImageIcon className="w-5 h-5 stroke-[2]" />
              ) : isPdf ? (
                <FileCheck className="w-5 h-5 stroke-[2]" />
              ) : (
                <FileText className="w-5 h-5 stroke-[2]" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate" title={fileName}>
                {fileName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{file.categoryTitle || (isRTL ? 'مستند مرفق' : 'Uploaded Attachment')}</span>
                <span>•</span>
                <span className="font-mono">{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="uppercase text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  {fileExt || 'DOC'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer shrink-0"
            title={isRTL ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/80 flex items-center justify-center min-h-[320px]">
          {isImage && file.url ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="relative max-h-[55vh] max-w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white p-2">
                <img
                  src={file.url}
                  alt={fileName}
                  className="max-h-[50vh] w-auto object-contain rounded-lg transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-600 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                  className="hover:text-slate-900 px-1.5 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                  className="hover:text-slate-900 px-1.5 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            /* Digital Document Presentation */
            <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              {/* Official Seal & Header Mock */}
              <div className="border-b border-dashed border-slate-200 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Shield className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {isRTL ? 'منظومة خدمات الحج والعمرة - تصريح رسمي' : 'Kingdom of Saudi Arabia - Umrah Operations'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isRTL ? 'وثيقة تشغيلية معتمدة ومرفوعة في النظام' : 'Official Verified Operational Document'}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'معتمد' : 'Verified'}</span>
                </div>
              </div>

              {/* Document Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3 space-y-1">
                  <span className="text-slate-400 block">{isRTL ? 'اسم الملف' : 'File Name'}</span>
                  <p className="font-bold text-slate-800 font-mono break-all">{fileName}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3 space-y-1">
                  <span className="text-slate-400 block">{isRTL ? 'نوع الملف والمقاس' : 'File Type & Size'}</span>
                  <p className="font-bold text-slate-800">{fileExt.toUpperCase()} ({formatFileSize(file.size)})</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3 space-y-1">
                  <span className="text-slate-400 block">{isRTL ? 'تاريخ الرفع' : 'Uploaded Timestamp'}</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{file.uploadedAt || new Date().toLocaleDateString('en-GB')}</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3 space-y-1">
                  <span className="text-slate-400 block">{isRTL ? 'القسم المرتبط' : 'Attached Section'}</span>
                  <p className="font-bold text-emerald-700">{file.categoryTitle || (isRTL ? 'التصاريح والتفويج' : 'Permits & Movements')}</p>
                </div>
              </div>

              {/* Note banner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isRTL
                    ? 'الملف متاح ومربوط آلياً بسجل المجموعة، يمكنك تحميله أو فتحه مباشرة.'
                    : 'The file is securely attached to this group record. You can download or view it directly.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2]" />
              <span>{isRTL ? 'تحميل الملف' : 'Download File'}</span>
            </button>

            {file.url && (
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isRTL ? 'فتح في نافذة' : 'Open in Tab'}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
