import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type GroupStatusType = 'مكتمل' | 'قيد التجهيز' | 'ناقص';

interface GroupStatusSelectorProps {
  value: GroupStatusType;
  onChange: (newStatus: GroupStatusType) => void;
  disabled?: boolean;
}

export default function GroupStatusSelector({
  value,
  onChange,
  disabled = false,
}: GroupStatusSelectorProps) {
  const { t, isRTL, direction } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      if (!isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < 180);
      }
      setIsOpen(!isOpen);
    }
  };

  const statusConfig: Record<
    GroupStatusType,
    {
      label: string;
      bgClass: string;
      textClass: string;
      borderClass: string;
      dotClass: string;
      hoverClass: string;
    }
  > = {
    مكتمل: {
      label: isRTL ? 'مكتمل' : 'Completed',
      bgClass: 'bg-[#e6f9f0]',
      textClass: 'text-[#10b981]',
      borderClass: 'border-[#a7f3d0]',
      dotClass: 'bg-[#10b981]',
      hoverClass: 'hover:bg-[#a7f3d0]/40',
    },
    'قيد التجهيز': {
      label: isRTL ? 'قيد التجهيز' : 'In Preparation',
      bgClass: 'bg-[#fef3c7]',
      textClass: 'text-[#d97706]',
      borderClass: 'border-[#fde68a]',
      dotClass: 'bg-[#d97706]',
      hoverClass: 'hover:bg-[#fde68a]/40',
    },
    ناقص: {
      label: isRTL ? 'ناقص' : 'Incomplete',
      bgClass: 'bg-[#fee2e2]',
      textClass: 'text-[#ef4444]',
      borderClass: 'border-[#fecdd3]',
      dotClass: 'bg-[#ef4444]',
      hoverClass: 'hover:bg-[#fecdd3]/40',
    },
  };

  const current = statusConfig[value] || statusConfig['ناقص'];
  const allStatuses: GroupStatusType[] = ['مكتمل', 'قيد التجهيز', 'ناقص'];

  return (
    <div
      className={`relative inline-flex items-center justify-center text-start ${isOpen ? 'z-40' : 'z-10'}`}
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      dir={direction}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`text-xs font-bold px-3 py-1 rounded-md shadow-2xs inline-flex items-center justify-between gap-2 border transition-all duration-150 cursor-pointer select-none group active:scale-95 whitespace-nowrap min-w-[105px] ${
          current.bgClass
        } ${current.textClass} ${current.borderClass} ${
          disabled ? 'opacity-60 cursor-not-allowed' : current.hoverClass
        }`}
        title={isRTL ? 'انقر لتغيير حالة المجموعة يدوياً' : 'Click to change group status manually'}
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
          } ${openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} w-44 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/15 p-1.5 z-50 animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/80 mb-1">
            {t('common.status', 'الحالة')}
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
