import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  Users,
  Plane,
  LayoutGrid,
  Plus,
  SquarePen,
  RotateCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const nationalities = [
    { 
      country: isRTL ? 'المغرب' : 'Morocco', 
      count: isRTL ? '420 معتمر' : '420 Pilgrims', 
      width: '68%', 
      color: '#1e293b' 
    },
    { 
      country: isRTL ? 'تركيا' : 'Turkey', 
      count: isRTL ? '310 معتمر' : '310 Pilgrims', 
      width: '52%', 
      color: '#10b981' 
    },
    { 
      country: isRTL ? 'الجزائر' : 'Algeria', 
      count: isRTL ? '195 معتمر' : '195 Pilgrims', 
      width: '42%', 
      color: '#f59e0b' 
    },
    { 
      country: isRTL ? 'لبنان' : 'Lebanon', 
      count: isRTL ? '85 معتمر' : '85 Pilgrims', 
      width: '26%', 
      color: '#ef4444' 
    },
    { 
      country: isRTL ? 'تركيا' : 'Turkey', 
      count: isRTL ? '397 معتمر' : '397 Pilgrims', 
      width: '22%', 
      color: '#8da0b6' 
    },
  ];

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

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar: In RTL sits on the Right; In LTR sits on the Left */}
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.active_groups', 'المجموعات النشطة')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600">
                  <LayoutGrid className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[rgba(16,185,129,1)] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                107 {t('dashboard.active_groups_unit', 'مجموعة')}
              </div>
            </div>

            {/* Card 2: Total Pilgrims */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.total_pilgrims', 'إجمالي المعتمرين')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                1,247 {t('dashboard.total_pilgrims_unit', 'معتمر')}
              </div>
            </div>

            {/* Card 3: Incomplete Data Alerts */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.incomplete_alerts', 'تنبيهات البيانات الناقصة')}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#fef3c7] text-[#d97706] rounded-md">
                  {t('dashboard.incomplete_alerts_badge', 'مهم')}
                </span>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#ef4444] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                12 {t('dashboard.incomplete_alerts_unit', 'تنبيه')}
              </div>
            </div>

            {/* Card 4: Upcoming Flights */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {t('dashboard.upcoming_flights', 'الرحلات القادمة')}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-600">
                  <Plane className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-[28px] font-bold text-[#1e293b] tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                8 {t('dashboard.upcoming_flights_unit', 'رحلات')}
              </div>
            </div>
          </div>

          {/* Middle Row: Two Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Widget 1 (8 Cols): Distribution by Nationality */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="text-base font-bold text-[#0f172a] mb-7">
                {t('dashboard.nationalities_title', 'توزيع المعتمرين حسب الجنسية')}
              </h2>

              <div className="space-y-6">
                {nationalities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs sm:text-sm font-medium">
                    {/* Country Name */}
                    <span className="w-20 text-slate-800 shrink-0 font-medium">
                      {item.country}
                    </span>

                    {/* Progress Bar Track */}
                    <div className="flex-1 h-3 bg-[#f8fafc] border border-slate-100 rounded-full overflow-hidden flex justify-start">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: item.color,
                          width: item.width,
                        }}
                      />
                    </div>

                    {/* Pilgrim Count */}
                    <span className={`w-28 text-slate-800 font-bold shrink-0 ${isRTL ? 'text-left' : 'text-right'}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2 (4 Cols): Groups Status Donut */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <h2 className="text-sm font-bold text-[#0f172a] mb-4">
                {t('dashboard.groups_status_title', 'حالة المجموعات')}
              </h2>

              {/* Donut Chart Simulation */}
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="text-slate-100"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Completed Segment (Blue) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="text-[#3b82f6]"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - 0.75)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#0f172a]">
                    107
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    {t('dashboard.total_groups', 'إجمالي المجموعات')}
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-slate-700 font-medium">{t('common.completed', 'مكتمل')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    72 {t('dashboard.active_groups_unit', 'مجموعة')} (67%)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-slate-700 font-medium">{t('common.in_progress', 'قيد التجهيز')}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    25 {t('dashboard.active_groups_unit', 'مجموعة')} (23%)
                  </span>
                </div>

                <div className="flex items-center justify-between">
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
            <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <h2 className="text-base font-bold text-[#0f172a] mb-6">
                {t('dashboard.quick_actions_title', 'إجراءات سريعة')}
              </h2>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {/* Add New Group Button */}
                <button
                  onClick={() => navigate('/groups')}
                  className="w-full py-3.5 px-4 bg-[#1c2844] hover:bg-[#152037] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>{t('dashboard.add_group_btn', 'إضافة مجموعة جديدة')}</span>
                </button>

                {/* Update Pilgrims Statement Button */}
                <button
                  onClick={() => navigate('/groups')}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-[1.5px] border-[#1c2844] text-[#1c2844] font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <SquarePen className="w-4 h-4 shrink-0" />
                  <span>{t('dashboard.update_pilgrims_btn', 'تحديث بيان المعتمرين')}</span>
                </button>

                {/* Sync Data Button */}
                <button
                  onClick={() => { }}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>{t('dashboard.sync_data_btn', 'مزامنة البيانات')}</span>
                </button>
              </div>
            </div>

            {/* Latest Activities (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="text-base font-bold text-[#0f172a] mb-6">
                {t('dashboard.activities_title', 'آخر التحديثات والنشاطات')}
              </h2>

              <div className="space-y-3.5">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="px-5 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-100/70 transition"
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
