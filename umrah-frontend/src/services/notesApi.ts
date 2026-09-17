import type { NoteItem } from '../pages/NotesPage';
import { API_BASE_URL, createApiUrl } from './apiConfig';
import { recordActivity } from '../utils/activityLogger';

export async function getNotesApi(params: {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
} = {}): Promise<{ notes: NoteItem[]; total: number }> {
  const url = createApiUrl('/notes');

  if (params.search) url.searchParams.append('search', params.search);
  if (params.category && params.category !== 'الكل' && params.category !== 'All') {
    url.searchParams.append('category', params.category);
  }
  if (params.priority && params.priority !== 'الكل' && params.priority !== 'All') {
    url.searchParams.append('priority', params.priority);
  }
  if (params.status && params.status !== 'الكل' && params.status !== 'All') {
    url.searchParams.append('status', params.status);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch notes');
  }

  return {
    notes: data.data?.notes || [],
    total: data.data?.total || 0,
  };
}

export async function getNoteByIdApi(id: string): Promise<NoteItem> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch note');
  }
  return data.data;
}

export async function createNoteApi(payload: Partial<NoteItem>): Promise<NoteItem> {
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create note');
  }

  const note = data.data;
  if (note) {
    recordActivity({
      action: 'CREATE',
      module: 'notes',
      entityId: note.id || payload.title,
      entityName: note.title || payload.title,
      descriptionEn: `Added operational note / task: ${note.title || payload.title}.`,
      descriptionAr: `إضافة ملاحظة / مهمة تشغيلية: ${note.title || payload.title}.`,
      metadata: { category: note.category, priority: note.priority },
    });
  }

  return note;
}

export async function updateNoteApi(id: string, payload: Partial<NoteItem>): Promise<NoteItem> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update note');
  }

  const note = data.data;
  if (note) {
    recordActivity({
      action: 'UPDATE',
      module: 'notes',
      entityId: id,
      entityName: note.title || payload.title || id,
      descriptionEn: `Updated note details: ${note.title || payload.title || id}.`,
      descriptionAr: `تحديث بيانات الملاحظة: ${note.title || payload.title || id}.`,
    });
  }

  return note;
}

export async function togglePinNoteApi(id: string): Promise<NoteItem> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}/pin`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to toggle pin');
  }

  const note = data.data;
  if (note) {
    recordActivity({
      action: 'STATUS_CHANGE',
      module: 'notes',
      entityId: id,
      entityName: note.title || id,
      descriptionEn: `Changed pinned status for note: ${note.title || id}.`,
      descriptionAr: `تغيير حالة التثبيت للملاحظة: ${note.title || id}.`,
    });
  }

  return note;
}

export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete note');
  }

  recordActivity({
    action: 'DELETE',
    module: 'notes',
    entityId: id,
    descriptionEn: `Deleted operational note (ID: ${id}).`,
    descriptionAr: `حذف ملاحظة تشغيلية (رقم: ${id}).`,
  });
}
