const ActivityLogModel = require('../models/activityLogModel');
const { extractClientIp, getGeolocation } = require('../utils/geoIpHelper');

class ActivityLogController {
  /**
   * GET /api/activity-logs
   */
  static async getActivityLogs(req, res) {
    try {
      const {
        search,
        module,
        action,
        userName,
        startDate,
        endDate,
        limit = 50,
        offset = 0,
      } = req.query;

      const result = await ActivityLogModel.getAll({
        search,
        module,
        action,
        userName,
        startDate,
        endDate,
        limit: parseInt(limit, 10) || 50,
        offset: parseInt(offset, 10) || 0,
      });

      return res.status(200).json({
        success: true,
        message: 'Activity logs retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch activity logs',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/activity-logs/stats
   */
  static async getStats(req, res) {
    try {
      const stats = await ActivityLogModel.getStats();
      return res.status(200).json({
        success: true,
        message: 'Activity log statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching activity log stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch activity log stats',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/activity-logs
   */
  static async createActivityLog(req, res) {
    try {
      const {
        userId,
        userName,
        userEmail,
        userRole,
        action,
        module,
        entityId,
        entityName,
        descriptionEn,
        descriptionAr,
        metadata,
        ipAddress,
        loginCity,
        loginCountry,
        city,
        country,
      } = req.body;

      if (!descriptionEn && !descriptionAr) {
        return res.status(400).json({
          success: false,
          message: 'descriptionEn or descriptionAr is required',
        });
      }

      // Extract clean client IP (ignoring proxy chains)
      const clientIp = ipAddress || extractClientIp(req);
      const geo = (loginCity || city || loginCountry || country)
        ? {
            ip: clientIp,
            city: loginCity || city || 'Unknown',
            country: loginCountry || country || 'Unknown',
          }
        : getGeolocation(clientIp, req);

      const log = await ActivityLogModel.create({
        userId,
        userName: userName || req.headers['x-user-name'] || 'Husain',
        userEmail: userEmail || req.headers['x-user-email'] || null,
        userRole: userRole || req.headers['x-user-role'] || 'Super Admin',
        action: (action || 'CREATE').toUpperCase(),
        module: (module || 'general').toLowerCase(),
        entityId,
        entityName,
        descriptionEn: descriptionEn || descriptionAr,
        descriptionAr: descriptionAr || descriptionEn,
        metadata,
        ipAddress: geo.ip,
        loginCity: geo.city,
        loginCountry: geo.country,
      });

      return res.status(201).json({
        success: true,
        message: 'Activity log recorded successfully',
        data: log,
      });
    } catch (error) {
      console.error('Error recording activity log:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to record activity log',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/activity-logs/:id
   */
  static async deleteActivityLog(req, res) {
    try {
      const { id } = req.params;
      const success = await ActivityLogModel.delete(id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Activity log entry not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Activity log deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting activity log:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete activity log',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/activity-logs/clear-all
   */
  static async clearAllLogs(req, res) {
    try {
      await ActivityLogModel.clearAll();
      return res.status(200).json({
        success: true,
        message: 'All activity logs cleared successfully',
      });
    } catch (error) {
      console.error('Error clearing activity logs:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to clear activity logs',
        error: error.message,
      });
    }
  }
}

module.exports = ActivityLogController;
