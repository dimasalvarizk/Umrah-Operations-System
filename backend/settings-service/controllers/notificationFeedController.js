const NotificationFeedModel = require('../models/notificationFeedModel');
const EmailService = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/response');

class NotificationFeedController {
  /**
   * GET /api/settings/notifications/feed
   * or GET /api/notifications
   */
  static async getFeed(req, res) {
    try {
      const { limit = 50, offset = 0, unreadOnly = 'false', userId } = req.query;
      const data = await NotificationFeedModel.getAll({
        limit: parseInt(limit, 10) || 50,
        offset: parseInt(offset, 10) || 0,
        unreadOnly: unreadOnly === 'true' || unreadOnly === '1',
        userId: userId ? parseInt(userId, 10) : null,
      });

      return successResponse(res, 'Fetched notifications feed', data, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * POST /api/settings/notifications/feed
   */
  static async createNotification(req, res) {
    try {
      const { titleEn, titleAr, descEn, descAr, type, referenceId, referenceLink, userId, recipientEmail, sendEmail } = req.body;

      if (!titleEn) {
        return errorResponse(res, 'titleEn is required', 400);
      }

      const notification = await NotificationFeedModel.create({
        titleEn,
        titleAr: titleAr || titleEn,
        descEn: descEn || '',
        descAr: descAr || descEn || '',
        type: type || 'system',
        referenceId: referenceId || null,
        referenceLink: referenceLink || null,
        userId: userId || null,
      });

      // Send email alert via Titan Email (enabled by default for operational alerts)
      if (sendEmail !== false) {
        const targetEmail = recipientEmail || process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || 'info@odst.id';
        try {
          await EmailService.sendNotificationAlert({
            to: targetEmail,
            titleEn,
            titleAr,
            descEn,
            descAr,
            type: type || 'system',
            referenceLink,
          });
        } catch (emailErr) {
          console.warn('Failed to dispatch email alert:', emailErr.message);
        }
      }


      return successResponse(res, 'Notification created successfully', { notification }, 201);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * POST /api/settings/notifications/send-email-alert
   * Explicit endpoint to trigger email alerts to administrators/staff
   */
  static async sendEmailAlert(req, res) {
    try {
      const { to, titleEn, titleAr, descEn, descAr, type = 'system', referenceLink, createFeedItem } = req.body;

      if (!titleEn && !titleAr) {
        return errorResponse(res, 'Notification title is required', 400);
      }

      // Resolve recipient(s)
      let recipientList = to;
      if (!recipientList || recipientList === 'all' || recipientList === 'info@odst.id') {
        const adminEmails = await EmailService.getAdminRecipients();
        recipientList = adminEmails.length > 0 ? adminEmails : ['alvarizkidimas@gmail.com', 'ali@odst.id', 'info@odst.id'];
      }

      // 1. Dispatch Email via Titan Email
      await EmailService.sendNotificationAlert({
        to: recipientList,
        titleEn: titleEn || 'System Notification',
        titleAr: titleAr || '',
        descEn: descEn || '',
        descAr: descAr || '',
        type,
        referenceLink,
      });

      // 2. Only register into notification feed if explicitly requested (to prevent double insert)
      if (createFeedItem) {
        await NotificationFeedModel.create({
          titleEn: titleEn || 'System Notification',
          titleAr: titleAr || titleEn || 'System Notification',
          descEn: descEn || '',
          descAr: descAr || descEn || '',
          type,
          referenceLink,
        });
      }

      return successResponse(res, `Notification email dispatched successfully to ${Array.isArray(recipientList) ? recipientList.join(', ') : recipientList}`, { to: recipientList }, 200);
    } catch (error) {
      console.error('Error sending email notification alert:', error);
      return errorResponse(res, `Failed to send email alert: ${error.message}`, 500);
    }
  }



  /**
   * PATCH /api/settings/notifications/feed/:id/read
   */
  static async markRead(req, res) {
    try {
      const { id } = req.params;
      await NotificationFeedModel.markAsRead(id);
      return successResponse(res, 'Notification marked as read', { id, isRead: true }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * PATCH /api/settings/notifications/feed/mark-all-read
   */
  static async markAllRead(req, res) {
    try {
      const userId = req.body?.userId || req.query?.userId || null;
      await NotificationFeedModel.markAllAsRead(userId);
      return successResponse(res, 'All notifications marked as read', { success: true }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * DELETE /api/settings/notifications/feed/:id
   */
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      await NotificationFeedModel.delete(id);
      return successResponse(res, 'Notification deleted successfully', { id }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * POST /api/settings/notifications/feed/seed
   */
  static async seedFeed(req, res) {
    try {
      await NotificationFeedModel.seedInitialIfEmpty();
      const data = await NotificationFeedModel.getAll({ limit: 50 });
      return successResponse(res, 'Notifications feed seeded successfully', data, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = NotificationFeedController;
