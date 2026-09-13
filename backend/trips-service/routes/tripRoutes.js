const express = require('express');
const router = express.Router();
const TripsController = require('../controllers/tripsController');

router.get('/', TripsController.getTrips);
router.post('/', TripsController.createTrip);
router.get('/:id', TripsController.getTripById);
router.put('/:id', TripsController.updateTrip);
router.patch('/:id/status', TripsController.updateTripStatus);
router.delete('/:id', TripsController.deleteTrip);

module.exports = router;
