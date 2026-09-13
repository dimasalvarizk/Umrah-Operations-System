const SystemListsService = require('../services/systemListsService');
const { successResponse, errorResponse } = require('../utils/response');

class SystemListsController {
  static async getItems(req, res) {
    try {
      const { category } = req.params;
      const { search } = req.query;

      const validCategories = [
        'agents',
        'airlines',
        'countries',
        'branches',
        'transport',
        'packages',
        'airports',
        'room_types',
        'guides',
        'routes',
      ];
      if (!validCategories.includes(category)) {
        return errorResponse(res, `Invalid category: ${category}`, 400);
      }

      const items = await SystemListsService.getItems(category, search);
      return successResponse(res, `Fetched ${category} successfully`, { items }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await SystemListsService.getItemById(id);
      if (!item) {
        return errorResponse(res, 'Item not found', 404);
      }
      return successResponse(res, 'Item fetched', { item }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async createItem(req, res) {
    try {
      const { category } = req.params;
      const { nameEn, nameAr, code, secondary, status, notes } = req.body;

      if (!nameEn || !nameAr) {
        return errorResponse(res, 'English name and Arabic name are required', 400);
      }

      const newItem = await SystemListsService.createItem({
        category,
        nameEn,
        nameAr,
        code,
        secondary,
        status: status || 'Active',
        notes,
      });

      return successResponse(res, 'Item added successfully', { item: newItem }, 201);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { nameEn, nameAr, code, secondary, status, notes } = req.body;

      if (!nameEn || !nameAr) {
        return errorResponse(res, 'English name and Arabic name are required', 400);
      }

      const updated = await SystemListsService.updateItem(id, {
        nameEn,
        nameAr,
        code,
        secondary,
        status,
        notes,
      });

      if (!updated) {
        return errorResponse(res, 'Item not found', 404);
      }

      return successResponse(res, 'Item updated successfully', { item: updated }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const updated = await SystemListsService.toggleStatus(id);
      if (!updated) {
        return errorResponse(res, 'Item not found', 404);
      }
      return successResponse(res, 'Status updated successfully', { item: updated }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const deleted = await SystemListsService.deleteItem(id);
      if (!deleted) {
        return errorResponse(res, 'Item not found or already deleted', 404);
      }
      return successResponse(res, 'Item deleted successfully', null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async resetCategory(req, res) {
    try {
      const { category } = req.params;
      const items = await SystemListsService.resetCategory(category);
      return successResponse(res, `Reset ${category} to defaults`, { items }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await SystemListsService.getStats();
      return successResponse(res, 'Stats fetched', { stats }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = SystemListsController;
