const NotificationModel = require('../models/notificationModel');
const { successResponse, errorResponse } = require('../utils/response');

class NotificationController {
  /**
   * Get notification settings for user
   * GET /api/settings/notifications
   */
  static async getSettings(req, res) {
    try {
      const userId = req.user?.id || req.query.userId || 1;
      const data = await NotificationModel.getByUserId(userId);
      return successResponse(res, 'Fetched notification settings', { settings: data?.settings || null }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update notification settings for user
   * PUT /api/settings/notifications
   */
  static async updateSettings(req, res) {
    try {
      const userId = req.user?.id || req.body.userId || 1;
      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        return errorResponse(res, 'Settings object is required', 400);
      }

      const updated = await NotificationModel.saveByUserId(userId, settings);
      return successResponse(res, 'Notification settings updated successfully', { settings: updated?.settings }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = NotificationController;
