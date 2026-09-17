import type { TransportCompany } from '../components/transport/TransportDetailsModal';
import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

export async function getTransportsApi(params: {
  search?: string;
  region?: string;
  status?: string;
} = {}): Promise<{ transports: TransportCompany[]; total: number }> {
  const url = createApiUrl('/transport');

  if (params.search) url.searchParams.append('search', params.search);
  if (params.region && params.region !== 'الكل' && params.region !== 'All') {
    url.searchParams.append('region', params.region);
  }
  if (params.status && params.status !== 'الكل' && params.status !== 'All') {
    url.searchParams.append('status', params.status);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch transports');
  }

  return {
    transports: data.data?.transports || [],
    total: data.data?.total || 0,
  };
}

export async function getTransportByIdApi(id: string): Promise<TransportCompany> {
  const res = await fetch(`${API_BASE_URL}/transport/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch transport company');
  }
  return data.data;
}

export async function createTransportApi(payload: Partial<TransportCompany>): Promise<TransportCompany> {
  const res = await fetch(`${API_BASE_URL}/transport`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create transport company');
  }

  const transport = data.data;
  if (transport) {
    const fleetInfo = transport.fleetLabel || (transport.fleetSize ? `${transport.fleetSize} vehicles` : 'fleet');
    await recordActivity({
      action: 'CREATE',
      module: 'transport',
      entityId: transport.id || payload.name,
      entityName: transport.name || payload.name,
      descriptionEn: `Added new transportation company: ${transport.name || payload.name} (${fleetInfo}).`,
      descriptionAr: `إضافة شركة نقل جديدة: ${transport.name || payload.name} (${transport.fleetLabel || `${transport.fleetSize || 0} مركبة`}).`,
      metadata: { fleetSize: transport.fleetSize, region: transport.region },
    });
  }

  return transport;
}

export async function updateTransportApi(id: string, payload: Partial<TransportCompany>): Promise<TransportCompany> {
  const res = await fetch(`${API_BASE_URL}/transport/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update transport company');
  }

  const transport = data.data;
  if (transport) {
    await recordActivity({
      action: 'UPDATE',
      module: 'transport',
      entityId: id,
      entityName: transport.name || payload.name || id,
      descriptionEn: `Updated transport company info: ${transport.name || payload.name || id}.`,
      descriptionAr: `تحديث بيانات شركة النقل: ${transport.name || payload.name || id}.`,
    });
  }

  return transport;
}

export async function updateTransportStatusApi(id: string, status: string): Promise<TransportCompany> {
  const res = await fetch(`${API_BASE_URL}/transport/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update transport status');
  }

  const transport = data.data;
  if (transport) {
    await recordActivity({
      action: 'STATUS_CHANGE',
      module: 'transport',
      entityId: id,
      entityName: transport.name || id,
      descriptionEn: `Changed transport company status to "${status}": ${transport.name || id}.`,
      descriptionAr: `تحديث حالة شركة النقل إلى "${status}": ${transport.name || id}.`,
    });
  }

  return transport;
}

export async function deleteTransportApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/transport/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete transport company');
  }

  await recordActivity({
    action: 'DELETE',
    module: 'transport',
    entityId: id,
    descriptionEn: `Deleted transportation company (ID: ${id}).`,
    descriptionAr: `حذف شركة نقل (رقم: ${id}).`,
  });
}
