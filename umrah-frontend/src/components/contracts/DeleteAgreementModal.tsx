import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { AgreementItem } from './AddAgreementModal';

interface DeleteAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agreement: AgreementItem | null;
}

export default function DeleteAgreementModal({
  isOpen,
  onClose,
  onConfirm,
  agreement,
}: DeleteAgreementModalProps) {
  const { direction, t, isRTL } = useLanguage();

  if (!isOpen || !agreement) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
        dir={direction}
      >
        <div className="w-20 h-20 rounded-full bg-rose-100 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-rose-600 stroke-[2.2]" />
        </div>

        <div className="space-y-1.5 pt-1">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
            {t('contracts.delete_confirm', 'هل أنت متأكد من الحذف؟')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {isRTL ? (
              <>
                سيتم حذف الاتفاقية <span className="font-bold text-slate-800">({agreement.agreementNo})</span> نهائياً من سجل الاتفاقيات.
              </>
            ) : (
              <>
                The agreement <span className="font-bold text-slate-800">({agreement.agreementNo})</span> will be permanently deleted from the registry.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 w-full pt-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
          >
            {t('contracts.delete_sure_btn', 'نعم، حذف')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
          >
            {t('common.cancel', 'إلغاء')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
