import type { HotelItem } from '../utils/hotelsData';
import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

export async function getHotelsApi(params: {
  search?: string;
  location?: string;
  status?: string;
} = {}): Promise<{ hotels: HotelItem[]; total: number }> {
  const url = createApiUrl('/hotels');

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

  const hotel = data.data;
  if (hotel) {
    await recordActivity({
      action: 'CREATE',
      module: 'hotels',
      entityId: hotel.id || payload.name,
      entityName: hotel.name || payload.name,
      descriptionEn: `Added new hotel partner: ${hotel.name || payload.name} (${hotel.location || payload.location || ''}).`,
      descriptionAr: `إضافة فندق شريك جديد: ${hotel.name || payload.name} (${hotel.location || payload.location || ''}).`,
      metadata: { location: hotel.location, rating: hotel.rating, totalRooms: hotel.availableRooms || hotel.totalRooms },
    });
  }

  return hotel;
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

  const hotel = data.data;
  if (hotel) {
    await recordActivity({
      action: 'UPDATE',
      module: 'hotels',
      entityId: id,
      entityName: hotel.name || payload.name || id,
      descriptionEn: `Updated hotel details: ${hotel.name || payload.name || id}.`,
      descriptionAr: `تحديث بيانات الفندق: ${hotel.name || payload.name || id}.`,
    });
  }

  return hotel;
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

  const hotel = data.data;
  if (hotel) {
    await recordActivity({
      action: 'STATUS_CHANGE',
      module: 'hotels',
      entityId: id,
      entityName: hotel.name || id,
      descriptionEn: `Changed hotel status to "${status}": ${hotel.name || id}.`,
      descriptionAr: `تحديث حالة الفندق إلى "${status}": ${hotel.name || id}.`,
    });
  }

  return hotel;
}

export async function deleteHotelApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete hotel');
  }

  await recordActivity({
    action: 'DELETE',
    module: 'hotels',
    entityId: id,
    descriptionEn: `Deleted hotel record (ID: ${id}).`,
    descriptionAr: `حذف سجل الفندق (رقم: ${id}).`,
  });
}
