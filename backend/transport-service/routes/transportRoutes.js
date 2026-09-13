const express = require('express');
const router = express.Router();
const TransportsController = require('../controllers/transportsController');

router.get('/', TransportsController.getTransports);
router.post('/', TransportsController.createTransport);
router.get('/:id', TransportsController.getTransportById);
router.put('/:id', TransportsController.updateTransport);
router.patch('/:id/status', TransportsController.updateTransportStatus);
router.delete('/:id', TransportsController.deleteTransport);

module.exports = router;
