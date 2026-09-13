const ContractsService = require('../services/contractsService');

class ContractsController {
  static async getContracts(req, res) {
    try {
      const { search, type, status } = req.query;
      const contracts = await ContractsService.listContracts({ search, type, status });
      return res.status(200).json({
        success: true,
        message: 'Contracts fetched successfully',
        data: {
          contracts,
          total: contracts.length,
        },
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contracts',
        error: error.message,
      });
    }
  }

  static async getContractById(req, res) {
    try {
      const { id } = req.params;
      const contract = await ContractsService.getContractById(id);
      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Contract retrieved successfully',
        data: contract,
      });
    } catch (error) {
      console.error('Error fetching contract by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contract details',
        error: error.message,
      });
    }
  }

  static async createContract(req, res) {
    try {
      const { agreementName, entityName, startDate, endDate } = req.body;
      if (!agreementName || !entityName || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'agreementName, entityName, startDate, and endDate are required',
        });
      }

      const contract = await ContractsService.createContract(req.body);
      return res.status(201).json({
        success: true,
        message: 'Contract created successfully',
        data: contract,
      });
    } catch (error) {
      console.error('Error creating contract:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create contract',
        error: error.message,
      });
    }
  }

  static async updateContract(req, res) {
    try {
      const { id } = req.params;
      const contract = await ContractsService.updateContract(id, req.body);
      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found for update',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Contract updated successfully',
        data: contract,
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update contract',
        error: error.message,
      });
    }
  }

  static async updateContractStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required',
        });
      }

      const contract = await ContractsService.updateContractStatus(id, status);
      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Contract status updated successfully',
        data: contract,
      });
    } catch (error) {
      console.error('Error updating contract status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update contract status',
        error: error.message,
      });
    }
  }

  static async deleteContract(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ContractsService.deleteContract(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found for deletion',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Contract deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting contract:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete contract',
        error: error.message,
      });
    }
  }
}

module.exports = ContractsController;
