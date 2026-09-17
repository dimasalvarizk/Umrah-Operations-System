const express = require('express');
const router = express.Router();
const ActivityLogController = require('../controllers/activityLogController');

router.get('/', ActivityLogController.getActivityLogs);
router.get('/stats', ActivityLogController.getStats);
router.post('/', ActivityLogController.createActivityLog);
router.delete('/clear-all', ActivityLogController.clearAllLogs);
router.delete('/:id', ActivityLogController.deleteActivityLog);

module.exports = router;
