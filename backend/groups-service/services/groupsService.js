const GroupModel = require('../models/groupModel');
const { pool } = require('../config/db');
const { notifyAndEmail } = require('../utils/notificationNotifier');

class GroupsService {
  static async getAllGroups({ search, agent, status, limit, offset }) {
    const groups = await GroupModel.getAll({ search, agent, status, limit, offset });
    const total = await GroupModel.count({ search, agent, status });
    return { groups, total };
  }

  static async getGroupById(id) {
    return GroupModel.getById(id);
  }

  static async createGroup(data) {
    // Generate code if not provided
    if (!data.code) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      data.code = `GRP-${randomSuffix}`;
    }

    // Check duplicate code
    const existing = await GroupModel.getByCode(data.code);
    if (existing) {
      const error = new Error(`Group code ${data.code} already exists`);
      error.statusCode = 400;
      throw error;
    }

    const created = await GroupModel.create(data);

    // Push live notification & email alert
    await notifyAndEmail({
      titleEn: `New Group Created: ${created.name}`,
      titleAr: `تم تسجيل مجموعة جديدة: ${created.name}`,
      descEn: `Group ${created.name} (${created.code}) with ${created.pilgrimsCount || 1} pilgrims is now active in operations.`,
      descAr: `المجموعة ${created.name} (${created.code}) بعدد ${created.pilgrimsCount || 1} معتمر جاهزة للتشغيل.`,
      type: 'group',
      referenceId: created.code,
      referenceLink: `/groups?openGroup=${encodeURIComponent(created.code)}`,
    });

    return created;
  }

  static async updateGroup(id, data) {
    const existing = await GroupModel.getById(id);
    if (!existing) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.code && data.code !== existing.code) {
      const duplicate = await GroupModel.getByCode(data.code);
      if (duplicate && duplicate.id !== id) {
        const error = new Error(`Group code ${data.code} is already used by another group`);
        error.statusCode = 400;
        throw error;
      }
    }

    const updated = await GroupModel.update(id, data);

    // Push live notification & email alert
    await notifyAndEmail({
      titleEn: `Group Details Updated: ${updated.name}`,
      titleAr: `تحديث بيانات المجموعة: ${updated.name}`,
      descEn: `Operational details updated for Group ${updated.name} (${updated.code}).`,
      descAr: `تم تحديث البيانات التشغيلية للمجموعة ${updated.name} (${updated.code}).`,
      type: 'group',
      referenceId: updated.code,
      referenceLink: `/groups?openGroup=${encodeURIComponent(updated.code)}`,
    });

    return updated;
  }

  static async updateGroupStatus(id, status) {
    const existing = await GroupModel.getById(id);
    if (!existing) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    const updated = await GroupModel.updateStatus(id, status);

    // Push live notification & email alert
    await notifyAndEmail({
      titleEn: `Group Status Changed: ${existing.name} -> ${status}`,
      titleAr: `تغيير حالة المجموعة: ${existing.name} -> ${status}`,
      descEn: `Group ${existing.name} (${existing.code}) status changed to: ${status}.`,
      descAr: `تم تغيير حالة المجموعة ${existing.name} (${existing.code}) إلى: ${status}.`,
      type: 'permit',
      referenceId: existing.code,
      referenceLink: `/groups?openGroup=${encodeURIComponent(existing.code)}`,
    });

    return updated;
  }


  static async deleteGroup(id) {
    const existing = await GroupModel.getById(id);
    if (!existing) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    return GroupModel.delete(id);
  }
}

module.exports = GroupsService;
