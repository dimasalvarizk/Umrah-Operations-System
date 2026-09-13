import type { HotelItem } from '../utils/hotelsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getHotelsApi(params: {
  search?: string;
  location?: string;
  status?: string;
} = {}): Promise<{ hotels: HotelItem[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/hotels`);

  if (params.search) url.searchParams.append('search', params.search);
  if (params.location && params.location !== 'الكل' && params.location !== 'All') {
    url.searchParams.append('location', params.location);
  }
  if (params.status && params.status !== 'الكل' && params.status !== 'All') {
    url.searchParams.append('status', params.status);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch hotels');
  }

  return {
    hotels: data.data?.hotels || [],
    total: data.data?.total || 0,
  };
}

export async function getHotelByIdApi(id: string): Promise<HotelItem> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch hotel');
  }
  return data.data;
}

export async function createHotelApi(payload: Partial<HotelItem>): Promise<HotelItem> {
  const res = await fetch(`${API_BASE_URL}/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create hotel');
  }
  return data.data;
}

export async function updateHotelApi(id: string, payload: Partial<HotelItem>): Promise<HotelItem> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update hotel');
  }
  return data.data;
}

export async function updateHotelStatusApi(id: string, status: string): Promise<HotelItem> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update hotel status');
  }
  return data.data;
}

export async function deleteHotelApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete hotel');
  }
}
