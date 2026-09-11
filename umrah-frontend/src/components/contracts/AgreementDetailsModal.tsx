import { X, FileText, Calendar, Building2, MapPin, CheckCircle2, Clock, AlertTriangle, Printer } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { AgreementItem } from './AddAgreementModal';

interface AgreementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: AgreementItem | null;
}

export default function AgreementDetailsModal({
  isOpen,
  onClose,
  agreement,
}: AgreementDetailsModalProps) {
  const { direction, t, isRTL } = useLanguage();

  if (!isOpen || !agreement) return null;

  const getStatusBadge = (status: AgreementItem['status']) => {
    switch (status) {
      case 'نشطة':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#dcfce7] text-[#15803d] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('contracts.status_active', 'نشطة')}
          </span>
        );
      case 'في انتظار الموافقة':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t('contracts.status_pending', 'في انتظار الموافقة')}
          </span>
        );
      case 'منتهية':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fee2e2] text-[#b91c1c] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('contracts.status_expired', 'منتهية')}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[90vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight">
                {t('contracts.tab_agreement_details', 'تفاصيل الاتفاقية')}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {agreement.agreementNo}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Top Status & Name Bar */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {agreement.agreementName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? 'الجهة: ' : 'Entity: '}<span className="font-semibold text-slate-700">{agreement.entityName}</span>
              </p>
            </div>
            <div>{getStatusBadge(agreement.status)}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.city', 'المدينة')}</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {agreement.city}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.filter_by_type', 'نوع الاتفاقية')}</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {agreement.type === 'فندق' ? t('contracts.hotel_stay_type', 'إقامة فندقية') : t('contracts.transport_op_type', 'خدمات نقل وتشغيل')}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.rooms_count', 'عدد الغرف')}</span>
              <span className="font-bold text-slate-800 text-sm">
                {agreement.roomsCount}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.duration_days', 'مدة الاتفاقية')}</span>
              <span className="font-bold text-slate-800 text-sm">
                {agreement.durationDays} {isRTL ? 'يوم' : 'Days'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.start_date', 'تاريخ البداية')}</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {agreement.startDate}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">{t('contracts.end_date', 'تاريخ النهاية')}</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {agreement.endDate}
              </span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#166534] block font-semibold">{t('contracts.total_price', 'إجمالي قيمة الاتفاقية')}</span>
              <span className="text-lg sm:text-xl font-bold text-[#15803d]">
                {agreement.totalPrice.toLocaleString()} {t('common.currency', 'ر.س')}
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#bbf7d0] hover:bg-[#dcfce7] text-[#166534] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {t('contracts.print_contract', 'طباعة العقد')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            {t('common.close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
}
