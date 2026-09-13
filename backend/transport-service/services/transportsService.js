const TransportModel = require('../models/transportModel');
const { pool } = require('../config/db');
const { notifyAndEmail } = require('../utils/notificationNotifier');

function safeJsonParse(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function formatTransport(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    code: row.code,
    name: row.name,
    nameEn: row.name_en,
    status: row.status,
    rating: Number(row.rating),
    fleetSize: row.fleet_size,
    fleetLabel: row.fleet_label || `${row.fleet_size} مركبة`,
    fleetLabelEn: row.fleet_label_en || `${row.fleet_size} Vehicles`,
    phone: row.phone,
    email: row.email,
    address: row.address,
    region: row.region,
    regionEn: row.region_en,
    vehicleCategory: row.vehicle_category,
    vehicleCategoryEn: row.vehicle_category_en,
    image: row.image,
    photos: safeJsonParse(row.photos_data, []),
    pricingRows: safeJsonParse(row.pricing_rates_data, []),
    description: row.description,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class TransportsService {
  static async listTransports(filters) {
    const rows = await TransportModel.getAll(filters);
    return rows.map(formatTransport);
  }

  static async getTransportById(id) {
    const row = await TransportModel.getById(id);
    return formatTransport(row);
  }

  static async createTransport(data) {
    const row = await TransportModel.create(data);
    const formatted = formatTransport(row);

    if (formatted) {
      await notifyAndEmail({
        titleEn: `New Transport Provider Added: ${formatted.nameEn || formatted.name}`,
        titleAr: `تمت إضافة شركة نقل جديدة: ${formatted.name}`,
        descEn: `Company ${formatted.name} in ${formatted.regionEn || formatted.region} added with ${formatted.fleetLabelEn || formatted.fleetLabel}.`,
        descAr: `تم إدراج شركة ${formatted.name} في ${formatted.region} بأسطول ${formatted.fleetLabel}.`,
        type: 'transport',
        referenceId: formatted.code || String(formatted.id),
        referenceLink: '/transport',
      });
    }

    return formatted;
  }

  static async updateTransport(id, data) {
    const row = await TransportModel.update(id, data);
    return formatTransport(row);
  }

  static async updateTransportStatus(id, status) {
    const row = await TransportModel.updateStatus(id, status);
    const formatted = formatTransport(row);

    if (formatted) {
      await notifyAndEmail({
        titleEn: `Transport Provider Status Changed: ${formatted.name}`,
        titleAr: `تغيير حالة مزود النقل: ${formatted.name}`,
        descEn: `Transport provider ${formatted.name} status updated to: ${status}.`,
        descAr: `تم تحديث حالة شركة النقل ${formatted.name} إلى: ${status}.`,
        type: 'transport',
        referenceId: formatted.code || String(formatted.id),
        referenceLink: '/transport',
      });
    }

    return formatted;
  }

  static async deleteTransport(id) {
    return await TransportModel.delete(id);
  }
}

module.exports = TransportsService;
