const { pool } = require('../config/db');

function safeJsonParse(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function formatActivityLog(row) {
  if (!row) return null;

  const city = row.login_city || (row.ip_address === '127.0.0.1' ? 'Local' : null);
  const country = row.login_country || null;
  const location = (city === 'Local' || city === 'Localhost')
    ? 'Localhost'
    : (city && country && city !== 'Unknown' && country !== 'Unknown'
        ? `${city}, ${country}`
        : (city && city !== 'Unknown' ? city : (country && country !== 'Unknown' ? country : null)));

  return {
    id: String(row.id),
    userId: row.user_id || null,
    userName: row.user_name || 'System User',
    userEmail: row.user_email || null,
    userRole: row.user_role || 'Staff',
    action: row.action || 'OTHER',
    module: row.module || 'general',
    entityId: row.entity_id || null,
    entityName: row.entity_name || null,
    descriptionEn: row.description_en || '',
    descriptionAr: row.description_ar || row.description_en || '',
    metadata: safeJsonParse(row.metadata, null),
    ipAddress: row.ip_address || null,
    loginCity: row.login_city || null,
    loginCountry: row.login_country || null,
    city: row.login_city || null,
    country: row.login_country || null,
    location: location || (row.ip_address === '127.0.0.1' ? 'Localhost' : (row.ip_address || null)),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

class ActivityLogModel {
  /**
   * Ensure table activity_logs exists and has up-to-date schema
   */
  static async ensureTable() {
    try {
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS \`activity_logs\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`user_id\` INT DEFAULT NULL,
          \`user_name\` VARCHAR(150) NOT NULL,
          \`user_email\` VARCHAR(150) DEFAULT NULL,
          \`user_role\` VARCHAR(50) DEFAULT 'Staff',
          \`action\` VARCHAR(50) NOT NULL,
          \`module\` VARCHAR(50) NOT NULL,
          \`entity_id\` VARCHAR(100) DEFAULT NULL,
          \`entity_name\` VARCHAR(255) DEFAULT NULL,
          \`description_en\` TEXT NOT NULL,
          \`description_ar\` TEXT NOT NULL,
          \`metadata\` JSON DEFAULT NULL,
          \`ip_address\` VARCHAR(45) DEFAULT NULL,
          \`login_city\` VARCHAR(100) DEFAULT NULL,
          \`login_country\` VARCHAR(100) DEFAULT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX \`idx_act_user_name\` (\`user_name\`),
          INDEX \`idx_act_module\` (\`module\`),
          INDEX \`idx_act_action\` (\`action\`),
          INDEX \`idx_act_created_at\` (\`created_at\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      await pool.query(createTableSql);

      // Auto-migrate newly added columns if table previously created
      const [cols] = await pool.query(`SHOW COLUMNS FROM \`activity_logs\``);
      const colNames = cols.map((c) => c.Field);

      if (!colNames.includes('ip_address')) {
        await pool.query(`ALTER TABLE \`activity_logs\` ADD COLUMN \`ip_address\` VARCHAR(45) DEFAULT NULL AFTER \`metadata\``);
      }
      if (!colNames.includes('login_city')) {
        await pool.query(`ALTER TABLE \`activity_logs\` ADD COLUMN \`login_city\` VARCHAR(100) DEFAULT NULL AFTER \`ip_address\``);
      }
      if (!colNames.includes('login_country')) {
        await pool.query(`ALTER TABLE \`activity_logs\` ADD COLUMN \`login_country\` VARCHAR(100) DEFAULT NULL AFTER \`login_city\``);
      }
    } catch (err) {
      console.warn('ActivityLogModel.ensureTable note:', err.message);
    }
  }

  /**
   * Query activity logs with flexible filters & pagination
   */
  static async getAll({
    search = '',
    module = '',
    action = '',
    userName = '',
    startDate = '',
    endDate = '',
    limit = 50,
    offset = 0,
  } = {}) {
    await this.ensureTable();

    let sql = 'SELECT * FROM `activity_logs` WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      sql += ' AND (user_name LIKE ? OR user_email LIKE ? OR entity_id LIKE ? OR entity_name LIKE ? OR description_en LIKE ? OR description_ar LIKE ?)';
      params.push(q, q, q, q, q, q);
    }

    if (module && module !== 'all' && module !== 'الكل' && module !== 'All') {
      sql += ' AND module = ?';
      params.push(module.toLowerCase().trim());
    }

    if (action && action !== 'all' && action !== 'الكل' && action !== 'All') {
      sql += ' AND action = ?';
      params.push(action.toUpperCase().trim());
    }

    if (userName && userName !== 'all' && userName !== 'الكل' && userName !== 'All') {
      sql += ' AND (user_name = ? OR user_name LIKE ?)';
      params.push(userName, `%${userName}%`);
    }

    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(`${endDate} 23:59:59`);
    }

    // Count Total matching
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);
    return {
      logs: rows.map(formatActivityLog),
      total,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  /**
   * Get activity log KPI statistics
   */
  static async getStats() {
    await this.ensureTable();

    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM `activity_logs`');
    const total = totalRows[0]?.total || 0;

    const [actionRows] = await pool.query(`
      SELECT 
        SUM(CASE WHEN action = 'CREATE' THEN 1 ELSE 0 END) as creates,
        SUM(CASE WHEN action = 'UPDATE' THEN 1 ELSE 0 END) as updates,
        SUM(CASE WHEN action = 'DELETE' THEN 1 ELSE 0 END) as deletes,
        SUM(CASE WHEN action = 'STATUS_CHANGE' THEN 1 ELSE 0 END) as statusChanges,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM \`activity_logs\`
    `);

    const stats = actionRows[0] || {};

    const [userRows] = await pool.query(`
      SELECT user_name, user_role, COUNT(*) as count 
      FROM \`activity_logs\` 
      GROUP BY user_name, user_role 
      ORDER BY count DESC 
      LIMIT 5
    `);

    const [moduleRows] = await pool.query(`
      SELECT module, COUNT(*) as count 
      FROM \`activity_logs\` 
      GROUP BY module 
      ORDER BY count DESC
    `);

    return {
      total,
      createdCount: Number(stats.creates) || 0,
      updatedCount: Number(stats.updates) || 0,
      deletedCount: Number(stats.deletes) || 0,
      statusChangesCount: Number(stats.statusChanges) || 0,
      todayCount: Number(stats.today) || 0,
      topUsers: userRows.map((u) => ({
        userName: u.user_name,
        userRole: u.user_role,
        count: Number(u.count),
      })),
      moduleBreakdown: moduleRows.map((m) => ({
        module: m.module,
        count: Number(m.count),
      })),
    };
  }

  /**
   * Insert a new activity log record
   */
  static async create({
    userId = null,
    userName = 'Husain',
    userEmail = null,
    userRole = 'Super Admin',
    action = 'CREATE',
    module = 'general',
    entityId = null,
    entityName = null,
    descriptionEn = '',
    descriptionAr = '',
    metadata = null,
    ipAddress = null,
    loginCity = null,
    loginCountry = null,
    city = null,
    country = null,
  }) {
    await this.ensureTable();

    const metaJson = metadata ? (typeof metadata === 'object' ? JSON.stringify(metadata) : metadata) : null;
    const finalCity = loginCity || city || null;
    const finalCountry = loginCountry || country || null;

    const sql = `
      INSERT INTO \`activity_logs\` (
        \`user_id\`, \`user_name\`, \`user_email\`, \`user_role\`,
        \`action\`, \`module\`, \`entity_id\`, \`entity_name\`,
        \`description_en\`, \`description_ar\`, \`metadata\`,
        \`ip_address\`, \`login_city\`, \`login_country\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      userId || null,
      userName || 'System User',
      userEmail || null,
      userRole || 'Staff',
      (action || 'OTHER').toUpperCase(),
      (module || 'general').toLowerCase(),
      entityId ? String(entityId) : null,
      entityName ? String(entityName) : null,
      descriptionEn || '',
      descriptionAr || descriptionEn || '',
      metaJson,
      ipAddress || null,
      finalCity,
      finalCountry,
    ];

    const [result] = await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM `activity_logs` WHERE id = ?', [result.insertId]);
    return formatActivityLog(rows[0]);
  }

  /**
   * Delete a single activity log entry
   */
  static async delete(id) {
    await this.ensureTable();
    const [result] = await pool.query('DELETE FROM `activity_logs` WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Clear all activity logs
   */
  static async clearAll() {
    await this.ensureTable();
    await pool.query('TRUNCATE TABLE `activity_logs`');
    return true;
  }

  /**
   * Seed initial activity logs (disabled to ensure clean production audit trail)
   */
  static async seedInitialIfEmpty() {
    await this.ensureTable();
  }
}

module.exports = ActivityLogModel;
