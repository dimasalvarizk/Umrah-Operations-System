import { Check, Printer } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface StepSuccessDialogProps {
  groupCode?: string;
  pilgrimsCount?: number;
  onFinish: () => void;
}

export default function StepSuccessDialog({
  groupCode,
  pilgrimsCount = 0,
  onFinish,
}: StepSuccessDialogProps) {
  const { t, isRTL, direction } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-[28px] max-w-[440px] w-full p-6 sm:p-8 pt-8 pb-7 shadow-2xl relative border border-slate-100 flex flex-col items-center text-center animate-scaleUp"
        dir={direction}
      >
        {/* Top Success Circle Icon */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#e6f9f2] flex items-center justify-center mx-auto mb-5">
          <Check className="w-9 h-9 sm:w-10 sm:h-10 text-[#00c48c] stroke-[2.5]" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#1e293b] mb-2 tracking-tight">
          {t('groups.success_created', 'تم إنشاء المجموعة بنجاح!')}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed max-w-[340px] mb-6">
          {t('groups.success_desc', 'تم تسجيل المجموعة وتوزيع تصاريح الروضة الشريفة وتفويج الانتقالات بنجاح في النظام.')}
        </p>

        {/* Summary Info Box */}
        <div className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 mb-6">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <span className="text-xs sm:text-sm text-slate-500 font-normal">
              {isRTL ? 'رقم المجموعة المرجعي' : 'Reference Group Code'}
            </span>
            <span dir="ltr" className="text-xs sm:text-[15px] font-bold text-[#1e293b] tracking-tight">
              {groupCode ? (groupCode.startsWith('#') ? groupCode : `#${groupCode}`) : '#GRP-2401'}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <span className="text-xs sm:text-sm text-slate-500 font-normal">
              {isRTL ? 'إجمالي الحجاج المضافين' : 'Total Pilgrims Added'}
            </span>
            <span className="text-xs sm:text-[15px] font-bold text-[#1e293b]">
              {pilgrimsCount} {isRTL ? 'معتمر' : 'Pilgrims'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-500 font-normal">
              {isRTL ? 'تصاريح الروضة والعمرة' : 'Umrah & Rawdah Permits'}
            </span>
            <span className="text-xs sm:text-[15px] font-bold text-[#10b981]">
              {isRTL ? 'مكتمل ومؤكد' : 'Confirmed & Issued'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={onFinish}
            className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-[0.99]"
          >
            {isRTL ? 'الذهاب للرئيسية' : 'Return to Overview'}
          </button>

          <button
            onClick={() => window.print()}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-[#0f172a] py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
          >
            <Printer className="w-4 h-4 text-[#0f172a]" />
            <span>{isRTL ? 'طباعة تفاصيل المجموعة' : 'Print Group Manifest'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
