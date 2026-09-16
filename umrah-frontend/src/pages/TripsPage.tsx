import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  Search,
  Plus,
  Check,
} from 'lucide-react';
import TripDetailsModal, { type TripItem } from '../components/trips/TripDetailsModal';
import AddTripModal from '../components/trips/AddTripModal';
import TripStatusSelector, { type TripStatusType } from '../components/trips/TripStatusSelector';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import useCountUp from '../hooks/useCountUp';

import {
  getTripsApi,
  createTripApi,
  updateTripApi,
  updateTripStatusApi,
  deleteTripApi,
} from '../services/tripsApi';

export default function TripsPage() {
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [searchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripItem | null>(null);

  const [tripsList, setTripsList] = useState<TripItem[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_trips_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchTrips = useCallback(async () => {
    try {
      const { trips } = await getTripsApi({ search: searchQuery });
      if (Array.isArray(trips)) {
        setTripsList(trips);
      }
    } catch {
      // Offline fallback keeps existing list
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    localStorage.setItem('umrah_trips_list', JSON.stringify(tripsList));
  }, [tripsList]);

  // Deep-linking from Notification Center URL query param
  useEffect(() => {
    const tripIdParam =
      searchParams.get('tripId') ||
      searchParams.get('id') ||
      searchParams.get('code');

    if (tripIdParam && tripsList.length > 0) {
      const matched = tripsList.find(
        (t) =>
          String(t.id) === String(tripIdParam) ||
          (t.code && t.code.toLowerCase() === tripIdParam.toLowerCase()) ||
          (t.programName && t.programName.toLowerCase().includes(tripIdParam.toLowerCase())) ||
          (t.routeName && t.routeName.toLowerCase().includes(tripIdParam.toLowerCase()))
      );
      if (matched) {
        setSelectedTrip(matched);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, tripsList]);

  // Listen for custom real-time events across windows / components
  useEffect(() => {
    const handleOpenRecord = (e: any) => {
      if (e.detail && (e.detail.type === 'trip' || e.detail.tripId)) {
        const tId = e.detail.tripId || e.detail.referenceId || e.detail.id;
        const matched = tripsList.find(
          (t) => String(t.id) === String(tId) || t.code === tId
        );
        if (matched) {
          setSelectedTrip(matched);
          setIsDetailsModalOpen(true);
        }
      }
    };

    const handleRefresh = () => {
      fetchTrips();
    };

    window.addEventListener('umrah_open_record', handleOpenRecord);
    window.addEventListener('umrah_notification_refresh', handleRefresh);

    return () => {
      window.removeEventListener('umrah_open_record', handleOpenRecord);
      window.removeEventListener('umrah_notification_refresh', handleRefresh);
    };
  }, [tripsList, fetchTrips]);

  const handleStatusChange = async (tripId: string, newStatus: TripStatusType) => {
    setTripsList((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTripStatusApi(tripId, newStatus);
    } catch {}
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const inProgress = tripsList.filter((t) => t.status === 'قيد التنفيذ').length;
    const completed = tripsList.filter((t) => t.status === 'مكتمل').length;
    const pending = tripsList.filter((t) => t.status === 'معلق').length;
    const total = tripsList.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;

    return { inProgress, completed, pending, total, completionRate, inProgressRate };
  }, [tripsList]);

  // Animated stat values
  const animatedInProgress = useCountUp(stats.inProgress, 800, isLoaded);
  const animatedCompleted = useCountUp(stats.completed, 1000, isLoaded);
  const animatedTotal = useCountUp(stats.total, 1200, isLoaded);
  const animatedCompletionRate = useCountUp(stats.completionRate, 1000, isLoaded);

  const filteredTrips = useMemo(() => {
    return tripsList.filter((trip) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        trip.code.toLowerCase().includes(q) ||
        trip.routeName.toLowerCase().includes(q) ||
        trip.guideName.toLowerCase().includes(q) ||
        trip.status.toLowerCase().includes(q)
      );
    });
  }, [tripsList, searchQuery]);

  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  const confirmDelete = async () => {
    if (tripToDelete) {
      const id = tripToDelete;
      setTripsList((prev) => prev.filter((t) => t.id !== id));
      setTripToDelete(null);
      setIsDeleteSuccessOpen(true);
      try {
        await deleteTripApi(id);
        window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      } catch {}
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="trips"
      />

      {/* Main Page Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={t('trips.title', 'إدارة الرحلات والتفويج')}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">
          {/* 3 Top Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Trips In Progress */}
            <div
              className={`bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between space-y-4 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold text-[#0f172a]">
                  {t('trips.in_progress_title', 'رحلات قيد التنفيذ')}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#fef9c3] text-[#a16207] animate-pulse">
                  {t('trips.active_now_badge', 'Active Now')}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#f59e0b] tracking-tight">
                  {animatedInProgress} {isRTL ? 'رحلات' : 'Trips'}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal">
                  {t('trips.buses_trains_sub', 'Haramain Buses & Trains')}
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex relative shadow-inner">
                <div
                  className="bg-[#f59e0b] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: isLoaded ? `${Math.max(stats.inProgressRate, stats.inProgress > 0 ? 15 : 0)}%` : '0%',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full opacity-60"
                    style={{
                      transform: isLoaded ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 1.2s ease-out 300ms',
                    }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-normal">
                {t('trips.supervisor_monitored', 'Under field operations supervisor monitoring')}
              </div>
            </div>

            {/* Card 2: Completed Trips */}
            <div
              className={`bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between space-y-4 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold text-[#0f172a]">
                  {t('trips.completed_title', 'رحلات منتهية بنجاح')}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d]">
                  {t('common.completed', 'Completed')}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#10b981] tracking-tight">
                  {animatedCompleted} {isRTL ? 'رحلة' : 'Trips'}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal">
                  {animatedCompletionRate}% {isRTL ? 'نسبة الإنجاز' : 'Daily Completion Rate'}
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex relative shadow-inner">
                <div
                  className="bg-[#10b981] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: isLoaded ? `${Math.max(stats.completionRate, stats.completed > 0 ? 15 : 0)}%` : '0%',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full opacity-60"
                    style={{
                      transform: isLoaded ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 1.2s ease-out 400ms',
                    }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-normal">
                {t('trips.dispatch_rate_sub', 'Excellent dispatch rate with no issues')}
              </div>
            </div>

            {/* Card 3: Total Programs */}
            <div
              className={`bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 transform flex flex-col justify-between space-y-4 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold text-[#0f172a]">
                  {t('trips.total_programs_title', 'إجمالي البرامج والرحلات')}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#e0f2fe] text-[#0284c7]">
                  {t('common.all', 'All')}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                  {animatedTotal} {isRTL ? 'برنامجاً' : 'Programs'}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal">
                  {t('trips.active_operation_prog', 'Active Operation Program')}
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex relative shadow-inner">
                <div
                  className="bg-[#2563eb] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: isLoaded ? '100%' : '0%',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full opacity-60"
                    style={{
                      transform: isLoaded ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 1.2s ease-out 500ms',
                    }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-normal">
                {t('trips.realtime_update_sub', 'Real-time update for assigned trips')}
              </div>
            </div>
          </div>

          {/* Table Card Section */}
          <div
            className={`bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 transition-all duration-500 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '350ms' }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
                {t('trips.current_schedule', 'Current Trip Operation Schedule')}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {!isReadOnly && (
                  <button
                    onClick={() => {
                      setEditingTrip(null);
                      setIsAddTripOpen(true);
                    }}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer active:scale-[0.99] whitespace-nowrap order-2 sm:order-1"
                  >
                    <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span>{t('trips.add_trip', 'Add Trip')}</span>
                  </button>
                )}

                <div className="relative flex-1 sm:flex-initial order-1 sm:order-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('trips.search_placeholder', 'Search for a trip...')}
                    className={`bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 w-full sm:w-64 shadow-2xs ${
                      isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                    }`}
                  />
                  <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                    isRTL ? 'left-3' : 'right-3'
                  }`} />
                </div>
              </div>
            </div>

            {/* Trips Table */}
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b border-slate-200/80 text-xs font-bold text-slate-600 bg-[#f8fafc]">
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.trip_number', 'رقم الرحلة')}</th>
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.program_route', 'اسم البرنامج / المسار')}</th>
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.start_date', 'تاريخ البدء')}</th>
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.end_date', 'تاريخ الانتهاء')}</th>
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.number_of_pilgrims', 'عدد المعتمرين')}</th>
                    <th className="py-3 px-4 whitespace-nowrap">{t('trips.trip_guide', 'مرشد الرحلة')}</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">{t('common.status', 'الحالة')}</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">{t('common.actions', 'إجراءات')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs sm:text-sm">
                        {isRTL ? 'لا توجد رحلات تطابق معايير البحث' : 'No trips match your search criteria'}
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => {
                      return (
                        <tr
                          key={trip.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {trip.code}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {trip.routeName}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {trip.startDate}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {trip.endDate}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-slate-900">{trip.pilgrimsCount}</span>
                            <span className="text-slate-600 mr-1"> {isRTL ? 'معتمراً' : 'Pilgrims'}</span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                            {trip.guideName}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <TripStatusSelector
                              value={trip.status}
                              disabled={isReadOnly}
                              onChange={(newStatus) => handleStatusChange(trip.id, newStatus)}
                            />
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedTrip(trip);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="bg-[#e0f2fe] hover:bg-sky-100 text-[#0284c7] px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                              >
                                {t('common.view', 'View')}
                              </button>

                              {!isReadOnly && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingTrip(trip);
                                      setIsAddTripOpen(true);
                                    }}
                                    className="bg-[#fef3c7] hover:bg-amber-100 text-[#d97706] px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                                  >
                                    {t('common.edit', 'Edit')}
                                  </button>

                                  <button
                                    onClick={() => setTripToDelete(trip.id)}
                                    className="bg-[#fee2e2] hover:bg-rose-100 text-[#e11d48] px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                                  >
                                    {t('common.delete', 'Delete')}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      <TripDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        trip={selectedTrip}
        onEdit={(trip) => {
          setIsDetailsModalOpen(false);
          setEditingTrip(trip);
          setIsAddTripOpen(true);
        }}
      />

      {/* Add / Edit Trip Modal */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => {
          setIsAddTripOpen(false);
          setEditingTrip(null);
        }}
        initialData={editingTrip}
        onSuccess={async (savedTrip) => {
          if (editingTrip) {
            try {
              const updated = await updateTripApi(editingTrip.id, savedTrip);
              setTripsList((prev) =>
                prev.map((t) => (t.id === editingTrip.id ? { ...t, ...updated } : t))
              );
            } catch {
              setTripsList((prev) =>
                prev.map((t) => (t.id === editingTrip.id ? savedTrip : t))
              );
            }
          } else {
            try {
              const created = await createTripApi(savedTrip);
              setTripsList((prev) => [created, ...prev]);
            } catch {
              setTripsList((prev) => [savedTrip, ...prev]);
            }
          }
          setEditingTrip(null);
          window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
        }}
      />

      {/* Delete Confirmation Dialog */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[420px] sm:max-w-[450px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fee2e2] mx-auto flex items-center justify-center">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                  fill="#ef4444"
                />
                <line
                  x1="12"
                  y1="9"
                  x2="12"
                  y2="13"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1.2" fill="white" />
              </svg>
            </div>

            <div className="space-y-2 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'هل أنت متأكد من حذف هذه الرحلة؟' : 'Are you sure you want to delete this trip?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-sm mx-auto">
                {isRTL ? 'سيتم حذف جميع البيانات المرتبطة بهذه الرحلة نهائياً. لا يمكن التراجع عن هذا الإجراء.' : 'All data associated with this trip schedule will be permanently deleted.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full pt-3">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
              </button>

              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                className="flex-1 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Dialog */}
      {isDeleteSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[420px] sm:max-w-[450px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#cbf7df]/80 mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-[#00c48c] stroke-[2.5]" />
            </div>

            <div className="space-y-2 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'تم حذف الرحلة بنجاح' : 'Trip Deleted Successfully'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'تم حذف الرحلة وجميع البيانات المرتبطة بها بنجاح.' : 'The trip schedule and associated manifest have been deleted.'}
              </p>
            </div>

            <div className="pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setIsDeleteSuccessOpen(false)}
                className="border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-12 rounded-xl transition shadow-2xs text-sm cursor-pointer active:scale-95"
              >
                {t('common.close', 'إغلاق')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
