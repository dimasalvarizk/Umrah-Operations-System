const HotelsService = require('../services/hotelsService');

class HotelsController {
  static async getHotels(req, res) {
    try {
      const { search, location, status } = req.query;
      const hotels = await HotelsService.listHotels({ search, location, status });
      return res.status(200).json({
        success: true,
        message: 'Hotels fetched successfully',
        data: {
          hotels,
          total: hotels.length,
        },
      });
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch hotels',
        error: error.message,
      });
    }
  }

  static async getHotelById(req, res) {
    try {
      const { id } = req.params;
      const hotel = await HotelsService.getHotelById(id);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Hotel retrieved successfully',
        data: hotel,
      });
    } catch (error) {
      console.error('Error fetching hotel by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch hotel details',
        error: error.message,
      });
    }
  }

  static async createHotel(req, res) {
    try {
      const { name, location } = req.body;
      if (!name || !location) {
        return res.status(400).json({
          success: false,
          message: 'name and location are required',
        });
      }

      const hotel = await HotelsService.createHotel(req.body);
      return res.status(201).json({
        success: true,
        message: 'Hotel created successfully',
        data: hotel,
      });
    } catch (error) {
      console.error('Error creating hotel:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create hotel',
        error: error.message,
      });
    }
  }

  static async updateHotel(req, res) {
    try {
      const { id } = req.params;
      const hotel = await HotelsService.updateHotel(id, req.body);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found for update',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Hotel updated successfully',
        data: hotel,
      });
    } catch (error) {
      console.error('Error updating hotel:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update hotel',
        error: error.message,
      });
    }
  }

  static async updateHotelStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required',
        });
      }

      const hotel = await HotelsService.updateHotelStatus(id, status);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Hotel status updated successfully',
        data: hotel,
      });
    } catch (error) {
      console.error('Error updating hotel status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update hotel status',
        error: error.message,
      });
    }
  }

  static async deleteHotel(req, res) {
    try {
      const { id } = req.params;
      const deleted = await HotelsService.deleteHotel(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found for deletion',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Hotel deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete hotel',
        error: error.message,
      });
    }
  }
}

module.exports = HotelsController;
