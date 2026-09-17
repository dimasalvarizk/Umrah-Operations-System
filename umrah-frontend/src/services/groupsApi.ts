import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

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

  const group = data.data?.group;
  if (group) {
    recordActivity({
      action: 'CREATE',
      module: 'groups',
      entityId: group.code || payload.code,
      entityName: group.name || payload.name,
      descriptionEn: `Registered new group: ${group.name || payload.name} (${group.code || payload.code}) with ${group.pilgrimsCount || payload.pilgrimsCount || 1} pilgrims.`,
      descriptionAr: `تسجيل مجموعة عمرة جديدة: ${group.name || payload.name} (${group.code || payload.code}) بعدد ${group.pilgrimsCount || payload.pilgrimsCount || 1} معتمر.`,
      metadata: { code: group.code, pilgrimsCount: group.pilgrimsCount },
    });
  }

  return group;
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

  const group = data.data?.group;
  if (group) {
    recordActivity({
      action: 'UPDATE',
      module: 'groups',
      entityId: group.code || id,
      entityName: group.name || payload.name,
      descriptionEn: `Updated group details: ${group.name || payload.name || id} (${group.code || id}).`,
      descriptionAr: `تحديث بيانات المجموعة: ${group.name || payload.name || id} (${group.code || id}).`,
    });
  }

  return group;
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

  const group = data.data?.group;
  if (group) {
    recordActivity({
      action: 'STATUS_CHANGE',
      module: 'groups',
      entityId: group.code || id,
      entityName: group.name,
      descriptionEn: `Changed group status to "${status}": ${group.name || id}.`,
      descriptionAr: `تحديث حالة المجموعة إلى "${status}": ${group.name || id}.`,
    });
  }

  return group;
}

export async function deleteGroupApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete group');
  }

  recordActivity({
    action: 'DELETE',
    module: 'groups',
    entityId: id,
    descriptionEn: `Deleted group record (ID: ${id}).`,
    descriptionAr: `حذف سجل المجموعة (رقم: ${id}).`,
  });
}
