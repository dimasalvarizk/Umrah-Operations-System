import type { TripItem } from '../components/trips/TripDetailsModal';
import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

export async function getTripsApi(params: {
  search?: string;
  status?: string;
  route?: string;
} = {}): Promise<{ trips: TripItem[]; total: number }> {
  const url = createApiUrl('/trips');

  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'الكل' && params.status !== 'All') {
    url.searchParams.append('status', params.status);
  }
  if (params.route && params.route !== 'الكل' && params.route !== 'All') {
    url.searchParams.append('route', params.route);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch trips');
  }

  return {
    trips: data.data?.trips || [],
    total: data.data?.total || 0,
  };
}

export async function getTripByIdApi(id: string): Promise<TripItem> {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch trip');
  }
  return data.data;
}

export async function createTripApi(payload: Partial<TripItem>): Promise<TripItem> {
  const res = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create trip');
  }

  const trip = data.data;
  if (trip) {
    recordActivity({
      action: 'CREATE',
      module: 'trips',
      entityId: trip.code || trip.id || payload.code,
      entityName: `${trip.routeName || payload.routeName || 'رحلة'}`,
      descriptionEn: `Created operational trip: ${trip.code || payload.code || 'Trip'} (${trip.routeName || payload.routeName || ''}).`,
      descriptionAr: `إنشاء رحلة تشغيلية: ${trip.code || payload.code || 'رحلة'} (${trip.routeName || payload.routeName || ''}).`,
      metadata: { startDate: trip.startDate, pilgrimsCount: trip.pilgrimsCount },
    });
  }

  return trip;
}

export async function updateTripApi(id: string, payload: Partial<TripItem>): Promise<TripItem> {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update trip');
  }

  const trip = data.data;
  if (trip) {
    recordActivity({
      action: 'UPDATE',
      module: 'trips',
      entityId: id,
      entityName: `${trip.routeName || payload.routeName || id}`,
      descriptionEn: `Updated trip schedule / details: ${trip.code || payload.code || id}.`,
      descriptionAr: `تحديث بيانات / جدول الرحلة: ${trip.code || payload.code || id}.`,
    });
  }

  return trip;
}

export async function updateTripStatusApi(id: string, status: string): Promise<TripItem> {
  const res = await fetch(`${API_BASE_URL}/trips/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update trip status');
  }

  const trip = data.data;
  if (trip) {
    recordActivity({
      action: 'STATUS_CHANGE',
      module: 'trips',
      entityId: id,
      entityName: trip.routeName || trip.code || id,
      descriptionEn: `Changed trip status to "${status}": ${trip.code || id}.`,
      descriptionAr: `تحديث حالة الرحلة إلى "${status}": ${trip.code || id}.`,
    });
  }

  return trip;
}

export async function deleteTripApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete trip');
  }

  recordActivity({
    action: 'DELETE',
    module: 'trips',
    entityId: id,
    descriptionEn: `Deleted operational trip record (ID: ${id}).`,
    descriptionAr: `حذف سجل رحلة تشغيلية (رقم: ${id}).`,
  });
}
