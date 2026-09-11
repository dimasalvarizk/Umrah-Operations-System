import { Menu, Bell, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  title: string;
  onMenuClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backText?: string;
  children?: React.ReactNode;
}

export default function Navbar({
  title,
  onMenuClick,
  showBackButton = false,
  onBackClick,
  backText,
  children,
}: NavbarProps) {
  const { t, isRTL } = useLanguage();
  const resolvedBackText = backText || t('nav.back', 'العودة');
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <header className="h-16 border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between bg-white shrink-0 shadow-2xs sticky top-0 z-30">
      {/* Title & Navigation controls */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title={t('nav.menu', 'القائمة')}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {showBackButton && (
          <button
            type="button"
            onClick={onBackClick}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0f172a] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
            title={resolvedBackText}
          >
            <BackIcon className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{resolvedBackText}</span>
          </button>
        )}

        <h1 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
          {title}
        </h1>

        {children}
      </div>

      {/* Action controls: Company Badge, Bell, Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Primary Company Badge */}
        <div className="hidden md:flex items-center bg-[#f8fafc] text-slate-700 text-xs px-3.5 py-1.5 rounded-xl border border-slate-200/80 font-medium shadow-2xs">
          <span>{t('nav.company_badge', 'الشركة الرئيسية للخدمات')}</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-700 hover:bg-slate-200 transition shadow-2xs cursor-pointer relative"
          title={t('nav.notifications', 'التنبيهات')}
        >
          <Bell className="w-4 h-4 text-slate-700" />
        </button>

        {/* User Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-800 font-bold text-sm shadow-2xs border border-slate-200/60">
          {isRTL ? 'م' : 'A'}
        </div>
      </div>
    </header>
  );
}
