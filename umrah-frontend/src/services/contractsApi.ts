import type { AgreementItem } from '../components/contracts/AddAgreementModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getContractsApi(params: {
  search?: string;
  type?: string;
  status?: string;
} = {}): Promise<{ contracts: AgreementItem[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/contracts`);

  if (params.search) url.searchParams.append('search', params.search);
  if (params.type && params.type !== 'الكل' && params.type !== 'All') {
    url.searchParams.append('type', params.type);
  }
  if (params.status && params.status !== 'الكل' && params.status !== 'All') {
    url.searchParams.append('status', params.status);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch contracts');
  }

  return {
    contracts: data.data?.contracts || [],
    total: data.data?.total || 0,
  };
}

export async function getContractByIdApi(id: string): Promise<AgreementItem> {
  const res = await fetch(`${API_BASE_URL}/contracts/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch contract');
  }
  return data.data;
}

export async function createContractApi(payload: Partial<AgreementItem>): Promise<AgreementItem> {
  const res = await fetch(`${API_BASE_URL}/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create contract');
  }
  return data.data;
}

export async function updateContractApi(id: string, payload: Partial<AgreementItem>): Promise<AgreementItem> {
  const res = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update contract');
  }
  return data.data;
}

export async function updateContractStatusApi(id: string, status: string): Promise<AgreementItem> {
  const res = await fetch(`${API_BASE_URL}/contracts/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update contract status');
  }
  return data.data;
}

export async function deleteContractApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete contract');
  }
}
