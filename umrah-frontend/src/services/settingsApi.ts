import { API_BASE_URL, createApiUrl } from './apiConfig';

export type ListCategory =
  | 'agents'
  | 'airlines'
  | 'countries'
  | 'branches'
  | 'transport'
  | 'packages'
  | 'airports'
  | 'room_types'
  | 'guides'
  | 'routes';

export interface BaseListItem {
  id: string;
  nameEn: string;
  nameAr: string;
  code?: string;
  secondary?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface SystemStats {
  agents: number;
  airlines: number;
  countries: number;
  branches: number;
  transport: number;
  packages: number;
  airports: number;
  room_types: number;
  guides: number;
  routes: number;
}

/**
 * Get items by category with optional search
 */
export async function getSystemListsApi(category: ListCategory, search = ''): Promise<BaseListItem[]> {
  const url = createApiUrl(`/settings/lists/${category}`);
  if (search) {
    url.searchParams.append('search', search);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch ${category}`);
  }

  return (data.data?.items || []).map((item: any) => ({
    id: String(item.id),
    nameEn: item.name_en || item.nameEn,
    nameAr: item.name_ar || item.nameAr,
    code: item.code || '',
    secondary: item.secondary || '',
    status: item.status || 'Active',
    notes: item.notes || '',
  }));
}

/**
 * Get count stats for all categories
 */
export async function getSystemStatsApi(): Promise<SystemStats> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/stats`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch stats');
  }
  return data.data?.stats || {
    agents: 0,
    airlines: 0,
    countries: 0,
    branches: 0,
    transport: 0,
    packages: 0,
  };
}

/**
 * Create item in a category
 */
export async function createSystemListItemApi(category: ListCategory, payload: Omit<BaseListItem, 'id'>): Promise<BaseListItem> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/${category}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to add item');
  }

  const item = data.data?.item;
  return {
    id: String(item.id),
    nameEn: item.name_en || item.nameEn,
    nameAr: item.name_ar || item.nameAr,
    code: item.code || '',
    secondary: item.secondary || '',
    status: item.status || 'Active',
    notes: item.notes || '',
  };
}

/**
 * Update an existing item
 */
export async function updateSystemListItemApi(category: ListCategory, id: string, payload: Partial<BaseListItem>): Promise<BaseListItem> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/${category}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update item');
  }

  const item = data.data?.item;
  return {
    id: String(item.id),
    nameEn: item.name_en || item.nameEn,
    nameAr: item.name_ar || item.nameAr,
    code: item.code || '',
    secondary: item.secondary || '',
    status: item.status || 'Active',
    notes: item.notes || '',
  };
}

/**
 * Toggle Active / Inactive status
 */
export async function toggleSystemListStatusApi(category: ListCategory, id: string): Promise<BaseListItem> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/${category}/${id}/status`, {
    method: 'PATCH',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to toggle status');
  }

  const item = data.data?.item;
  return {
    id: String(item.id),
    nameEn: item.name_en || item.nameEn,
    nameAr: item.name_ar || item.nameAr,
    code: item.code || '',
    secondary: item.secondary || '',
    status: item.status || 'Active',
    notes: item.notes || '',
  };
}

/**
 * Delete an item
 */
export async function deleteSystemListItemApi(category: ListCategory, id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/${category}/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete item');
  }
}

/**
 * Reset category to defaults
 */
export async function resetSystemListCategoryApi(category: ListCategory): Promise<BaseListItem[]> {
  const res = await fetch(`${API_BASE_URL}/settings/lists/${category}/reset`, {
    method: 'POST',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset category');
  }

  return (data.data?.items || []).map((item: any) => ({
    id: String(item.id),
    nameEn: item.name_en || item.nameEn,
    nameAr: item.name_ar || item.nameAr,
    code: item.code || '',
    secondary: item.secondary || '',
    status: item.status || 'Active',
    notes: item.notes || '',
  }));
}
