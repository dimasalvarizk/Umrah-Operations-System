import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  Users,
  Plane,
  LayoutGrid,
  Plus,
  SquarePen,
  RotateCw,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Custom Count-Up Animation Hook for numbers
function useCountUp(target: number, duration: number = 1000, isStarted: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isStarted) {
      setCount(0);
      return;
    }
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, isStarted]);

  return count;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations right after mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Animated stat values
  const animatedActiveGroups = useCountUp(107, 1200, isLoaded);
  const animatedTotalPilgrims = useCountUp(1247, 1400, isLoaded);
  const animatedAlerts = useCountUp(12, 1000, isLoaded);
  const animatedUpcomingTrips = useCountUp(8, 900, isLoaded);

  const countriesList = useMemo(() => {
    try {
      const saved = localStorage.getItem('system_list_countries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      { nameEn: 'Indonesia', nameAr: 'إندونيسيا' },
      { nameEn: 'Pakistan', nameAr: 'باكستان' },
      { nameEn: 'Egypt', nameAr: 'مصر' },
      { nameEn: 'Turkey', nameAr: 'تركيا' },
      { nameEn: 'Morocco', nameAr: 'المغرب' },
      { nameEn: 'Algeria', nameAr: 'الجزائر' },
    ];
  }, []);

  const COLOR_PALETTE = ['#10b981', '#1e293b', '#f59e0b', '#0284c7', '#8b5cf6', '#ef4444', '#0d9488'];
  const SAMPLE_COUNTS = [485, 340, 220, 160, 110, 85, 60];
  const SAMPLE_WIDTHS = ['78%', '62%', '46%', '35%', '26%', '20%', '16%'];

  const nationalities = countriesList.slice(0, 6).map((item, idx) => ({
    country: isRTL ? (item.nameAr || item.country) : (item.nameEn || item.country),
    targetCount: SAMPLE_COUNTS[idx] || (90 - idx * 10),
    width: SAMPLE_WIDTHS[idx] || '20%',
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    delayMs: 150 * (idx + 1),
  }));

  const activities = [
    {
      id: 1,
      badge: t('dashboard.badge_completed', 'مكتمل'),
      badgeColor: 'bg-emerald-500 text-white',
      title: isRTL
        ? 'تم اكتمال تصاريح مجموعة الأنوار 1 بنجاح'
        : 'Al-Anwar 1 group permits completed successfully',
      time: isRTL ? 'منذ ٥ دقائق' : '5 minutes ago',
    },
    {
      id: 2,
      badge: t('dashboard.badge_housing', 'تسكين'),
      badgeColor: 'bg-[#1e293b] text-white',
      title: isRTL
        ? 'تم تسجيل فندق مكة 1 لإقامة الفوج الثالث'
        : 'Makkah Hotel 1 registered for third group accommodation',
      time: isRTL ? 'منذ ٢٠ دقيقة' : '20 minutes ago',
    },
    {
      id: 3,
      badge: t('dashboard.badge_alert', 'تنبيه'),
      badgeColor: 'bg-amber-500 text-white',
      title: isRTL
        ? 'تنبيه: بيان الرحلة SV-124 للمجموعة الرابعة يحتاج لتحديث'
        : 'Alert: Trip SV-124 statement for fourth group needs update',
      time: isRTL ? 'منذ ساعة' : '1 hour ago',
    },
    {
      id: 4,
      badge: t('dashboard.badge_sync', 'مزامنة'),
      badgeColor: 'bg-[#64748b] text-white',
      title: isRTL
        ? 'تمت مزامنة بيانات المسار الإلكتروني مع وزارة الحج'
        : 'E-route data synced with Ministry of Hajj',
      time: isRTL ? 'منذ ساعتين' : '2 hours ago',
    },
  ];

  // Donut chart parameters
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  // 67% filled target
  const strokeOffset = isLoaded ? circumference * (1 - 0.72) : circumference;

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="dashboard"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Navbar
          title={t('dashboard.title', 'لوحة التحكم الرئيسية')}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dashboard Main Body */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Top Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Active Groups */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.active_groups', 'المجموعات النشطة')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110">
                  <LayoutGrid className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#10b981] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedActiveGroups} {t('dashboard.active_groups_unit', 'مجموعة')}
              </div>
            </div>

            {/* Card 2: Total Pilgrims */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.total_pilgrims', 'إجمالي المعتمرين')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedTotalPilgrims.toLocaleString()} {t('dashboard.total_pilgrims_unit', 'معتمر')}
              </div>
            </div>

            {/* Card 3: Incomplete Data Alerts */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.incomplete_alerts', 'تنبيهات البيانات الناقصة')}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#fef3c7] text-[#d97706] rounded-md animate-pulse">
                  {t('dashboard.incomplete_alerts_badge', 'مهم')}
                </span>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#ef4444] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedAlerts} {t('dashboard.incomplete_alerts_unit', 'تنبيه')}
              </div>
            </div>

            {/* Card 4: Upcoming Flights */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.upcoming_flights', 'الرحلات القادمة')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110">
                  <Plane className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedUpcomingTrips} {t('dashboard.upcoming_flights_unit', 'رحلات')}
              </div>
            </div>
          </div>

          {/* Middle Row: Two Animated Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Widget 1 (8 Cols): Distribution by Nationality with Smooth Bar Fill Animation */}
            <div
              className={`lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <span>{t('dashboard.nationalities_title', 'توزيع المعتمرين حسب الجنسية')}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {isRTL ? 'تحديث فوري' : 'Live Analytics'}
                </span>
              </div>

              <div className="space-y-6">
                {nationalities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs sm:text-sm font-medium group">
                    {/* Country Name */}
                    <span className="w-20 text-slate-800 shrink-0 font-medium group-hover:text-emerald-700 transition-colors">
                      {item.country}
                    </span>

                    {/* Progress Bar Track with Smooth Fill Animation */}
                    <div className="flex-1 h-3.5 bg-[#f8fafc] border border-slate-100 rounded-full overflow-hidden flex justify-start relative shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:brightness-110"
                        style={{
                          backgroundColor: item.color,
                          width: isLoaded ? item.width : '0%',
                          transitionDelay: `${item.delayMs}ms`,
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {/* Shimmer Light Accent Effect */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full opacity-60"
                          style={{
                            transform: isLoaded ? 'translateX(100%)' : 'translateX(-100%)',
                            transition: `transform 1.2s ease-out ${item.delayMs + 200}ms`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Pilgrim Count */}
                    <span className={`w-28 text-slate-800 font-bold shrink-0 tabular-nums ${isRTL ? 'text-left' : 'text-right'} group-hover:scale-105 transition-transform`}>
                      {item.targetCount} {isRTL ? 'معتمر' : 'Pilgrims'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2 (4 Cols): Groups Status Donut with Stroke Draw Animation */}
            <div
              className={`lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <h2 className="text-sm font-bold text-[#0f172a] mb-4">
                {t('dashboard.groups_status_title', 'حالة المجموعات')}
              </h2>

              {/* Animated Donut Chart */}
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-44 h-44 transform -rotate-90 filter drop-shadow-xs" viewBox="0 0 120 120">
                  {/* Background Track Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="text-slate-100"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Animated Blue/Completed Primary Arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="text-[#3b82f6]"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    style={{
                      transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: '250ms',
                    }}
                  />
                </svg>

                {/* Center Stats with Zoom & Count Animation */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${
                    isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <span className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                    {animatedActiveGroups}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    {t('dashboard.total_groups', 'إجمالي المجموعات')}
                  </span>
                </div>
              </div>

              {/* Legend List with Subtle Fade-In */}
              <div
                className={`space-y-2.5 pt-2 border-t border-slate-100 text-xs transition-all duration-500 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="flex items-center justify-between hover:bg-slate-50 p-1 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-slate-700 font-medium">{t('common.completed', 'مكتمل')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    72 {t('dashboard.active_groups_unit', 'مجموعة')} (67%)
                  </span>
                </div>

                <div className="flex items-center justify-between hover:bg-slate-50 p-1 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-slate-700 font-medium">{t('common.in_progress', 'قيد التجهيز')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    25 {t('dashboard.active_groups_unit', 'مجموعة')} (23%)
                  </span>
                </div>

                <div className="flex items-center justify-between hover:bg-slate-50 p-1 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                    <span className="text-slate-700 font-medium">{t('common.pending', 'معلق')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    10 {t('dashboard.active_groups_unit', 'مجموعة')} (10%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Quick Actions & Latest Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Actions (4 Cols) */}
            <div
              className={`lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <h2 className="text-base font-bold text-[#0f172a] mb-6">
                {t('dashboard.quick_actions_title', 'إجراءات سريعة')}
              </h2>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {/* Add New Group Button */}
                <button
                  onClick={() => navigate('/groups')}
                  className="w-full py-3.5 px-4 bg-[#1c2844] hover:bg-[#152037] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>{t('dashboard.add_group_btn', 'إضافة مجموعة جديدة')}</span>
                </button>

                {/* Update Pilgrims Statement Button */}
                <button
                  onClick={() => navigate('/groups')}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-[1.5px] border-[#1c2844] text-[#1c2844] font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <SquarePen className="w-4 h-4 shrink-0" />
                  <span>{t('dashboard.update_pilgrims_btn', 'تحديث بيان المعتمرين')}</span>
                </button>

                {/* Sync Data Button */}
                <button
                  onClick={() => { }}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>{t('dashboard.sync_data_btn', 'مزامنة البيانات')}</span>
                </button>
              </div>
            </div>

            {/* Latest Activities (8 Cols) */}
            <div
              className={`lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h2 className="text-base font-bold text-[#0f172a] mb-6">
                {t('dashboard.activities_title', 'آخر التحديثات والنشاطات')}
              </h2>

              <div className="space-y-3.5">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="px-5 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-100/70 transition hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`px-3 py-1 rounded-md text-[11px] font-bold shrink-0 ${act.badgeColor}`}>
                        {act.badge}
                      </span>
                      <span className="text-slate-800 font-medium truncate">
                        {act.title}
                      </span>
                    </div>

                    <span className="text-slate-400 text-xs shrink-0 font-normal">
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

