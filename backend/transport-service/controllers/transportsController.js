const TransportsService = require('../services/transportsService');

class TransportsController {
  static async getTransports(req, res) {
    try {
      const { search, region, status } = req.query;
      const transports = await TransportsService.listTransports({ search, region, status });
      return res.status(200).json({
        success: true,
        message: 'Transports fetched successfully',
        data: {
          transports,
          total: transports.length,
        },
      });
    } catch (error) {
      console.error('Error fetching transports:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch transports',
        error: error.message,
      });
    }
  }

  static async getTransportById(req, res) {
    try {
      const { id } = req.params;
      const transport = await TransportsService.getTransportById(id);
      if (!transport) {
        return res.status(404).json({
          success: false,
          message: 'Transport not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Transport retrieved successfully',
        data: transport,
      });
    } catch (error) {
      console.error('Error fetching transport by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch transport details',
        error: error.message,
      });
    }
  }

  static async createTransport(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'name is required',
        });
      }

      const transport = await TransportsService.createTransport(req.body);
      return res.status(201).json({
        success: true,
        message: 'Transport created successfully',
        data: transport,
      });
    } catch (error) {
      console.error('Error creating transport:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create transport',
        error: error.message,
      });
    }
  }

  static async updateTransport(req, res) {
    try {
      const { id } = req.params;
      const transport = await TransportsService.updateTransport(id, req.body);
      if (!transport) {
        return res.status(404).json({
          success: false,
          message: 'Transport not found for update',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Transport updated successfully',
        data: transport,
      });
    } catch (error) {
      console.error('Error updating transport:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update transport',
        error: error.message,
      });
    }
  }

  static async updateTransportStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required',
        });
      }

      const transport = await TransportsService.updateTransportStatus(id, status);
      if (!transport) {
        return res.status(404).json({
          success: false,
          message: 'Transport not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Transport status updated successfully',
        data: transport,
      });
    } catch (error) {
      console.error('Error updating transport status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update transport status',
        error: error.message,
      });
    }
  }

  static async deleteTransport(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TransportsService.deleteTransport(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Transport not found for deletion',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Transport deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting transport:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete transport',
        error: error.message,
      });
    }
  }
}

module.exports = TransportsController;
