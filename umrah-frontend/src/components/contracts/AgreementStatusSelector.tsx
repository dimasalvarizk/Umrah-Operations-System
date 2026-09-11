import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type AgreementStatusType = 'نشطة' | 'في انتظار الموافقة' | 'منتهية';

interface AgreementStatusSelectorProps {
  value: AgreementStatusType;
  onChange: (newStatus: AgreementStatusType) => void;
  disabled?: boolean;
}

export default function AgreementStatusSelector({
  value,
  onChange,
  disabled = false,
}: AgreementStatusSelectorProps) {
  const { t, isRTL, direction } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const statusConfig: Record<
    AgreementStatusType,
    {
      label: string;
      bgClass: string;
      textClass: string;
      borderClass: string;
      dotClass: string;
      hoverClass: string;
    }
  > = {
    نشطة: {
      label: t('contracts.status_active', 'نشطة'),
      bgClass: 'bg-[#e6fcf5]',
      textClass: 'text-[#0ca678]',
      borderClass: 'border-[#c3fae8]',
      dotClass: 'bg-[#0ca678]',
      hoverClass: 'hover:bg-[#c3fae8]/40',
    },
    'في انتظار الموافقة': {
      label: t('contracts.status_pending', 'في انتظار الموافقة'),
      bgClass: 'bg-[#fff9db]',
      textClass: 'text-[#f59f00]',
      borderClass: 'border-[#ffec99]',
      dotClass: 'bg-[#f59f00]',
      hoverClass: 'hover:bg-[#ffec99]/40',
    },
    منتهية: {
      label: t('contracts.status_expired', 'منتهية'),
      bgClass: 'bg-[#ffe3e3]',
      textClass: 'text-[#f03e3e]',
      borderClass: 'border-[#ffc9c9]',
      dotClass: 'bg-[#f03e3e]',
      hoverClass: 'hover:bg-[#ffc9c9]/40',
    },
  };

  const current = statusConfig[value] || statusConfig['منتهية'];
  const allStatuses: AgreementStatusType[] = ['نشطة', 'في انتظار الموافقة', 'منتهية'];

  return (
    <div
      className="relative inline-flex items-center justify-center text-start"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      dir={direction}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs inline-flex items-center justify-between gap-1.5 border transition-all duration-150 cursor-pointer select-none group active:scale-95 whitespace-nowrap min-w-[95px] ${
          current.bgClass
        } ${current.textClass} ${current.borderClass} ${
          disabled ? 'opacity-60 cursor-not-allowed' : current.hoverClass
        }`}
        title={isRTL ? 'انقر لتغيير حالة الاتفاقية يدوياً' : 'Click to change agreement status manually'}
      >
        <span className="truncate flex-1 text-center">{current.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 shrink-0 opacity-70 group-hover:opacity-100 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? 'left-0' : 'right-0'
          } top-full mt-1.5 w-46 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 z-50 animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/80 mb-1">
            {t('common.status', 'حالة الاتفاقية')}
          </div>

          <div className="space-y-0.5">
            {allStatuses.map((st) => {
              const config = statusConfig[st];
              const isSelected = value === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(st);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-start ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
                    <span className="truncate">{config.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-800 stroke-[2.5] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
