const ContractModel = require('../models/contractModel');
const { pool } = require('../config/db');
const { notifyAndEmail } = require('../utils/notificationNotifier');

function safeJsonParse(data) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function formatContract(row) {
  if (!row) return null;
  const parsedDetails = safeJsonParse(row.details_data) || {};
  return {
    id: String(row.id),
    agreementNo: row.agreement_no,
    agreementName: row.agreement_name,
    entityName: row.entity_name,
    type: row.type,
    city: row.city,
    roomsCount: row.rooms_count,
    durationDays: row.duration_days,
    startDate: row.start_date,
    endDate: row.end_date,
    totalPrice: Number(row.total_price),
    status: row.status,
    notes: row.notes,
    hotelId: parsedDetails.hotelId || null,
    agentName: parsedDetails.agentName || null,
    packageTier: parsedDetails.packageTier || null,
    groupNo: parsedDetails.groupNo || null,
    roomType: parsedDetails.roomType || null,
    bedsCount: parsedDetails.bedsCount || null,
    rating: parsedDetails.rating || 5,
    rooms: parsedDetails.rooms || null,
    hotelDetails: parsedDetails.hotelDetails || null,
    transportDetails: parsedDetails.transportDetails || null,
    flightDetails: parsedDetails.flightDetails || null,
    detailsData: parsedDetails,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class ContractsService {
  static async listContracts(filters) {
    const rows = await ContractModel.getAll(filters);
    return rows.map(formatContract);
  }

  static async getContractById(id) {
    const row = await ContractModel.getById(id);
    return formatContract(row);
  }

  static async createContract(data) {
    const row = await ContractModel.create(data);
    const contract = formatContract(row);

    // Push live notification & email alert
    if (contract) {
      await notifyAndEmail({
        titleEn: `New Agreement Registered: ${contract.agreementName}`,
        titleAr: `تم إبرام اتفاقية جديدة: ${contract.agreementName}`,
        descEn: `Agreement ${contract.agreementName} (${contract.agreementNo}) with ${contract.entityName} is now active.`,
        descAr: `الاتفاقية ${contract.agreementName} (${contract.agreementNo}) مع ${contract.entityName} أصبحت سارية الآن.`,
        type: 'contract',
        referenceId: String(contract.agreementNo || contract.id),
        referenceLink: `/contracts?contractId=${encodeURIComponent(contract.agreementNo || contract.id)}`,
      });
    }

    return contract;
  }

  static async updateContract(id, data) {
    const row = await ContractModel.update(id, data);
    const contract = formatContract(row);

    // Push live notification & email alert
    if (contract) {
      await notifyAndEmail({
        titleEn: `Agreement Updated: ${contract.agreementName}`,
        titleAr: `تحديث بيانات الاتفاقية: ${contract.agreementName}`,
        descEn: `Terms and pricing updated for Agreement ${contract.agreementName} (${contract.agreementNo}).`,
        descAr: `تم تحديث بنود وأسعار الاتفاقية ${contract.agreementName} (${contract.agreementNo}).`,
        type: 'contract',
        referenceId: String(contract.agreementNo || contract.id),
        referenceLink: `/contracts?contractId=${encodeURIComponent(contract.agreementNo || contract.id)}`,
      });
    }

    return contract;
  }

  static async updateContractStatus(id, status) {
    const row = await ContractModel.updateStatus(id, status);
    const contract = formatContract(row);

    // Push live notification & email alert
    if (contract) {
      await notifyAndEmail({
        titleEn: `Agreement Status Changed: ${contract.agreementName} -> ${status}`,
        titleAr: `تغيير حالة الاتفاقية: ${contract.agreementName} -> ${status}`,
        descEn: `Agreement ${contract.agreementName} (${contract.agreementNo}) status changed to: ${status}.`,
        descAr: `تم تغيير حالة الاتفاقية ${contract.agreementName} (${contract.agreementNo}) إلى: ${status}.`,
        type: 'contract',
        referenceId: String(contract.agreementNo || contract.id),
        referenceLink: `/contracts?contractId=${encodeURIComponent(contract.agreementNo || contract.id)}`,
      });
    }

    return contract;
  }


  static async deleteContract(id) {
    return await ContractModel.delete(id);
  }
}

module.exports = ContractsService;
