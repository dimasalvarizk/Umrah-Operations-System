const express = require('express');
const TeamController = require('../controllers/teamController');

const router = express.Router();

router.get('/', TeamController.getAll);
router.get('/:id', TeamController.getById);
router.post('/', TeamController.create);
router.put('/:id', TeamController.update);
router.patch('/:id/status', TeamController.toggleStatus);
router.delete('/:id', TeamController.delete);

module.exports = router;
