const { pool } = require('../config/db');

class NotificationModel {
  /**
   * Get notification settings by userId (defaults to 1 if not specified)
   */
  static async getByUserId(userId = 1) {
    const [rows] = await pool.execute(
      'SELECT id, user_id, settings, updated_at FROM notification_settings WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (rows.length > 0) {
      let settings = rows[0].settings;
      if (typeof settings === 'string') {
        try {
          settings = JSON.parse(settings);
        } catch {}
      }
      return {
        id: rows[0].id,
        userId: rows[0].user_id,
        settings,
        updatedAt: rows[0].updated_at,
      };
    }

    return null;
  }

  /**
   * Save or update notification settings for a user
   */
  static async saveByUserId(userId = 1, settings) {
    const settingsJson = typeof settings === 'string' ? settings : JSON.stringify(settings);

    await pool.execute(
      `INSERT INTO notification_settings (user_id, settings)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE settings = VALUES(settings), updated_at = NOW()`,
      [userId, settingsJson]
    );

    return this.getByUserId(userId);
  }
}

module.exports = NotificationModel;
