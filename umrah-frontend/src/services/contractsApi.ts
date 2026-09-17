import type { AgreementItem } from '../components/contracts/AddAgreementModal';
import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

export async function getContractsApi(params: {
  search?: string;
  type?: string;
  status?: string;
} = {}): Promise<{ contracts: AgreementItem[]; total: number }> {
  const url = createApiUrl('/contracts');

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

  const contract = data.data;
  if (contract) {
    recordActivity({
      action: 'CREATE',
      module: 'contracts',
      entityId: contract.id || contract.agreementNo || payload.agreementNo,
      entityName: contract.agreementName || contract.entityName || payload.agreementName || payload.entityName,
      descriptionEn: `Added new hotel agreement: ${contract.agreementName || payload.agreementName || 'Agreement'} (${contract.agreementNo || payload.agreementNo || ''}).`,
      descriptionAr: `إضافة اتفاقية فندقية جديدة: ${contract.agreementName || payload.agreementName || 'اتفاقية'} (${contract.agreementNo || payload.agreementNo || ''}).`,
      metadata: { type: contract.type, totalPrice: contract.totalPrice },
    });
  }

  return contract;
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

  const contract = data.data;
  if (contract) {
    recordActivity({
      action: 'UPDATE',
      module: 'contracts',
      entityId: id,
      entityName: contract.agreementName || contract.entityName || payload.agreementName || payload.entityName || id,
      descriptionEn: `Updated agreement details: ${contract.agreementName || payload.agreementName || id}.`,
      descriptionAr: `تحديث بيانات الاتفاقية: ${contract.agreementName || payload.agreementName || id}.`,
    });
  }

  return contract;
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

  const contract = data.data;
  if (contract) {
    recordActivity({
      action: 'STATUS_CHANGE',
      module: 'contracts',
      entityId: id,
      entityName: contract.agreementName || contract.entityName,
      descriptionEn: `Changed agreement status to "${status}": ${contract.agreementName || id}.`,
      descriptionAr: `تحديث حالة الاتفاقية إلى "${status}": ${contract.agreementName || id}.`,
    });
  }

  return contract;
}

export async function deleteContractApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete contract');
  }

  recordActivity({
    action: 'DELETE',
    module: 'contracts',
    entityId: id,
    descriptionEn: `Deleted hotel agreement (ID: ${id}).`,
    descriptionAr: `حذف اتفاقية فندقية (رقم: ${id}).`,
  });
}
