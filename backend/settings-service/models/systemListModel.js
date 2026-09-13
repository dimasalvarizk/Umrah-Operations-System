const { pool } = require('../config/db');

class SystemListModel {
  /**
   * Get all items in a category with optional search query
   */
  static async getByCategory(category, search = '') {
    let query = 'SELECT * FROM system_lists WHERE category = ?';
    const params = [category];

    if (search && search.trim()) {
      query += ' AND (name_en LIKE ? OR name_ar LIKE ? OR code LIKE ? OR secondary LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY id ASC';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  /**
   * Get single item by ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM system_lists WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  /**
   * Create new item
   */
  static async create({ category, nameEn, nameAr, code = null, secondary = null, status = 'Active', notes = null }) {
    const [result] = await pool.execute(
      'INSERT INTO system_lists (category, name_en, name_ar, code, secondary, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category, nameEn, nameAr, code, secondary, status, notes]
    );

    return {
      id: result.insertId,
      category,
      nameEn,
      nameAr,
      code,
      secondary,
      status,
      notes,
    };
  }

  /**
   * Update item
   */
  static async update(id, { nameEn, nameAr, code, secondary, status, notes }) {
    await pool.execute(
      'UPDATE system_lists SET name_en = ?, name_ar = ?, code = ?, secondary = ?, status = ?, notes = ? WHERE id = ?',
      [nameEn, nameAr, code, secondary, status, notes, id]
    );
    return this.getById(id);
  }

  /**
   * Toggle Active / Inactive status
   */
  static async toggleStatus(id) {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    await pool.execute('UPDATE system_lists SET status = ? WHERE id = ?', [newStatus, id]);
    return { ...current, status: newStatus };
  }

  /**
   * Delete item
   */
  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM system_lists WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Reset / clear category and bulk insert default items
   */
  static async resetCategory(category, items) {
    await pool.execute('DELETE FROM system_lists WHERE category = ?', [category]);
    for (const item of items) {
      await pool.execute(
        'INSERT INTO system_lists (category, name_en, name_ar, code, secondary, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [category, item.nameEn, item.nameAr, item.code || null, item.secondary || null, item.status || 'Active', item.notes || null]
      );
    }
    return this.getByCategory(category);
  }

  /**
   * Get count stats grouped by category
   */
  static async getStats() {
    const [rows] = await pool.execute(
      'SELECT category, COUNT(*) as count FROM system_lists GROUP BY category'
    );
    const stats = {
      agents: 0,
      airlines: 0,
      countries: 0,
      branches: 0,
      transport: 0,
      packages: 0,
      airports: 0,
      room_types: 0,
      guides: 0,
      routes: 0,
    };
    rows.forEach((r) => {
      if (stats[r.category] !== undefined) {
        stats[r.category] = Number(r.count);
      }
    });
    return stats;
  }
}

module.exports = SystemListModel;
