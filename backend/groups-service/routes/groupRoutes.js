const express = require('express');
const GroupsController = require('../controllers/groupsController');

const router = express.Router();

router.get('/', GroupsController.getAll);
router.get('/:id', GroupsController.getById);
router.post('/', GroupsController.create);
router.put('/:id', GroupsController.update);
router.patch('/:id/status', GroupsController.updateStatus);
router.delete('/:id', GroupsController.delete);

module.exports = router;
