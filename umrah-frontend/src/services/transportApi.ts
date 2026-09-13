import type { TransportCompany } from '../components/transport/TransportDetailsModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getTransportsApi(params: {
  search?: string;
  region?: string;
  status?: string;
} = {}): Promise<{ transports: TransportCompany[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/transport`);

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
  return data.data;
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
  return data.data;
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
  return data.data;
}

export async function deleteTransportApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/transport/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete transport company');
  }
}
