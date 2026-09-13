const TripsService = require('../services/tripsService');

class TripsController {
  static async getTrips(req, res) {
    try {
      const { search, status, route } = req.query;
      const trips = await TripsService.listTrips({ search, status, route });
      return res.status(200).json({
        success: true,
        message: 'Trips fetched successfully',
        data: {
          trips,
          total: trips.length,
        },
      });
    } catch (error) {
      console.error('Error fetching trips:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch trips',
        error: error.message,
      });
    }
  }

  static async getTripById(req, res) {
    try {
      const { id } = req.params;
      const trip = await TripsService.getTripById(id);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Trip retrieved successfully',
        data: trip,
      });
    } catch (error) {
      console.error('Error fetching trip by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch trip details',
        error: error.message,
      });
    }
  }

  static async createTrip(req, res) {
    try {
      const { routeName, startDate, endDate } = req.body;
      if (!routeName || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'routeName, startDate, and endDate are required',
        });
      }

      const trip = await TripsService.createTrip(req.body);
      return res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: trip,
      });
    } catch (error) {
      console.error('Error creating trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create trip',
        error: error.message,
      });
    }
  }

  static async updateTrip(req, res) {
    try {
      const { id } = req.params;
      const trip = await TripsService.updateTrip(id, req.body);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found for update',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: trip,
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update trip',
        error: error.message,
      });
    }
  }

  static async updateTripStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status field is required',
        });
      }

      const trip = await TripsService.updateTripStatus(id, status);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Trip status updated successfully',
        data: trip,
      });
    } catch (error) {
      console.error('Error updating trip status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update trip status',
        error: error.message,
      });
    }
  }

  static async deleteTrip(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TripsService.deleteTrip(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found for deletion',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete trip',
        error: error.message,
      });
    }
  }
}

module.exports = TripsController;
