const { pool } = require('../config/db');

class TeamModel {
  static async getAll(search = '') {
    let query = 'SELECT * FROM team_members';
    const params = [];

    if (search && search.trim()) {
      query += ' WHERE (name_en LIKE ? OR name_ar LIKE ? OR email LIKE ? OR role LIKE ? OR department LIKE ? OR employee_id LIKE ? OR branch LIKE ? OR job_title LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s, s, s, s);
    }

    query += ' ORDER BY id ASC';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM team_members WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async create({ nameEn, nameAr = null, email, phone = null, employeeId = null, role = 'Staff', branch = null, department = null, jobTitle = null, status = 'Active' }) {
    const [result] = await pool.execute(
      'INSERT INTO team_members (name_en, name_ar, email, phone, employee_id, role, branch, department, job_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status]
    );

    return {
      id: result.insertId,
      nameEn,
      nameAr,
      email,
      phone,
      employeeId,
      role,
      branch,
      department,
      jobTitle,
      status,
    };
  }

  static async update(id, { nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status }) {
    await pool.execute(
      'UPDATE team_members SET name_en = ?, name_ar = ?, email = ?, phone = ?, employee_id = ?, role = ?, branch = ?, department = ?, job_title = ?, status = ? WHERE id = ?',
      [nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status, id]
    );
    return this.getById(id);
  }

  static async toggleStatus(id) {
    const current = await this.getById(id);
    if (!current) return null;
    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    await pool.execute('UPDATE team_members SET status = ? WHERE id = ?', [newStatus, id]);
    return { ...current, status: newStatus };
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM team_members WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TeamModel;
