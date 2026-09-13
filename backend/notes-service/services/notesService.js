const NoteModel = require('../models/noteModel');

function safeJsonParse(data) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function formatNote(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    category: row.category,
    priority: row.priority,
    status: row.status,
    isPinned: Boolean(row.is_pinned),
    relatedEntity: row.related_entity,
    author: row.author,
    date: row.date_string,
    tags: safeJsonParse(row.tags_data) || [],
    checklist: safeJsonParse(row.checklist_data) || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class NotesService {
  static async listNotes(filters) {
    const rows = await NoteModel.getAll(filters);
    return rows.map(formatNote);
  }

  static async getNoteById(id) {
    const row = await NoteModel.getById(id);
    return formatNote(row);
  }

  static async createNote(data) {
    const row = await NoteModel.create(data);
    return formatNote(row);
  }

  static async updateNote(id, data) {
    const row = await NoteModel.update(id, data);
    return formatNote(row);
  }

  static async togglePin(id) {
    const row = await NoteModel.togglePin(id);
    return formatNote(row);
  }

  static async deleteNote(id) {
    return await NoteModel.delete(id);
  }
}

module.exports = NotesService;
