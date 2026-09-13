const { pool } = require('../config/db');

class NoteModel {
  static async getAll({ search, category, priority, status } = {}) {
    let sql = 'SELECT * FROM notes WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (title LIKE ? OR content LIKE ? OR author LIKE ? OR related_entity LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (category && category !== 'الكل' && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (priority && priority !== 'الكل' && priority !== 'All') {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      if (status === 'مثبت' || status === 'Pinned') {
        sql += ' AND is_pinned = 1';
      } else {
        sql += ' AND status = ?';
        params.push(status);
      }
    }

    sql += ' ORDER BY is_pinned DESC, id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const sql = `
      INSERT INTO notes (
        title, content, category, priority, status, is_pinned,
        related_entity, author, date_string, tags_data, checklist_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const tagsJson = data.tags ? JSON.stringify(data.tags) : null;
    const checklistJson = data.checklist ? JSON.stringify(data.checklist) : null;

    const params = [
      data.title || '',
      data.content || '',
      data.category || 'عام',
      data.priority || 'عادي',
      data.status || 'نشط',
      data.isPinned ? 1 : 0,
      data.relatedEntity || null,
      data.author || 'Super Admin',
      data.date || new Date().toLocaleDateString('ar-SA'),
      tagsJson,
      checklistJson,
    ];

    const [result] = await pool.query(sql, params);
    return this.getById(result.insertId);
  }

  static async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const sql = `
      UPDATE notes SET
        title = ?,
        content = ?,
        category = ?,
        priority = ?,
        status = ?,
        is_pinned = ?,
        related_entity = ?,
        author = ?,
        date_string = ?,
        tags_data = ?,
        checklist_data = ?
      WHERE id = ?
    `;

    const tagsJson = data.tags !== undefined ? JSON.stringify(data.tags) : current.tags_data;
    const checklistJson = data.checklist !== undefined ? JSON.stringify(data.checklist) : current.checklist_data;

    const params = [
      data.title !== undefined ? data.title : current.title,
      data.content !== undefined ? data.content : current.content,
      data.category !== undefined ? data.category : current.category,
      data.priority !== undefined ? data.priority : current.priority,
      data.status !== undefined ? data.status : current.status,
      data.isPinned !== undefined ? (data.isPinned ? 1 : 0) : current.is_pinned,
      data.relatedEntity !== undefined ? data.relatedEntity : current.related_entity,
      data.author !== undefined ? data.author : current.author,
      data.date !== undefined ? data.date : current.date_string,
      tagsJson,
      checklistJson,
      id,
    ];

    await pool.query(sql, params);
    return this.getById(id);
  }

  static async togglePin(id) {
    const current = await this.getById(id);
    if (!current) return null;
    const newPinned = current.is_pinned ? 0 : 1;
    await pool.query('UPDATE notes SET is_pinned = ? WHERE id = ?', [newPinned, id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = NoteModel;
