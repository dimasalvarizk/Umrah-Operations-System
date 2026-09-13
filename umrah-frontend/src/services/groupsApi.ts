import { API_BASE_URL, createApiUrl } from './apiConfig';

export interface GroupItemApi {
  id: string;
  code: string;
  name: string;
  agreementNumber?: string;
  mainAgent?: string;
  subAgent?: string;
  nationality?: string;
  packageType?: string;
  pilgrimsCount: number;
  status: 'مكتمل' | 'قيد التجهيز' | 'ناقص' | string;
  hotelsData?: any;
  flightTransportData?: any;
  permitsNotesData?: any;
  createdAt?: string;
  updatedAt?: string;
}

export async function getGroupsApi(params: {
  search?: string;
  agent?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ groups: GroupItemApi[]; total: number }> {
  const url = createApiUrl('/groups');

  if (params.search) url.searchParams.append('search', params.search);
  if (params.agent && params.agent !== 'الكل' && params.agent !== 'All') url.searchParams.append('agent', params.agent);
  if (params.status && params.status !== 'الكل' && params.status !== 'All') url.searchParams.append('status', params.status);
  if (params.limit) url.searchParams.append('limit', String(params.limit));
  if (params.offset) url.searchParams.append('offset', String(params.offset));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch groups');
  }

  return {
    groups: data.data?.groups || [],
    total: data.data?.total || 0,
  };
}

export async function getGroupByIdApi(id: string): Promise<GroupItemApi> {
  const res = await fetch(`${API_BASE_URL}/groups/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch group details');
  }
  return data.data?.group;
}

export async function createGroupApi(payload: Partial<GroupItemApi>): Promise<GroupItemApi> {
  const res = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create group');
  }
  return data.data?.group;
}

export async function updateGroupApi(id: string, payload: Partial<GroupItemApi>): Promise<GroupItemApi> {
  const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update group');
  }
  return data.data?.group;
}

export async function updateGroupStatusApi(id: string, status: string): Promise<GroupItemApi> {
  const res = await fetch(`${API_BASE_URL}/groups/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update group status');
  }
  return data.data?.group;
}

export async function deleteGroupApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete group');
  }
}
