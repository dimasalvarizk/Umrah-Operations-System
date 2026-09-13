const express = require('express');
const NotificationController = require('../controllers/notificationController');
const NotificationFeedController = require('../controllers/notificationFeedController');

const router = express.Router();

// Operational Notifications Feed
router.get('/feed', NotificationFeedController.getFeed);
router.post('/feed', NotificationFeedController.createNotification);
router.post('/send-email-alert', NotificationFeedController.sendEmailAlert);
router.patch('/feed/mark-all-read', NotificationFeedController.markAllRead);
router.patch('/feed/:id/read', NotificationFeedController.markRead);
router.delete('/feed/:id', NotificationFeedController.deleteNotification);
router.post('/feed/seed', NotificationFeedController.seedFeed);

// Direct root mapping for /api/notifications
router.get('/list', NotificationFeedController.getFeed);
router.post('/send', NotificationFeedController.createNotification);
router.post('/send-email', NotificationFeedController.sendEmailAlert);

// Notification Settings
router.get('/', NotificationController.getSettings);
router.put('/', NotificationController.updateSettings);

module.exports = router;

