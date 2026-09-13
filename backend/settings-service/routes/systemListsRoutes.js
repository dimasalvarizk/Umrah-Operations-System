const express = require('express');
const SystemListsController = require('../controllers/systemListsController');

const router = express.Router();

// Stats
router.get('/stats', SystemListsController.getStats);

// Items CRUD
router.get('/:category', SystemListsController.getItems);
router.get('/:category/:id', SystemListsController.getItemById);
router.post('/:category', SystemListsController.createItem);
router.put('/:category/:id', SystemListsController.updateItem);
router.patch('/:category/:id/status', SystemListsController.toggleStatus);
router.delete('/:category/:id', SystemListsController.deleteItem);
router.post('/:category/reset', SystemListsController.resetCategory);

module.exports = router;
