import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Users,
  Building2,
  Plane,
  Bus,
  FileText,
  MessageSquare,
  Settings,
  MoreVertical,
  LogOut,
  Globe,
  Check,
  X,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoLogin from '../../assets/logo-login.png';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeTab?: string;
}

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rawRole = (user?.role || '').toLowerCase().trim();
  const displayRole =
    rawRole === 'super admin' || rawRole === 'admin'
      ? (isRTL ? 'مسؤول النظام (Super Admin)' : 'Super Admin')
      : rawRole === 'viewer'
        ? (isRTL ? 'مشاهد (Viewer)' : 'Viewer')
        : (isRTL ? 'موظف عمليات (Staff)' : 'Staff');

  const avatarInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : (isRTL ? 'أ' : 'A');

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentTab =
    activeTab ||
    (location.pathname.includes('/groups')
      ? 'groups'
      : location.pathname.includes('/hotels')
        ? 'hotels'
        : location.pathname.includes('/trips')
          ? 'trips'
          : location.pathname.includes('/transport') && !location.pathname.includes('transportation-companies-listing-ar')
            ? 'transport'
            : location.pathname.includes('/contracts') || location.pathname.includes('transportation-companies-listing-ar')
              ? 'contracts'
              : location.pathname.includes('/notes')
                ? 'notes'
                : location.pathname.includes('/settings')
                  ? 'settings'
                  : 'dashboard');

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'لوحة التحكم'), icon: Home, path: '/dashboard' },
    { id: 'groups', label: t('nav.groups', 'المجموعات'), icon: Users, path: '/groups' },
    { id: 'hotels', label: t('nav.hotels', 'الفنادق'), icon: Building2, path: '/hotels' },
    { id: 'trips', label: t('nav.trips', 'الرحلات'), icon: Plane, path: '/trips' },
    { id: 'transport', label: t('nav.transport', 'النقل'), icon: Bus, path: '/transport' },
    { id: 'contracts', label: t('nav.contracts', 'الاتفاقيات'), icon: FileText, path: '/contracts' },
    { id: 'notes', label: t('nav.notes', 'الملاحظات'), icon: MessageSquare, path: '/notes' },
    { id: 'settings', label: t('nav.settings', 'الإعدادات'), icon: Settings, path: '/settings' },
  ];

  // Dynamic positioning and border based on RTL/LTR
  const sidebarPositionClass = isRTL
    ? `right-0 border-l border-slate-900 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`
    : `left-0 border-r border-slate-900 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`;

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-[#0d0f14] text-white flex flex-col justify-between z-50 transition-transform duration-300 shrink-0 select-none ${sidebarPositionClass}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Top Sidebar Branding & Menu */}
        <div>
          <div className="pt-5 pb-5 px-4 flex items-center justify-between border-b border-slate-900/60 mb-2">
            <div className="flex items-center gap-3">
              <img
                src={logoLogin}
                alt="Logo"
                className="w-10 h-10 object-contain shrink-0 drop-shadow-md"
              />
              <span className="text-[#00dc82] text-xs sm:text-[13px] font-medium tracking-wide leading-tight">
                {t('nav.system_title', 'نظام عمليات الحج والعمرة')}
              </span>
            </div>

            {/* Mobile Close X Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center justify-start gap-3 px-3.5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-[13px] transition cursor-pointer ${
                    isActive
                      ? 'bg-[#161d26] text-white font-medium shadow-2xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-normal'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00dc82]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Profile & Three-Dots Menu */}
        <div className="px-4 py-5 border-t border-slate-900/90 flex items-center justify-between relative">
          {/* User info & avatar */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#273859] text-blue-100 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-400/20 shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                avatarInitial
              )}
            </div>
            <div className={`truncate ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-xs font-bold text-white leading-tight truncate">
                {user?.name || t('nav.user_name', 'أحمد محمد')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {displayRole}
              </div>
            </div>
          </div>

          {/* Action icons: More (Three Dots) on left of Logout */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Three Dots Button for Language Switcher */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isLangMenuOpen
                    ? 'text-[#00dc82] bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('nav.change_language', 'تغيير لغة النظام')}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Language Switch Popover Menu */}
              {isLangMenuOpen && (
                <div
                  ref={menuRef}
                  className={`absolute bottom-12 ${
                    isRTL ? 'left-0' : 'right-0'
                  } w-48 bg-[#161d26] border border-slate-700/90 rounded-2xl p-2 shadow-2xl z-50 animate-scaleUp`}
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-700/60 mb-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-[#00dc82]" />
                    <span>{t('nav.change_language', 'تغيير لغة النظام')}</span>
                  </div>

                  {/* Arabic Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('ar');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      language === 'ar'
                        ? 'bg-[#00dc82]/15 text-[#00dc82]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇸🇦</span>
                      <span>العربية</span>
                    </span>
                    {language === 'ar' && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>

                  {/* English Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      language === 'en'
                        ? 'bg-[#00dc82]/15 text-[#00dc82]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === 'en' && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition cursor-pointer"
              title={t('nav.logout', 'تسجيل الخروج')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
}
