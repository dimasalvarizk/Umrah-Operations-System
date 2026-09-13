import type { NoteItem } from '../pages/NotesPage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getNotesApi(params: {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
} = {}): Promise<{ notes: NoteItem[]; total: number }> {
  const url = new URL(`${API_BASE_URL}/notes`);

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
  return data.data;
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
  return data.data;
}

export async function togglePinNoteApi(id: string): Promise<NoteItem> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}/pin`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to toggle pin');
  }
  return data.data;
}

export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete note');
  }
}
