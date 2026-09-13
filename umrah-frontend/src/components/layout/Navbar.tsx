import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Menu,
  Bell,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Settings,
  User,
  ShieldCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Sliders,
  Plane,
  FileCheck2,
  Users,
  RefreshCw,
  StickyNote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getSystemListsApi, type BaseListItem } from '../../services/settingsApi';

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
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { user, logout, updateUserProfile } = useAuth();

  // Dropdown states
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);

  // Refs for click outside handling
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const branchMenuRef = useRef<HTMLDivElement>(null);

  const resolvedBackText = backText || t('nav.back', 'العودة');
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Active Branch / Company
  const [activeBranch, setActiveBranch] = useState<string>(() => {
    return (
      user?.branch ||
      localStorage.getItem('umrah_active_branch') ||
      (isRTL ? 'الشركة الرئيسية للخدمات' : 'Main Services Company')
    );
  });

  // Dynamic Branches from Database
  const [branchesData, setBranchesData] = useState<BaseListItem[]>(() => {
    try {
      const saved = localStorage.getItem('system_list_branches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchBranches = async () => {
    try {
      const items = await getSystemListsApi('branches');
      if (Array.isArray(items) && items.length > 0) {
        setBranchesData(items.filter((b) => b.status === 'Active'));
      }
    } catch {}
  };

  useEffect(() => {
    fetchBranches();

    const handleSync = (e: any) => {
      if (!e?.detail?.category || e.detail.category === 'branches') {
        fetchBranches();
      }
    };

    window.addEventListener('umrah_system_lists_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('umrah_system_lists_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    if (user?.branch) {
      setActiveBranch(user.branch);
    }
  }, [user?.branch]);

  // Available Branches List
  const availableBranches = useMemo(() => {
    if (branchesData.length > 0) {
      return branchesData.map((b) => ({
        id: String(b.id),
        name: isRTL ? b.nameAr || b.nameEn : b.nameEn || b.nameAr,
        code: b.code || '',
      }));
    }

    return [
      { id: '1', name: isRTL ? 'الفرع الرئيسي - مكة المكرمة' : 'Makkah Main Operations', code: 'MKH-01' },
      { id: '2', name: isRTL ? 'فرع المدينة المنورة' : 'Madinah Regional Hub', code: 'MED-01' },
      { id: '3', name: isRTL ? 'مكتب مطار الملك عبدالعزيز - جدة' : 'Jeddah Airport Terminal Desk', code: 'JED-AIR' },
      { id: '4', name: isRTL ? 'مكتب ميناء ينبع التجاري' : 'Yanbu Port Logistics', code: 'YNB-01' },
    ];
  }, [branchesData, isRTL]);

  // Real-time Notifications from Context
  const { notifications, unreadCount, markAsRead, markAllAsRead, isRefreshing, refreshNotifications } = useNotifications();

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    setIsNotifOpen(false);

    let targetUrl = n.referenceLink;

    // Smart route resolution
    if (!targetUrl || targetUrl === '/groups' || targetUrl === '/hotels' || targetUrl === '/trips' || targetUrl === '/contracts') {
      if (n.type === 'group' || n.type === 'permit') {
        targetUrl = n.referenceId ? `/groups?openGroup=${encodeURIComponent(n.referenceId)}` : '/groups';
      } else if (n.type === 'hotel') {
        targetUrl = n.referenceId ? `/hotels?hotelId=${encodeURIComponent(n.referenceId)}` : '/hotels';
      } else if (n.type === 'trip' || n.type === 'flight') {
        targetUrl = n.referenceId ? `/trips?tripId=${encodeURIComponent(n.referenceId)}` : '/trips';
      } else if (n.type === 'contract' || n.type === 'invoice') {
        targetUrl = n.referenceId ? `/contracts?contractId=${encodeURIComponent(n.referenceId)}` : '/contracts';
      } else if (n.type === 'note') {
        targetUrl = n.referenceId ? `/notes?noteId=${encodeURIComponent(n.referenceId)}` : '/notes';
      } else {
        targetUrl = '/dashboard';
      }
    }

    if (targetUrl) {
      navigate(targetUrl);
      if (n.referenceId) {
        window.dispatchEvent(
          new CustomEvent('umrah_open_record', {
            detail: { type: n.type, id: n.referenceId, notification: n },
          })
        );
      }
    }
  };

  const handleSelectBranch = (branchName: string) => {
    setActiveBranch(branchName);
    localStorage.setItem('umrah_active_branch', branchName);
    if (user) {
      updateUserProfile({ ...user, branch: branchName });
    }
    setIsBranchOpen(false);
  };

  const avatarInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : (isRTL ? 'م' : 'A');

  const displayRole = user?.role
    ? user.role === 'admin'
      ? (isRTL ? 'مسؤول النظام' : 'System Admin')
      : user.role === 'operator'
        ? (isRTL ? 'مشرف العمليات' : 'Operations Supervisor')
        : user.role === 'agent'
          ? (isRTL ? 'وكيل سياحي' : 'Travel Agent')
          : user.role === 'supervisor'
            ? (isRTL ? 'مشرف' : 'Supervisor')
            : user.role
    : t('nav.user_role', 'مشرف العمليات');

  // Close all dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(target)) {
        setIsBranchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {/* Action controls: Company/Branch Selector, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* 1. Primary Company / Branch Selector Pill */}
        <div className="relative" ref={branchMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsBranchOpen(!isBranchOpen);
              setIsNotifOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 bg-[#f8fafc] hover:bg-slate-100 text-slate-700 text-xs px-3.5 py-1.5 rounded-xl border border-slate-200/80 font-medium shadow-2xs transition cursor-pointer"
            title={isRTL ? 'تغيير الفرع / الشركة' : 'Switch Branch / Company'}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="max-w-[140px] sm:max-w-[180px] truncate">{activeBranch}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isBranchOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Branch Dropdown Popover */}
          {isBranchOpen && (
            <div
              className={`absolute top-11 ${
                isRTL ? 'left-0' : 'right-0'
              } w-72 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xl z-50 animate-scaleUp text-slate-800`}
            >
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
                <div className="text-xs font-bold text-slate-900">
                  {isRTL ? 'اختر الفرع / الشركة التشغيلية' : 'Select Operational Branch'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isRTL ? 'يحدد نطاق العمليات والبيانات الحالية' : 'Filters current operations and context'}
                </div>
              </div>

              <div className="space-y-1 max-h-56 overflow-y-auto">
                {availableBranches.map((b) => {
                  const isSelected = activeBranch.includes(b.name) || b.name.includes(activeBranch);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBranch(b.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/60'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className="truncate">{b.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1.5 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsBranchOpen(false);
                    navigate('/settings?tab=lists');
                  }}
                  className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-amber-600 py-1 transition cursor-pointer"
                >
                  {isRTL ? '⚙️ إدارة قائمة الفروع في الإعدادات' : '⚙️ Manage Branches in Settings'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Notification Bell Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsBranchOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-slate-700 transition shadow-2xs cursor-pointer relative"
            title={t('nav.notifications', 'التنبيهات')}
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Window */}
          {isNotifOpen && (
            <div
              className={`absolute top-11 ${
                isRTL ? 'left-0' : 'right-0'
              } w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-scaleUp text-slate-800 overflow-hidden`}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {isRTL ? 'مركز الإشعارات والتنبيهات' : 'Notification Center'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                      {unreadCount} {isRTL ? 'جديد' : 'new'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => refreshNotifications()}
                    className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                    title={isRTL ? 'تحديث فوري' : 'Refresh live feed'}
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
                    >
                      {isRTL ? 'تعيين الكل كمقروء' : 'Mark all read'}
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {isRTL ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isRTL ? 'ستظهر هنا كافة العمليات والتنبيهات المباشرة' : 'Live operational alerts will appear here in real-time'}
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    // Type-specific icon
                    const renderNotifIcon = () => {
                      switch (n.type) {
                        case 'trip':
                        case 'flight':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <Plane className="w-4 h-4" />
                            </div>
                          );
                        case 'hotel':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <Building2 className="w-4 h-4" />
                            </div>
                          );
                        case 'group':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <Users className="w-4 h-4" />
                            </div>
                          );
                        case 'permit':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                          );
                        case 'contract':
                        case 'invoice':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                          );
                        case 'note':
                          return (
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <StickyNote className="w-4 h-4" />
                            </div>
                          );
                        default:
                          return (
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              <Clock className="w-4 h-4" />
                            </div>
                          );
                      }
                    };

                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-slate-100/80 active:bg-slate-200/70 transition-all duration-150 cursor-pointer flex items-start gap-3 group relative border-b border-slate-100 last:border-b-0 ${
                          n.unread ? 'bg-amber-50/40 hover:bg-amber-100/40' : ''
                        }`}
                      >
                        {renderNotifIcon()}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className={`text-xs font-bold truncate group-hover:text-emerald-700 transition ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {isRTL ? n.titleAr || n.titleEn : n.titleEn || n.titleAr}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {isRTL ? n.timeAr || n.timeEn : n.timeEn || n.timeAr}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed group-hover:text-slate-700 transition">
                            {isRTL ? n.descAr || n.descEn : n.descEn || n.descAr}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 mt-2">
                          {n.unread && <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-200 shrink-0" />}
                          <ChevronRight className={`w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Link to Notifications Tab */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/settings?tab=notifications');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'إعدادات وقنوات الإشعارات' : 'Notification Channel Settings'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. User Profile Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
              setIsBranchOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-[#273859] text-blue-100 font-bold text-sm flex items-center justify-center shadow-2xs border border-blue-400/30 hover:ring-2 hover:ring-blue-500/20 transition cursor-pointer overflow-hidden"
            title={user?.name || 'User Profile'}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              avatarInitial
            )}
          </button>

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className={`absolute top-11 ${
                isRTL ? 'left-0' : 'right-0'
              } w-64 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xl z-50 animate-scaleUp text-slate-800`}
            >
              {/* Profile Card Header */}
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#273859] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    avatarInitial
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || t('nav.user_name', 'أحمد محمد')}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {user?.email || 'admin@odst.com'}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings?tab=profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'الملف الشخصي والحساب' : 'Edit Profile'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings?tab=security');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'الأمان وتغيير كلمة المرور' : 'Security & Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings?tab=lists');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'قوائم وبيانات النظام' : 'System Master Lists'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.settings', 'الإعدادات العامة')}</span>
                </button>
              </div>

              {/* Logout Button */}
              <div className="border-t border-slate-100 mt-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout', 'تسجيل الخروج')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


