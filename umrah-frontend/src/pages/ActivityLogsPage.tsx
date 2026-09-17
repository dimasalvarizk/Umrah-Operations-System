import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import useCountUp from '../hooks/useCountUp';
import {
  Search,
  RefreshCw,
  Download,
  Trash2,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  getActivityLogsApi,
  getActivityLogStatsApi,
  clearAllActivityLogsApi,
  type ActivityLogItem,
  type ActivityLogStats,
} from '../services/activityLogsApi';

export default function ActivityLogsPage() {
  const { direction, t, isRTL, language } = useLanguage();
  const { isSuperAdmin } = usePermissions();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [stats, setStats] = useState<ActivityLogStats>({
    total: 0,
    createdCount: 0,
    updatedCount: 0,
    deletedCount: 0,
    statusChangesCount: 0,
    todayCount: 0,
    topUsers: [],
    moduleBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState('ALL');

  // Modals
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<ActivityLogItem | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load Data
  const loadData = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      const [logsRes, statsRes] = await Promise.all([
        getActivityLogsApi({ limit: 200 }),
        getActivityLogStatsApi(),
      ]);
      setLogs(logsRes.logs);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      if (showLoadingState) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);

    const handleRefreshEvent = () => {
      loadData(false);
    };

    window.addEventListener('umrah_activity_logged', handleRefreshEvent);
    window.addEventListener('umrah_notification_refresh', handleRefreshEvent);
    window.addEventListener('focus', handleRefreshEvent);

    // Periodic live sync every 10 seconds
    const interval = setInterval(() => {
      loadData(false);
    }, 10000);

    return () => {
      window.removeEventListener('umrah_activity_logged', handleRefreshEvent);
      window.removeEventListener('umrah_notification_refresh', handleRefreshEvent);
      window.removeEventListener('focus', handleRefreshEvent);
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handleClearAll = async () => {
    try {
      setIsClearing(true);
      await clearAllActivityLogsApi();
      setShowClearConfirmModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    } finally {
      setIsClearing(false);
    }
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesUser = log.userName?.toLowerCase().includes(query);
        const matchesDescEn = log.descriptionEn?.toLowerCase().includes(query);
        const matchesDescAr = log.descriptionAr?.toLowerCase().includes(query);
        const matchesEntity = log.entityName?.toLowerCase().includes(query) || log.entityId?.toLowerCase().includes(query);
        if (!matchesUser && !matchesDescEn && !matchesDescAr && !matchesEntity) {
          return false;
        }
      }

      // Module
      if (selectedModule !== 'ALL' && log.module.toLowerCase() !== selectedModule.toLowerCase()) {
        return false;
      }

      // Action
      if (selectedAction !== 'ALL' && log.action.toUpperCase() !== selectedAction.toUpperCase()) {
        return false;
      }

      // User
      if (selectedUser !== 'ALL' && log.userName !== selectedUser) {
        return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedModule, selectedAction, selectedUser]);

  // Unique Users List for Filter
  const uniqueUsers = useMemo(() => {
    const userSet = new Set<string>();
    logs.forEach((log) => {
      if (log.userName) userSet.add(log.userName);
    });
    return Array.from(userSet);
  }, [logs]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['ID', 'Timestamp', 'User Name', 'User Role', 'Action', 'Module', 'Entity Name', 'Location', 'IP Address', 'Description'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.createdAt ? new Date(log.createdAt).toISOString() : '',
      `"${(log.userName || '').replace(/"/g, '""')}"`,
      `"${(log.userRole || '').replace(/"/g, '""')}"`,
      log.action,
      log.module,
      `"${(log.entityName || '').replace(/"/g, '""')}"`,
      `"${(log.location || (log.loginCity && log.loginCountry ? `${log.loginCity}, ${log.loginCountry}` : log.loginCity || log.loginCountry || '')).replace(/"/g, '""')}"`,
      `"${(log.ipAddress ? log.ipAddress.split(',')[0].trim() : '').replace(/"/g, '""')}"`,
      `"${(language === 'ar' ? log.descriptionAr || log.descriptionEn : log.descriptionEn || log.descriptionAr || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Module Details
  const getModuleLabel = (module: string) => {
    switch (module.toLowerCase()) {
      case 'groups':
        return language === 'ar' ? 'المجموعات' : 'Groups';
      case 'contracts':
        return language === 'ar' ? 'الاتفاقيات' : 'Hotel Agreements';
      case 'trips':
        return language === 'ar' ? 'الرحلات' : 'Trips';
      case 'transport':
        return language === 'ar' ? 'النقل' : 'Transportation';
      case 'hotels':
        return language === 'ar' ? 'الفنادق' : 'Hotels';
      case 'notes':
        return language === 'ar' ? 'الملاحظات' : 'Notes';
      case 'team':
        return language === 'ar' ? 'فريق العمل' : 'Team Members';
      case 'settings':
        return language === 'ar' ? 'الإعدادات والقوائم' : 'Settings & Lists';
      case 'auth':
        return language === 'ar' ? 'الأمان والحسابات' : 'Security & Auth';
      default:
        return language === 'ar' ? 'النظام' : 'System';
    }
  };

  // Helper for Action Badge
  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            {t('logs.action_create')}
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            {t('logs.action_update')}
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            {t('logs.action_delete')}
          </span>
        );
      case 'STATUS_CHANGE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            {t('logs.action_status')}
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
            {action}
          </span>
        );
    }
  };

  // Helper for Relative Time
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return language === 'ar' ? 'الآن' : 'Just now';
      if (diffMinutes < 60) return language === 'ar' ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
      if (diffHours < 24) return language === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
      if (diffDays < 7) return language === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // KPI Animated values
  const countTotal = useCountUp(stats.total, 800);
  const countCreates = useCountUp(stats.createdCount, 800);
  const countUpdates = useCountUp(stats.updatedCount, 800);
  const countDeletes = useCountUp(stats.deletedCount, 800);

  // Access Control Screen if Not Super Admin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row font-sans" dir={direction}>
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab="activity-logs"
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            title={t('logs.title', 'سجل النشاطات')}
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1 p-6 md:p-12 flex items-center justify-center">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {t('logs.restricted_access')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {t('logs.restricted_desc')}
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-slate-800 transition-all text-sm shadow-sm"
              >
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t('nav.dashboard')}
              </a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row font-sans" dir={direction}>
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="activity-logs"
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          title={isRTL ? 'سجل النشاطات وتتبع العمليات' : 'Activity Logs & Audit Trail'}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Logs */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <p className="text-xs font-semibold text-slate-500">
                {t('logs.stat_total')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {countTotal}
              </p>
            </div>

            {/* Creates */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <p className="text-xs font-semibold text-emerald-600">
                {t('logs.stat_creates')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
                {countCreates}
              </p>
            </div>

            {/* Updates */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <p className="text-xs font-semibold text-amber-600">
                {t('logs.stat_updates')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
                {countUpdates}
              </p>
            </div>

            {/* Deletes */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <p className="text-xs font-semibold text-rose-600">
                {t('logs.stat_deletes')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-rose-700 mt-1">
                {countDeletes}
              </p>
            </div>
          </div>

          {/* Controls Bar: Search, Filters & Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
              {/* Search input */}
              <div className="lg:col-span-4 relative">
                <input
                  type="text"
                  placeholder={t('logs.quick_search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-slate-50/70 border border-slate-200/90 rounded-xl ${
                    isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
                  } py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0f172a] focus:bg-white transition`}
                />
                <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-2.5' : 'right-2.5'} cursor-pointer`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Module Filter */}
              <div className="lg:col-span-3">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-[#0f172a] focus:bg-white transition cursor-pointer"
                >
                  <option value="ALL">{t('logs.filter_all_modules')}</option>
                  <option value="groups">{t('logs.module_groups')}</option>
                  <option value="contracts">{t('logs.module_contracts')}</option>
                  <option value="trips">{t('logs.module_trips')}</option>
                  <option value="transport">{t('logs.module_transport')}</option>
                  <option value="hotels">{t('logs.module_hotels')}</option>
                  <option value="notes">{t('logs.module_notes')}</option>
                  <option value="team">{t('logs.module_team')}</option>
                  <option value="settings">{t('logs.module_settings')}</option>
                </select>
              </div>

              {/* Action Filter */}
              <div className="lg:col-span-3">
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-[#0f172a] focus:bg-white transition cursor-pointer"
                >
                  <option value="ALL">{t('logs.filter_all_actions')}</option>
                  <option value="CREATE">{t('logs.action_create')}</option>
                  <option value="UPDATE">{t('logs.action_update')}</option>
                  <option value="DELETE">{t('logs.action_delete')}</option>
                  <option value="STATUS_CHANGE">{t('logs.action_status')}</option>
                </select>
              </div>

              {/* User Filter */}
              <div className="lg:col-span-2">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-[#0f172a] focus:bg-white transition cursor-pointer"
                >
                  <option value="ALL">{t('logs.filter_all_users')}</option>
                  {uniqueUsers.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                {language === 'ar'
                  ? `عرض ${filteredLogs.length} من إجمالي ${logs.length} سجل`
                  : `Showing ${filteredLogs.length} of ${logs.length} records`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                  <span>{language === 'ar' ? 'تحديث' : 'Refresh'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-[#0f172a] hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('logs.export_csv')}</span>
                </button>

                <button
                  onClick={() => setShowClearConfirmModal(true)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('logs.clear_all')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-16 text-center space-y-3">
                <RefreshCw className="w-6 h-6 mx-auto text-slate-400 animate-spin" />
                <p className="text-xs font-medium text-slate-400">{t('common.loading')}</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <h3 className="text-sm font-bold text-slate-800">
                  {t('logs.no_logs_found')}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {t('logs.no_logs_desc')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 font-bold text-slate-500">
                      <th className="py-3 px-4 text-start">{t('logs.col_user')}</th>
                      <th className="py-3 px-4 text-start">{t('logs.col_action')}</th>
                      <th className="py-3 px-4 text-start">{t('logs.col_module')}</th>
                      <th className="py-3 px-4 text-start">{t('logs.col_description')}</th>
                      <th className="py-3 px-4 text-start">{t('logs.col_location')}</th>
                      <th className="py-3 px-4 text-start">{t('logs.col_date')}</th>
                      <th className="py-3 px-4 text-center">{t('logs.col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLogs.map((log) => {
                      const cleanIp = log.ipAddress ? log.ipAddress.split(',')[0].trim() : null;
                      const displayLocation = log.location || (log.loginCity && log.loginCountry ? (log.loginCity === 'Local' ? 'Localhost' : `${log.loginCity}, ${log.loginCountry}`) : (log.loginCity || log.loginCountry || (cleanIp === '127.0.0.1' ? 'Localhost' : null)));

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          {/* User */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {(log.userName || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {log.userName || 'System'}
                                </p>
                                <span className="text-[11px] text-slate-400">
                                  {log.userRole || 'Staff'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Action Badge */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getActionBadge(log.action)}
                          </td>

                          {/* Module */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
                              {getModuleLabel(log.module)}
                            </span>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-4 max-w-md">
                            <p className="font-medium text-slate-800 leading-relaxed">
                              {language === 'ar'
                                ? log.descriptionAr || log.descriptionEn
                                : log.descriptionEn || log.descriptionAr}
                            </p>
                            {log.entityName && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                <span>{log.entityName}</span>
                                {log.entityId && log.entityId !== log.entityName && (
                                  <span className="opacity-70 font-mono"> ({log.entityId})</span>
                                )}
                              </p>
                            )}
                          </td>

                          {/* Location (City, Country & Clean IP) */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {displayLocation ? (
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">
                                  {displayLocation}
                                </p>
                                {cleanIp && (
                                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                    {cleanIp}
                                  </span>
                                )}
                              </div>
                            ) : cleanIp ? (
                              <span className="text-xs text-slate-600 font-mono">{cleanIp}</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Timestamp */}
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            <div>{formatTime(log.createdAt)}</div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => setSelectedLogForDetails(log)}
                              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition font-medium cursor-pointer text-xs"
                            >
                              {t('logs.view_details')}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Log Details Modal */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scaleIn"
            dir={direction}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('logs.details_modal_title')}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: #{selectedLogForDetails.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">{t('logs.col_user')}</span>
                  <p className="font-bold text-slate-900">
                    {selectedLogForDetails.userName || 'Anonymous'}
                  </p>
                  <span className="text-xs text-slate-500 font-semibold">
                    {selectedLogForDetails.userRole || 'Staff'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">{t('logs.col_date')}</span>
                  <p className="font-bold text-slate-900">
                    {selectedLogForDetails.createdAt ? new Date(selectedLogForDetails.createdAt).toLocaleString() : '-'}
                  </p>
                  <span className="text-xs text-slate-400">
                    {formatTime(selectedLogForDetails.createdAt)}
                  </span>
                </div>
              </div>

              {/* Status and Module */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t('logs.col_action')}</span>
                  {getActionBadge(selectedLogForDetails.action)}
                </div>
                <div className="text-end">
                  <span className="text-xs text-slate-400 block mb-1">{t('logs.col_module')}</span>
                  <span className="font-semibold text-slate-800">
                    {getModuleLabel(selectedLogForDetails.module)}
                  </span>
                </div>
              </div>

              {/* Target Entity & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">{t('logs.entity_name')}</span>
                  <p className="font-bold text-slate-900">
                    {selectedLogForDetails.entityName || selectedLogForDetails.entityId || '-'}
                  </p>
                  {selectedLogForDetails.entityId && (
                    <p className="text-xs text-slate-400 font-mono">
                      {t('logs.target_id')}: {selectedLogForDetails.entityId}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">{t('logs.col_location')}</span>
                  <p className="font-bold text-slate-900">
                    {selectedLogForDetails.location || (selectedLogForDetails.loginCity && selectedLogForDetails.loginCountry ? (selectedLogForDetails.loginCity === 'Local' ? 'Localhost' : `${selectedLogForDetails.loginCity}, ${selectedLogForDetails.loginCountry}`) : (selectedLogForDetails.loginCity || selectedLogForDetails.loginCountry || (selectedLogForDetails.ipAddress === '127.0.0.1' ? 'Localhost' : '-')))}
                  </p>
                  {selectedLogForDetails.ipAddress && (
                    <p className="text-xs text-slate-400 font-mono">
                      IP: {selectedLogForDetails.ipAddress.split(',')[0].trim()}
                    </p>
                  )}
                </div>
              </div>

              {/* Description Arabic & English */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    الوصف (باللغة العربية):
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {selectedLogForDetails.descriptionAr || selectedLogForDetails.descriptionEn || '-'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100" dir="ltr">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Description (English):
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {selectedLogForDetails.descriptionEn || selectedLogForDetails.descriptionAr || '-'}
                  </p>
                </div>
              </div>

              {/* Technical Metadata */}
              {selectedLogForDetails.metadata && (
                <div className="space-y-1" dir="ltr">
                  <span className="text-xs text-slate-400 font-semibold">{t('logs.system_meta')}</span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto">
                    {JSON.stringify(selectedLogForDetails.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="px-5 py-2 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer text-xs"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl p-6 text-center space-y-4 animate-scaleIn"
            dir={direction}
          >
            <h3 className="text-lg font-bold text-slate-900">
              {t('logs.clear_confirm_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t('logs.clear_confirm_desc')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                disabled={isClearing}
                className="flex-1 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="flex-1 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isClearing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{t('logs.clear_all')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
