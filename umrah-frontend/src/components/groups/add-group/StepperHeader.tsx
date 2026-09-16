import { Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface StepperHeaderProps {
  currentStep: number;
}

export default function StepperHeader({ currentStep }: StepperHeaderProps) {
  const { t, isRTL } = useLanguage();

  const steps = [
    { id: 1, num: isRTL ? '١' : '1', label: t('groups.wizard_step1', 'Basic Information') },
    { id: 2, num: isRTL ? '٢' : '2', label: t('groups.wizard_step2', 'Hotels & Housing') },
    { id: 3, num: isRTL ? '٣' : '3', label: t('groups.wizard_step3', 'Flights & Transport') },
    { id: 4, num: isRTL ? '٤' : '4', label: t('groups.wizard_step4', 'Permits & Notes') },
  ];

  const currentStepData = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <div className="px-4 sm:px-8 py-3.5 sm:py-4 border-b border-slate-200/80 bg-white shrink-0">
      {/* Desktop / Tablet Stepper (>= sm) */}
      <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Item */}
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#00c48c] bg-white text-[#00c48c] flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-[#00c48c] text-white shadow-xs ring-2 ring-emerald-500/20'
                        : 'border border-slate-300 text-slate-400 bg-white font-medium'
                    }`}
                  >
                    {step.num}
                  </div>
                )}
                <span
                  className={`text-xs md:text-sm whitespace-nowrap transition-colors ${
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
                  className={`h-[2px] flex-1 mx-2 md:mx-3 transition-colors ${
                    step.id < currentStep ? 'bg-[#00c48c]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper (< sm) - Fits 100% on all mobile screens */}
      <div className="sm:hidden space-y-2.5">
        {/* 4 Step Connected Circle Nodes */}
        <div className="flex items-center justify-between px-1">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#00c48c] text-white ring-4 ring-emerald-100 shadow-xs'
                          : 'border-2 border-slate-200 text-slate-400 bg-slate-50'
                      }`}
                    >
                      {step.num}
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-2 transition-colors ${
                      step.id < currentStep ? 'bg-[#00c48c]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Description Pill on Mobile */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-emerald-600 shrink-0">
              {isRTL ? `الخطوة ${currentStepData.num} من ٤:` : `Step ${currentStepData.num} of 4:`}
            </span>
            <span className="font-bold text-slate-800 truncate">
              {currentStepData.label}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 ml-2">
            {Math.round((currentStep / 4) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
