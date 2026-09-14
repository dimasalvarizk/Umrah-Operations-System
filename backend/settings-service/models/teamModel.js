const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

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
    const cleanEmail = String(email || '').toLowerCase().trim();
    const cleanStatus = status?.toLowerCase() === 'active' ? 'Active' : 'Inactive';
    const userStatus = cleanStatus === 'Active' ? 'active' : 'inactive';
    const displayName = (nameEn || nameAr || cleanEmail).trim();

    const [result] = await pool.execute(
      'INSERT INTO team_members (name_en, name_ar, email, phone, employee_id, role, branch, department, job_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nameEn, nameAr, cleanEmail, phone, employeeId, role, branch, department, jobTitle, cleanStatus]
    );

    const teamMemberId = result.insertId;

    // Automatically sync into users table so new team member can immediately log in
    try {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const [existingUsers] = await pool.query('SELECT id FROM `users` WHERE `email` = ? LIMIT 1', [cleanEmail]);
      let userId = null;

      if (existingUsers.length === 0) {
        const [userResult] = await pool.execute(
          'INSERT INTO users (name, email, password, role, phone, employee_id, branch, department, job_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [displayName, cleanEmail, hashedPassword, role, phone, employeeId, branch, department, jobTitle, userStatus]
        );
        userId = userResult.insertId;
      } else {
        userId = existingUsers[0].id;
        await pool.execute(
          'UPDATE users SET name = ?, role = ?, phone = ?, employee_id = ?, branch = ?, department = ?, job_title = ?, status = ? WHERE id = ?',
          [displayName, role, phone, employeeId, branch, department, jobTitle, userStatus, userId]
        );
      }

      if (userId) {
        await pool.execute('UPDATE team_members SET user_id = ? WHERE id = ?', [userId, teamMemberId]);
      }
    } catch (syncErr) {
      console.warn('TeamModel.create users sync warning:', syncErr.message);
    }

    return {
      id: teamMemberId,
      nameEn,
      nameAr,
      email: cleanEmail,
      phone,
      employeeId,
      role,
      branch,
      department,
      jobTitle,
      status: cleanStatus,
    };
  }

  static async update(id, { nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status }) {
    const current = await this.getById(id);
    if (!current) return null;

    const cleanEmail = (email || current.email).toLowerCase().trim();
    const cleanStatus = (status || current.status).toLowerCase() === 'active' ? 'Active' : 'Inactive';
    const userStatus = cleanStatus === 'Active' ? 'active' : 'inactive';
    const displayName = (nameEn || nameAr || current.name_en || current.name_ar || cleanEmail).trim();

    await pool.execute(
      'UPDATE team_members SET name_en = ?, name_ar = ?, email = ?, phone = ?, employee_id = ?, role = ?, branch = ?, department = ?, job_title = ?, status = ? WHERE id = ?',
      [nameEn, nameAr, cleanEmail, phone, employeeId, role, branch, department, jobTitle, cleanStatus, id]
    );

    // Sync updates to users table
    try {
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, employee_id = ?, branch = ?, department = ?, job_title = ?, status = ? WHERE email = ? OR id = ?',
        [displayName, cleanEmail, role || current.role, phone, employeeId, branch, department, jobTitle, userStatus, current.email, current.user_id || 0]
      );
    } catch (syncErr) {
      console.warn('TeamModel.update users sync warning:', syncErr.message);
    }

    return this.getById(id);
  }

  static async toggleStatus(id) {
    const current = await this.getById(id);
    if (!current) return null;
    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    const userStatus = newStatus === 'Active' ? 'active' : 'inactive';

    await pool.execute('UPDATE team_members SET status = ? WHERE id = ?', [newStatus, id]);

    try {
      await pool.execute('UPDATE users SET status = ? WHERE email = ? OR id = ?', [userStatus, current.email, current.user_id || 0]);
    } catch (syncErr) {
      console.warn('TeamModel.toggleStatus users sync warning:', syncErr.message);
    }

    return { ...current, status: newStatus };
  }

  static async delete(id) {
    const current = await this.getById(id);
    if (!current) return false;

    const [result] = await pool.execute('DELETE FROM team_members WHERE id = ?', [id]);

    try {
      await pool.execute('DELETE FROM users WHERE email = ? OR id = ?', [current.email, current.user_id || 0]);
    } catch (syncErr) {
      console.warn('TeamModel.delete users sync warning:', syncErr.message);
    }

    return result.affectedRows > 0;
  }
}

module.exports = TeamModel;
