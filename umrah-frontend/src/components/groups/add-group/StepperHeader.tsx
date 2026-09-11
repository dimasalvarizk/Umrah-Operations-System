import { Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface StepperHeaderProps {
  currentStep: number;
}

export default function StepperHeader({ currentStep }: StepperHeaderProps) {
  const { t, isRTL } = useLanguage();

  const steps = [
    { id: 1, num: isRTL ? '١' : '1', label: t('groups.wizard_step1', 'المعلومات الأساسية') },
    { id: 2, num: isRTL ? '٢' : '2', label: t('groups.wizard_step2', 'الإقامة والفنادق') },
    { id: 3, num: isRTL ? '٣' : '3', label: t('groups.wizard_step3', 'الرحلات والنقل') },
    { id: 4, num: isRTL ? '٤' : '4', label: t('groups.wizard_step4', 'التصاريح والإضافية') },
  ];

  return (
    <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 bg-white shrink-0">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Item */}
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#00c48c] bg-white text-[#00c48c] flex items-center justify-center text-xs font-bold shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#00c48c] text-white shadow-xs'
                        : 'border border-slate-300 text-slate-400 bg-white font-medium'
                    }`}
                  >
                    {step.num}
                  </div>
                )}
                <span
                  className={`text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'font-bold text-slate-900'
                      : isCompleted
                      ? 'text-slate-600 font-medium'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-3 transition-colors ${
                    step.id < currentStep ? 'bg-[#00c48c]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
