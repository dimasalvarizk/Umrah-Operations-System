const { pool } = require('../config/db');

class NotificationFeedModel {
  /**
   * Get all notifications with unread count
   */
  static async getAll({ limit = 50, offset = 0, unreadOnly = false, userId = null } = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (unreadOnly) {
      whereClause += ' AND is_read = 0';
    }

    if (userId) {
      whereClause += ' AND (user_id = ? OR user_id IS NULL)';
      params.push(userId);
    }

    const query = `
      SELECT 
        id, 
        title_en AS titleEn, 
        title_ar AS titleAr, 
        desc_en AS descEn, 
        desc_ar AS descAr, 
        type, 
        reference_id AS referenceId, 
        reference_link AS referenceLink, 
        is_read = 1 AS isRead, 
        user_id AS userId, 
        created_at AS createdAt, 
        updated_at AS updatedAt
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);

    // Count unread
    let unreadCountQuery = 'SELECT COUNT(*) as unreadCount FROM notifications WHERE is_read = 0';
    const unreadParams = [];
    if (userId) {
      unreadCountQuery += ' AND (user_id = ? OR user_id IS NULL)';
      unreadParams.push(userId);
    }
    const [countRows] = await pool.query(unreadCountQuery, unreadParams);
    const unreadCount = countRows[0]?.unreadCount || 0;

    // Count total
    const [totalRows] = await pool.query(`SELECT COUNT(*) as total FROM notifications ${whereClause}`, params.slice(0, -2));
    const total = totalRows[0]?.total || 0;

    return {
      notifications: rows,
      unreadCount,
      total,
    };
  }

  /**
   * Create a single notification
   */
  static async create({
    titleEn,
    titleAr,
    descEn,
    descAr,
    type = 'system',
    referenceId = null,
    referenceLink = null,
    userId = null,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO notifications (title_en, title_ar, desc_en, desc_ar, type, reference_id, reference_link, is_read, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [titleEn, titleAr || titleEn, descEn || '', descAr || descEn || '', type, referenceId, referenceLink, userId]
    );

    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        titleEn: row.title_en,
        titleAr: row.title_ar,
        descEn: row.desc_en,
        descAr: row.desc_ar,
        type: row.type,
        referenceId: row.reference_id,
        referenceLink: row.reference_link,
        isRead: Boolean(row.is_read),
        userId: row.user_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }
    return null;
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(id) {
    await pool.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    return true;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId = null) {
    if (userId) {
      await pool.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL', [userId]);
    } else {
      await pool.execute('UPDATE notifications SET is_read = 1');
    }
    return true;
  }

  /**
   * Delete a notification
   */
  static async delete(id) {
    await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);
    return true;
  }

  /**
   * Sync notifications strictly from real DB records (no dummy data)
   */
  static async seedInitialIfEmpty() {
    try {
      const [countRows] = await pool.query('SELECT COUNT(*) as cnt FROM notifications');
      if (countRows[0]?.cnt > 0) {
        return;
      }

      // Strictly query REAL groups from the database only
      const [realGroups] = await pool.query('SELECT id, code, name, pilgrims_count, created_at FROM `groups` ORDER BY created_at DESC LIMIT 10');
      
      for (const g of realGroups) {
        await pool.execute(
          `INSERT INTO notifications (title_en, title_ar, desc_en, desc_ar, type, reference_id, reference_link, is_read, created_at)
           VALUES (?, ?, ?, ?, 'group', ?, '/groups', 0, ?)`,
          [
            `New Group Registered: ${g.name}`,
            `تسجيل مجموعة عمرة: ${g.name}`,
            `Group ${g.name} (${g.code}) with ${g.pilgrims_count || 1} pilgrims is active in operations.`,
            `المجموعة ${g.name} (${g.code}) بعدد ${g.pilgrims_count || 1} معتمر نشطة في العمليات.`,
            g.code,
            g.created_at || new Date(),
          ]
        );
      }
    } catch (e) {
      console.error('Error syncing real records:', e.message);
    }
  }
}

module.exports = NotificationFeedModel;
