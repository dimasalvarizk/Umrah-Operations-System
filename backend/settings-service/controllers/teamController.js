const TeamModel = require('../models/teamModel');
const { successResponse, errorResponse } = require('../utils/response');

class TeamController {
  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const members = await TeamModel.getAll(search);
      return successResponse(res, 'Fetched team members', { members }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const member = await TeamModel.getById(id);
      if (!member) {
        return errorResponse(res, 'Member not found', 404);
      }
      return successResponse(res, 'Fetched member', { member }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async create(req, res) {
    try {
      const { nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status } = req.body;
      if (!nameEn || !email) {
        return errorResponse(res, 'Name and email are required', 400);
      }

      const member = await TeamModel.create({
        nameEn,
        nameAr,
        email,
        phone,
        employeeId,
        role: role || 'Staff',
        branch,
        department,
        jobTitle,
        status: status || 'Active',
      });

      return successResponse(res, 'Team member added', { member }, 201);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 'Email already exists', 400);
      }
      return errorResponse(res, error.message, 500);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nameEn, nameAr, email, phone, employeeId, role, branch, department, jobTitle, status } = req.body;

      const member = await TeamModel.update(id, {
        nameEn,
        nameAr,
        email,
        phone,
        employeeId,
        role,
        branch,
        department,
        jobTitle,
        status,
      });

      if (!member) {
        return errorResponse(res, 'Member not found', 404);
      }

      return successResponse(res, 'Team member updated', { member }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const member = await TeamModel.toggleStatus(id);
      if (!member) {
        return errorResponse(res, 'Member not found', 404);
      }
      return successResponse(res, 'Status updated', { member }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TeamModel.delete(id);
      if (!deleted) {
        return errorResponse(res, 'Member not found', 404);
      }
      return successResponse(res, 'Member deleted', null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = TeamController;
