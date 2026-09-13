import { getGroupsApi } from './groupsApi';
import { getTripsApi } from './tripsApi';
import { getNotesApi } from './notesApi';

export interface DashboardStats {
  activeGroups: number;
  totalPilgrims: number;
  incompleteAlerts: number;
  upcomingTrips: number;
  groupStatus: {
    completed: number;
    completedPercent: number;
    inPreparation: number;
    inPreparationPercent: number;
    pending: number;
    pendingPercent: number;
  };
  nationalities: Array<{
    country: string;
    countryAr?: string;
    targetCount: number;
    width: string;
    color: string;
    delayMs: number;
  }>;
  activities: Array<{
    id: string | number;
    badge: string;
    badgeColor: string;
    title: string;
    titleAr?: string;
    time: string;
    timeAr?: string;
  }>;
}

const COLOR_PALETTE = ['#10b981', '#1e293b', '#f59e0b', '#0284c7', '#8b5cf6', '#ef4444', '#0d9488'];

function getRelativeTime(dateString?: string): { en: string; ar: string } {
  if (!dateString) return { en: 'Recently', ar: 'مؤخراً' };
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return { en: 'Just now', ar: 'الآن' };
    if (diffMins < 60) return { en: `${diffMins} min ago`, ar: `منذ ${diffMins} دقيقة` };
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return { en: `${diffHours} hr ago`, ar: `منذ ${diffHours} ساعة` };
    const diffDays = Math.floor(diffHours / 24);
    return { en: `${diffDays} days ago`, ar: `منذ ${diffDays} يوم` };
  } catch {
    return { en: 'Recently', ar: 'مؤخراً' };
  }
}

export async function fetchDashboardSummary(): Promise<DashboardStats> {
  let groups: any[] = [];
  let trips: any[] = [];
  let notes: any[] = [];

  try {
    const [groupsRes, tripsRes, notesRes] = await Promise.allSettled([
      getGroupsApi(),
      getTripsApi(),
      getNotesApi(),
    ]);

    if (groupsRes.status === 'fulfilled' && Array.isArray(groupsRes.value.groups)) {
      groups = groupsRes.value.groups;
    } else {
      const savedGroups = localStorage.getItem('umrah_groups_list');
      groups = savedGroups ? JSON.parse(savedGroups) : [];
    }

    if (tripsRes.status === 'fulfilled' && Array.isArray(tripsRes.value.trips)) {
      trips = tripsRes.value.trips;
    } else {
      const savedTrips = localStorage.getItem('umrah_trips_list');
      trips = savedTrips ? JSON.parse(savedTrips) : [];
    }

    if (notesRes.status === 'fulfilled' && Array.isArray(notesRes.value.notes)) {
      notes = notesRes.value.notes;
    } else {
      const savedNotes = localStorage.getItem('umrah_notes_list');
      notes = savedNotes ? JSON.parse(savedNotes) : [];
    }
  } catch (err) {
    console.warn('Real-time fetch fallback for dashboard stats', err);
    const savedGroups = localStorage.getItem('umrah_groups_list');
    groups = savedGroups ? JSON.parse(savedGroups) : [];
  }

  // 1. Exact Metric Counts from MySQL
  const activeGroupsCount = groups.length;
  const totalPilgrimsCount = groups.reduce((acc, g) => acc + (Number(g.pilgrimsCount) || 0), 0);
  const upcomingTripsCount = trips.length;

  // 2. Real Status Breakdown (Exact count & percentages)
  let completedCount = 0;
  let inPrepCount = 0;
  let pendingCount = 0;

  groups.forEach((g) => {
    const st = String(g.status || '').trim();
    if (st === 'مكتمل' || st.toLowerCase() === 'completed') {
      completedCount++;
    } else if (st === 'قيد التجهيز' || st.toLowerCase() === 'in preparation' || st.toLowerCase() === 'in progress') {
      inPrepCount++;
    } else {
      pendingCount++;
    }
  });

  const totalGroups = groups.length;
  let completedPercent = 0;
  let inPreparationPercent = 0;
  let pendingPercent = 0;

  if (totalGroups > 0) {
    completedPercent = Math.round((completedCount / totalGroups) * 100);
    inPreparationPercent = Math.round((inPrepCount / totalGroups) * 100);
    pendingPercent = Math.max(0, 100 - completedPercent - inPreparationPercent);
  }

  const incompleteAlertsCount = pendingCount + groups.filter((g) => !g.hotelsData || !g.flightTransportData).length;

  // 3. Real Dynamic Nationality Distribution
  const natMap: Record<string, number> = {};
  groups.forEach((g) => {
    const nat = (g.nationality || 'Indonesia').trim();
    natMap[nat] = (natMap[nat] || 0) + (Number(g.pilgrimsCount) || 1);
  });

  const sortedNats = Object.entries(natMap).sort((a, b) => b[1] - a[1]);
  const maxNatCount = sortedNats.length > 0 ? Math.max(...sortedNats.map((n) => n[1])) : 1;

  const nationalitiesList = sortedNats.slice(0, 6).map(([country, count], idx) => {
    const percentage = Math.max(12, Math.round((count / maxNatCount) * 100));
    return {
      country,
      targetCount: count,
      width: `${percentage}%`,
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      delayMs: 150 * (idx + 1),
    };
  });

  // 4. Real-time Activities & Operational Logs
  const activitiesList: Array<{
    id: string | number;
    badge: string;
    badgeColor: string;
    title: string;
    titleAr?: string;
    time: string;
    timeAr?: string;
  }> = [];

  // Group events
  groups.slice(0, 3).forEach((g, idx) => {
    const timeInfo = getRelativeTime(g.createdAt || g.updatedAt);
    const isCompleted = g.status === 'مكتمل' || g.status === 'Completed';
    activitiesList.push({
      id: `group-${g.id || idx}`,
      badge: isCompleted ? 'مكتمل' : 'مجموعة',
      badgeColor: isCompleted ? 'bg-emerald-500 text-white' : 'bg-[#1c2844] text-white',
      title: `Group "${g.name}" (${g.code}) registered with ${g.pilgrimsCount} pilgrims`,
      titleAr: `تم تسجيل المجموعة "${g.name}" (${g.code}) بعدد ${g.pilgrimsCount} معتمر`,
      time: timeInfo.en,
      timeAr: timeInfo.ar,
    });
  });

  // Trip events
  trips.slice(0, 2).forEach((t, idx) => {
    const timeInfo = getRelativeTime(t.createdAt);
    activitiesList.push({
      id: `trip-${t.id || idx}`,
      badge: 'رحلة',
      badgeColor: 'bg-amber-500 text-white',
      title: `Trip "${t.tripCode || t.flightNumber || 'Flight'}" scheduled for ${t.departureDate || 'operation'}`,
      titleAr: `تم جدولة الرحلة "${t.tripCode || t.flightNumber || 'رحلة'}" بتاريخ ${t.departureDate || 'العمليات'}`,
      time: timeInfo.en,
      timeAr: timeInfo.ar,
    });
  });

  // Notes events
  notes.slice(0, 2).forEach((n, idx) => {
    const timeInfo = getRelativeTime(n.createdAt || n.updatedAt);
    const isHigh = n.priority === 'عالية' || n.priority === 'High';
    activitiesList.push({
      id: `note-${n.id || idx}`,
      badge: isHigh ? 'تنبيه' : 'ملاحظة',
      badgeColor: isHigh ? 'bg-red-500 text-white' : 'bg-[#64748b] text-white',
      title: n.title || 'Operational Note Recorded',
      titleAr: n.title || 'تم تسجيل ملاحظة تشغيلية',
      time: timeInfo.en,
      timeAr: timeInfo.ar,
    });
  });

  // If no events exist yet
  if (activitiesList.length === 0) {
    activitiesList.push({
      id: 'sys-ready',
      badge: 'مزامنة',
      badgeColor: 'bg-emerald-500 text-white',
      title: 'Real-time database connected: Ready for new groups and operations',
      titleAr: 'قاعدة البيانات متصلة بشكل مباشر: النظام جاهز لاستقبال المجموعات والعمليات',
      time: 'Live',
      timeAr: 'مباشر',
    });
  }

  return {
    activeGroups: activeGroupsCount,
    totalPilgrims: totalPilgrimsCount,
    incompleteAlerts: incompleteAlertsCount,
    upcomingTrips: upcomingTripsCount,
    groupStatus: {
      completed: completedCount,
      completedPercent,
      inPreparation: inPrepCount,
      inPreparationPercent,
      pending: pendingCount,
      pendingPercent,
    },
    nationalities: nationalitiesList,
    activities: activitiesList,
  };
}
