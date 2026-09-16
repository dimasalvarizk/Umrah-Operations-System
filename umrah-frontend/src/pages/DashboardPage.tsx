import { useState, useEffect } from 'react';
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
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchDashboardSummary, type DashboardStats } from '../services/dashboardApi';
import useCountUp from '../hooks/useCountUp';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const loadData = async (showNotification = false) => {
    try {
      const data = await fetchDashboardSummary();
      setStats(data);
      if (showNotification) {
        setSyncFeedback(
          isRTL
            ? 'تمت مزامنة البيانات بشكل فوري مع قواعد البيانات بنجاح!'
            : 'Real-time sync complete: Live data fetched from MySQL database!'
        );
        setTimeout(() => setSyncFeedback(null), 3500);
      }
    } catch (err) {
      console.warn('Dashboard real-time fetch fallback', err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);

    // Auto-polling for real-time live data updates
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleSyncData = async () => {
    setIsSyncing(true);
    await loadData(true);
    setIsSyncing(false);
  };

  // Animated stat values hooked strictly to real-time backend stats
  const activeGroupsVal = stats ? stats.activeGroups : 0;
  const totalPilgrimsVal = stats ? stats.totalPilgrims : 0;
  const incompleteAlertsVal = stats ? stats.incompleteAlerts : 0;
  const upcomingTripsVal = stats ? stats.upcomingTrips : 0;

  const animatedActiveGroups = useCountUp(activeGroupsVal, 1000, isLoaded);
  const animatedTotalPilgrims = useCountUp(totalPilgrimsVal, 1200, isLoaded);
  const animatedAlerts = useCountUp(incompleteAlertsVal, 800, isLoaded);
  const animatedUpcomingTrips = useCountUp(upcomingTripsVal, 800, isLoaded);

  const nationalities = stats?.nationalities || [];
  const activities = stats?.activities || [];

  // Donut chart parameters
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  const completedPercent = stats?.groupStatus?.completedPercent ?? 0;
  const inPrepPercent = stats?.groupStatus?.inPreparationPercent ?? 0;
  const pendingPercent = stats?.groupStatus?.pendingPercent ?? 0;
  const completedCount = stats?.groupStatus?.completed ?? 0;
  const inPrepCount = stats?.groupStatus?.inPreparation ?? 0;
  const pendingCount = stats?.groupStatus?.pending ?? 0;

  const strokeOffset = isLoaded ? circumference * (1 - (completedPercent / 100 || 0)) : circumference;

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

        {/* Sync Toast Feedback Banner */}
        {syncFeedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-center gap-2 text-emerald-800 text-xs sm:text-sm font-semibold transition-all animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Dashboard Main Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Top Row: 4 Metric Cards (2x2 on Mobile, 4 Columns on Large Screens) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* Card 1: Active Groups */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between min-h-[120px] sm:h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  {t('dashboard.active_groups', 'المجموعات النشطة')}
                </span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110 shrink-0">
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className={`text-lg xs:text-xl sm:text-2xl lg:text-[28px] font-bold text-[#10b981] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedActiveGroups} <span className="text-xs sm:text-sm font-medium">{t('dashboard.active_groups_unit', 'مجموعة')}</span>
              </div>
            </div>

            {/* Card 2: Total Pilgrims */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between min-h-[120px] sm:h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  {t('dashboard.total_pilgrims', 'إجمالي المعتمرين')}
                </span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110 shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className={`text-lg xs:text-xl sm:text-2xl lg:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedTotalPilgrims.toLocaleString()} <span className="text-xs sm:text-sm font-medium">{t('dashboard.total_pilgrims_unit', 'معتمر')}</span>
              </div>
            </div>

            {/* Card 3: Incomplete Data Alerts */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between min-h-[120px] sm:h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  {t('dashboard.incomplete_alerts', 'تنبيهات البيانات الناقصة')}
                </span>
                {incompleteAlertsVal > 0 && (
                  <span className="px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold bg-[#fef3c7] text-[#d97706] rounded-md animate-pulse shrink-0">
                    {t('dashboard.incomplete_alerts_badge', 'مهم')}
                  </span>
                )}
              </div>
              <div className={`text-lg xs:text-xl sm:text-2xl lg:text-[28px] font-bold text-[#ef4444] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedAlerts} <span className="text-xs sm:text-sm font-medium">{t('dashboard.incomplete_alerts_unit', 'تنبيه')}</span>
              </div>
            </div>

            {/* Card 4: Upcoming Flights */}
            <div
              className={`bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between min-h-[120px] sm:h-36 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  {t('dashboard.upcoming_flights', 'الرحلات القادمة')}
                </span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600 transition-transform hover:scale-110 shrink-0">
                  <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className={`text-lg xs:text-xl sm:text-2xl lg:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {animatedUpcomingTrips} <span className="text-xs sm:text-sm font-medium">{t('dashboard.upcoming_flights_unit', 'رحلات')}</span>
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
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isRTL ? 'مباشر من قاعدة البيانات' : 'Live from Database'}
                </span>
              </div>

              {nationalities.length === 0 ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <FolderOpen className="w-8 h-8 text-slate-300" />
                  <p className="text-sm font-medium">
                    {isRTL ? 'لا توجد مجموعات مسجلة بعد' : 'No pilgrim groups registered yet'}
                  </p>
                  <button
                    onClick={() => navigate('/groups')}
                    className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    {isRTL ? '+ إضافة مجموعة الآن' : '+ Add Group Now'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {nationalities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs sm:text-sm font-medium group">
                      {/* Country Name */}
                      <span className="w-24 text-slate-800 shrink-0 font-medium group-hover:text-emerald-700 transition-colors">
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
              )}
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
                    {completedCount} {t('dashboard.active_groups_unit', 'مجموعة')} ({completedPercent}%)
                  </span>
                </div>

                <div className="flex items-center justify-between hover:bg-slate-50 p-1 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-slate-700 font-medium">{t('common.in_progress', 'قيد التجهيز')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    {inPrepCount} {t('dashboard.active_groups_unit', 'مجموعة')} ({inPrepPercent}%)
                  </span>
                </div>

                <div className="flex items-center justify-between hover:bg-slate-50 p-1 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                    <span className="text-slate-700 font-medium">{t('common.pending', 'معلق')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    {pendingCount} {t('dashboard.active_groups_unit', 'مجموعة')} ({pendingPercent}%)
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
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  <RotateCw className={`w-4 h-4 text-slate-600 shrink-0 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                  <span>{isSyncing ? (isRTL ? 'جاري المزامنة...' : 'Syncing Live Data...') : t('dashboard.sync_data_btn', 'مزامنة البيانات')}</span>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-[#0f172a]">
                  {t('dashboard.activities_title', 'آخر التحديثات والنشاطات')}
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {isRTL ? 'سجل العمليات المباشر' : 'Live Activity Feed'}
                </span>
              </div>

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
                        {isRTL ? (act.titleAr || act.title) : act.title}
                      </span>
                    </div>

                    <span className="text-slate-400 text-xs shrink-0 font-normal">
                      {isRTL ? (act.timeAr || act.time) : act.time}
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
