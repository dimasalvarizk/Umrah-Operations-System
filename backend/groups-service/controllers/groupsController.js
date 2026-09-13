const GroupsService = require('../services/groupsService');
const { successResponse, errorResponse } = require('../utils/response');

class GroupsController {
  /**
   * GET /api/groups
   */
  static async getAll(req, res) {
    try {
      const { search = '', agent = '', status = '', limit = 100, offset = 0 } = req.query;
      const result = await GroupsService.getAllGroups({ search, agent, status, limit, offset });
      return successResponse(res, 'Groups fetched successfully', result, 200);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  /**
   * GET /api/groups/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const group = await GroupsService.getGroupById(id);
      if (!group) {
        return errorResponse(res, 'Group not found', 404);
      }
      return successResponse(res, 'Group fetched successfully', { group }, 200);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  /**
   * POST /api/groups
   */
  static async create(req, res) {
    try {
      const {
        code,
        name,
        groupName,
        groupCodeNumber,
        agreementNumber,
        mainAgent,
        subAgent,
        nationality,
        packageType,
        pilgrimsCount,
        status,
        hotelsData,
        flightTransportData,
        permitsNotesData,
      } = req.body;

      const groupData = {
        code: code || groupCodeNumber,
        name: name || groupName,
        agreementNumber,
        mainAgent,
        subAgent,
        nationality,
        packageType,
        pilgrimsCount: Number(pilgrimsCount) || 1,
        status: status || 'قيد التجهيز',
        hotelsData,
        flightTransportData,
        permitsNotesData,
      };

      if (!groupData.name) {
        return errorResponse(res, 'Group name is required', 400);
      }

      const created = await GroupsService.createGroup(groupData);
      return successResponse(res, 'Group created successfully', { group: created }, 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  /**
   * PUT /api/groups/:id
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        code,
        name,
        groupName,
        groupCodeNumber,
        agreementNumber,
        mainAgent,
        subAgent,
        nationality,
        packageType,
        pilgrimsCount,
        status,
        hotelsData,
        flightTransportData,
        permitsNotesData,
      } = req.body;

      const groupData = {
        code: code || groupCodeNumber,
        name: name || groupName,
        agreementNumber,
        mainAgent,
        subAgent,
        nationality,
        packageType,
        pilgrimsCount: pilgrimsCount !== undefined ? Number(pilgrimsCount) : undefined,
        status,
        hotelsData,
        flightTransportData,
        permitsNotesData,
      };

      const updated = await GroupsService.updateGroup(id, groupData);
      return successResponse(res, 'Group updated successfully', { group: updated }, 200);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  /**
   * PATCH /api/groups/:id/status
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return errorResponse(res, 'Status is required', 400);
      }

      const updated = await GroupsService.updateGroupStatus(id, status);
      return successResponse(res, 'Group status updated successfully', { group: updated }, 200);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  /**
   * DELETE /api/groups/:id
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await GroupsService.deleteGroup(id);
      return successResponse(res, 'Group deleted successfully', null, 200);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }
}

module.exports = GroupsController;
