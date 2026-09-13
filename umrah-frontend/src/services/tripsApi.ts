import type { TripItem } from '../components/trips/TripDetailsModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getTripsApi(params: {
  search?: string;
  status?: string;
  route?: string;
} = {}): Promise<{ trips: TripItem[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/trips`);

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
  return data.data;
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
  return data.data;
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
  return data.data;
}

export async function deleteTripApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete trip');
  }
}
