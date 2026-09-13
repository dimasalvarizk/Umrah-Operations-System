const express = require('express');
const router = express.Router();
const HotelsController = require('../controllers/hotelsController');

router.get('/', HotelsController.getHotels);
router.post('/', HotelsController.createHotel);
router.get('/:id', HotelsController.getHotelById);
router.put('/:id', HotelsController.updateHotel);
router.patch('/:id/status', HotelsController.updateHotelStatus);
router.delete('/:id', HotelsController.deleteHotel);

module.exports = router;
