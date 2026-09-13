const { pool } = require('../config/db');

class UserModel {
  /**
   * Find a user by email
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, phone, avatar, employee_id, branch, department, job_title, status, last_login, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  }

  /**
   * Find a user by ID
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, avatar, employee_id, branch, department, job_title, status, last_login, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Find user password hash by ID
   * @param {number} id
   * @returns {Promise<string|null>}
   */
  static async findPasswordById(id) {
    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0]?.password || null;
  }

  /**
   * Create a new user in database
   * @param {object} userData
   * @returns {Promise<object>} created user
   */
  static async create({ name, email, password, role = 'admin', phone = null, avatar = null, employeeId = null, branch = null, department = null, jobTitle = null }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, phone, avatar, employee_id, branch, department, job_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), password, role, phone, avatar, employeeId, branch, department, jobTitle, 'active']
    );

    return {
      id: result.insertId,
      name,
      email: email.toLowerCase().trim(),
      role,
      phone,
      avatar,
      employeeId,
      branch,
      department,
      jobTitle,
      status: 'active',
    };
  }

  /**
   * Update user profile information
   * @param {number} id
   * @param {object} profileData
   */
  static async updateProfile(id, { name, phone, avatar, employeeId, branch, department, jobTitle }) {
    await pool.execute(
      'UPDATE users SET name = COALESCE(?, name), phone = ?, avatar = COALESCE(?, avatar), employee_id = COALESCE(?, employee_id), branch = COALESCE(?, branch), department = COALESCE(?, department), job_title = COALESCE(?, job_title) WHERE id = ?',
      [name, phone, avatar, employeeId, branch, department, jobTitle, id]
    );
    return this.findById(id);
  }

  /**
   * Update user password
   * @param {number} id
   * @param {string} hashedPassword
   */
  static async updatePassword(id, hashedPassword) {
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update user last login timestamp
   * @param {number} id
   */
  static async updateLastLogin(id) {
    await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
  }
}

module.exports = UserModel;
