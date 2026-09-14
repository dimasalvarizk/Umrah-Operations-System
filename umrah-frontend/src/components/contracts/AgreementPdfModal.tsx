import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import AgreementPdfView, { type AgreementPdfData } from './AgreementPdfView';

interface AgreementPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: AgreementPdfData;
}

export default function AgreementPdfModal({
  isOpen,
  onClose,
  data,
}: AgreementPdfModalProps) {
  const { direction, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('pdf-modal-open');
    } else {
      document.body.classList.remove('pdf-modal-open');
    }
    return () => {
      document.body.classList.remove('pdf-modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      id="agreement-pdf-modal"
      className="fixed inset-0 z-50 flex flex-col items-center justify-start p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn print:static print:inset-auto print:z-auto print:p-0 print:m-0 print:bg-white print:overflow-visible print:block"
    >
      {/* Top Action Bar (Hidden on print) */}
      <div
        className="max-w-[794px] w-full mb-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 px-4 flex items-center justify-between text-white shadow-2xl shrink-0 print:hidden"
        dir={direction}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title={t('common.close', 'إغلاق')}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {t('contracts.preview_pdf', 'معاينة وثيقة الاتفاقية (PDF)')}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {t('contracts.pdf_ready_export', 'جاهز للطباعة والتصدير')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{t('contracts.print_save_pdf', 'طباعة / حفظ PDF')}</span>
          </button>
        </div>
      </div>

      {/* Sheet Content */}
      <div className="w-full flex justify-center pb-6 print:pb-0 print:w-full print:m-0">
        <AgreementPdfView data={data} />
      </div>
    </div>,
    document.body
  );
}
