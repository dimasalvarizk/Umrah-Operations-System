import { API_BASE_URL, createApiUrl } from './apiConfig';

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'OTHER';
export type ActivityModule = 'groups' | 'contracts' | 'trips' | 'transport' | 'hotels' | 'notes' | 'team' | 'settings' | 'general';

export interface ActivityLogItem {
  id: string;
  userId?: number | null;
  userName: string;
  userEmail?: string | null;
  userRole: string;
  action: ActivityAction;
  module: ActivityModule;
  entityId?: string | null;
  entityName?: string | null;
  descriptionEn: string;
  descriptionAr: string;
  metadata?: any;
  ipAddress?: string | null;
  loginCity?: string | null;
  loginCountry?: string | null;
  city?: string | null;
  country?: string | null;
  location?: string | null;
  createdAt: string;
}

export interface ActivityLogStats {
  total: number;
  createdCount: number;
  updatedCount: number;
  deletedCount: number;
  statusChangesCount: number;
  todayCount: number;
  topUsers: { userName: string; userRole: string; count: number }[];
  moduleBreakdown: { module: string; count: number }[];
}

export interface ActivityLogFilter {
  search?: string;
  module?: string;
  action?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export async function getActivityLogsApi(
  filters: ActivityLogFilter = {}
): Promise<{ logs: ActivityLogItem[]; total: number; limit: number; offset: number }> {
  const url = createApiUrl('/activity-logs');

  if (filters.search) url.searchParams.append('search', filters.search);
  if (filters.module && filters.module !== 'all' && filters.module !== 'الكل' && filters.module !== 'All') {
    url.searchParams.append('module', filters.module);
  }
  if (filters.action && filters.action !== 'all' && filters.action !== 'الكل' && filters.action !== 'All') {
    url.searchParams.append('action', filters.action);
  }
  if (filters.userName && filters.userName !== 'all' && filters.userName !== 'الكل' && filters.userName !== 'All') {
    url.searchParams.append('userName', filters.userName);
  }
  if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
  if (filters.endDate) url.searchParams.append('endDate', filters.endDate);
  if (filters.limit) url.searchParams.append('limit', String(filters.limit));
  if (filters.offset !== undefined) url.searchParams.append('offset', String(filters.offset));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch activity logs');
  }

  return {
    logs: data.data?.logs || [],
    total: data.data?.total || 0,
    limit: data.data?.limit || filters.limit || 50,
    offset: data.data?.offset || filters.offset || 0,
  };
}

export async function getActivityLogStatsApi(): Promise<ActivityLogStats> {
  const res = await fetch(`${API_BASE_URL}/activity-logs/stats`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch activity log stats');
  }

  return data.data;
}

export async function recordActivityLogApi(payload: {
  userId?: number | null;
  userName?: string;
  userEmail?: string | null;
  userRole?: string;
  action: ActivityAction;
  module: ActivityModule;
  entityId?: string | null;
  entityName?: string | null;
  descriptionEn: string;
  descriptionAr?: string;
  metadata?: any;
  ipAddress?: string | null;
  loginCity?: string | null;
  loginCountry?: string | null;
  city?: string | null;
  country?: string | null;
}): Promise<ActivityLogItem> {
  const res = await fetch(`${API_BASE_URL}/activity-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to record activity log');
  }

  return data.data;
}

export async function deleteActivityLogApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/activity-logs/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete activity log');
  }
}

export async function clearAllActivityLogsApi(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/activity-logs/clear-all`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to clear activity logs');
  }
}
