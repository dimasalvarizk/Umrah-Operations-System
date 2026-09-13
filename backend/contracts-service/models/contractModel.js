const { pool } = require('../config/db');

class ContractModel {
  static async getAll({ search, type, status } = {}) {
    let sql = 'SELECT * FROM contracts WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (agreement_no LIKE ? OR agreement_name LIKE ? OR entity_name LIKE ? OR city LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (type && type !== 'الكل' && type !== 'All') {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM contracts WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const agreementNo = data.agreementNo || `AGR-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const sql = `
      INSERT INTO contracts (
        agreement_no, agreement_name, entity_name, type, city, rooms_count,
        duration_days, start_date, end_date, total_price, status, notes, details_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const detailsJson = JSON.stringify({
      hotelId: data.hotelId || null,
      agentName: data.agentName || null,
      packageTier: data.packageTier || null,
      groupNo: data.groupNo || null,
      roomType: data.roomType || null,
      bedsCount: data.bedsCount || null,
      rooms: data.rooms || null,
      rating: data.rating !== undefined ? data.rating : 5,
      hotelDetails: data.hotelDetails || null,
      transportDetails: data.transportDetails || null,
      flightDetails: data.flightDetails || null,
      ...(data.detailsData || {}),
    });

    const params = [
      agreementNo,
      data.agreementName || '',
      data.entityName || '',
      data.type || 'فندق',
      data.city || 'مكة المكرمة',
      parseInt(data.roomsCount || '0', 10),
      parseInt(data.durationDays || '1', 10),
      data.startDate || '',
      data.endDate || '',
      parseFloat(data.totalPrice || '0.00'),
      data.status || 'نشطة',
      data.notes || null,
      detailsJson,
    ];

    const [result] = await pool.query(sql, params);
    return this.getById(result.insertId);
  }

  static async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const sql = `
      UPDATE contracts SET
        agreement_no = ?,
        agreement_name = ?,
        entity_name = ?,
        type = ?,
        city = ?,
        rooms_count = ?,
        duration_days = ?,
        start_date = ?,
        end_date = ?,
        total_price = ?,
        status = ?,
        notes = ?,
        details_data = ?
      WHERE id = ?
    `;

    let currentDetails = {};
    try {
      if (current.details_data) {
        currentDetails = typeof current.details_data === 'string' ? JSON.parse(current.details_data) : current.details_data;
      }
    } catch {}

    const detailsJson = JSON.stringify({
      ...currentDetails,
      ...(data.detailsData || {}),
      ...(data.hotelId !== undefined ? { hotelId: data.hotelId } : {}),
      ...(data.agentName !== undefined ? { agentName: data.agentName } : {}),
      ...(data.packageTier !== undefined ? { packageTier: data.packageTier } : {}),
      ...(data.groupNo !== undefined ? { groupNo: data.groupNo } : {}),
      ...(data.roomType !== undefined ? { roomType: data.roomType } : {}),
      ...(data.bedsCount !== undefined ? { bedsCount: data.bedsCount } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.rooms !== undefined ? { rooms: data.rooms } : {}),
    });

    const params = [
      data.agreementNo !== undefined ? data.agreementNo : current.agreement_no,
      data.agreementName !== undefined ? data.agreementName : current.agreement_name,
      data.entityName !== undefined ? data.entityName : current.entity_name,
      data.type !== undefined ? data.type : current.type,
      data.city !== undefined ? data.city : current.city,
      data.roomsCount !== undefined ? parseInt(data.roomsCount, 10) : current.rooms_count,
      data.durationDays !== undefined ? parseInt(data.durationDays, 10) : current.duration_days,
      data.startDate !== undefined ? data.startDate : current.start_date,
      data.endDate !== undefined ? data.endDate : current.end_date,
      data.totalPrice !== undefined ? parseFloat(data.totalPrice) : current.total_price,
      data.status !== undefined ? data.status : current.status,
      data.notes !== undefined ? data.notes : current.notes,
      detailsJson,
      id,
    ];
    await pool.query(sql, params);
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE contracts SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM contracts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ContractModel;
