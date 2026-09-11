import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'login' | 'floating';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'navbar', className = '' }: LanguageSwitcherProps) {
  const { language, toggleLanguage, setLanguage } = useLanguage();

  if (variant === 'login') {
    return (
      <div 
        dir="ltr"
        className={`flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs backdrop-blur-xs ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage('ar')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'ar'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🇸🇦</span>
          <span>العربية</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            language === 'en'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f8fafc] hover:bg-slate-100 text-slate-700 border border-slate-200/90 transition shadow-2xs cursor-pointer ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span className="font-bold tracking-tight">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}
