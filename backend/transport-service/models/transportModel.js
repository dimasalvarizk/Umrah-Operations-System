const { pool } = require('../config/db');

class TransportModel {
  static async getAll({ search, region, status } = {}) {
    let sql = 'SELECT * FROM transports WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR name_en LIKE ? OR phone LIKE ? OR vehicle_category LIKE ? OR vehicle_category_en LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    if (region && region !== 'الكل' && region !== 'All') {
      const regionMap = {
        'مكة المكرمة': 'Makkah',
        'Makkah': 'مكة المكرمة',
        'المدينة المنورة': 'Madinah',
        'Madinah': 'المدينة المنورة',
        'جدة': 'Jeddah',
        'Jeddah': 'جدة',
        'الرياض': 'Riyadh',
        'Riyadh': 'الرياض',
      };
      const altRegion = regionMap[region] || region;
      sql += ' AND (region LIKE ? OR region_en LIKE ? OR region LIKE ? OR region_en LIKE ?)';
      params.push(`%${region}%`, `%${region}%`, `%${altRegion}%`, `%${altRegion}%`);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      sql += ' AND (status = ? OR status LIKE ?)';
      params.push(status, `%${status}%`);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM transports WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const code = data.code || `TRN-${Math.floor(1000 + Math.random() * 9000)}`;

    const regionMapArToEn = {
      'مكة المكرمة': 'Makkah',
      'المدينة المنورة': 'Madinah',
      'جدة': 'Jeddah',
      'الرياض': 'Riyadh',
    };
    const regionMapEnToAr = {
      'Makkah': 'مكة المكرمة',
      'Madinah': 'المدينة المنورة',
      'Jeddah': 'جدة',
      'Riyadh': 'الرياض',
    };

    let regionAr = data.region || 'مكة المكرمة';
    let regionEn = data.regionEn || regionMapArToEn[data.region] || data.region || 'Makkah';
    if (regionMapEnToAr[data.region]) {
      regionAr = regionMapEnToAr[data.region];
      regionEn = data.region;
    }

    const calculatedFleetSize = data.fleetSize
      ? parseInt(data.fleetSize, 10)
      : (data.pricingRows && Array.isArray(data.pricingRows) ? data.pricingRows.length * 5 : 20);

    const fleetLabelAr = data.fleetLabel || `${calculatedFleetSize} مركبة`;
    const fleetLabelEn = data.fleetLabelEn || `${calculatedFleetSize} Vehicles`;

    const sql = `
      INSERT INTO transports (
        code, name, name_en, status, rating, fleet_size, fleet_label, fleet_label_en,
        phone, email, address, region, region_en, vehicle_category, vehicle_category_en,
        image, photos_data, pricing_rates_data, description, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const photosJson = data.photos && Array.isArray(data.photos) ? JSON.stringify(data.photos) : null;
    const pricingJson = data.pricingRows && Array.isArray(data.pricingRows) ? JSON.stringify(data.pricingRows) : null;

    const params = [
      code,
      data.name || '',
      data.nameEn || data.name || null,
      data.status || 'متاح',
      parseFloat(data.rating || '5.0'),
      calculatedFleetSize,
      fleetLabelAr,
      fleetLabelEn,
      data.phone || null,
      data.email || null,
      data.address || null,
      regionAr,
      regionEn,
      data.vehicleCategory || 'حافلات وفانات نقل معتمرين وحجاج',
      data.vehicleCategoryEn || data.vehicleCategory || 'Pilgrim Buses & Transport Vans',
      data.image || null,
      photosJson,
      pricingJson,
      data.description || null,
      data.notes || null,
    ];

    const [result] = await pool.query(sql, params);
    return this.getById(result.insertId);
  }

  static async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const sql = `
      UPDATE transports SET
        name = ?,
        name_en = ?,
        status = ?,
        rating = ?,
        fleet_size = ?,
        fleet_label = ?,
        fleet_label_en = ?,
        phone = ?,
        email = ?,
        address = ?,
        region = ?,
        region_en = ?,
        vehicle_category = ?,
        vehicle_category_en = ?,
        image = ?,
        photos_data = ?,
        pricing_rates_data = ?,
        description = ?,
        notes = ?
      WHERE id = ?
    `;

    const photosJson = data.photos !== undefined ? JSON.stringify(data.photos) : current.photos_data;
    const pricingJson = data.pricingRows !== undefined ? JSON.stringify(data.pricingRows) : current.pricing_rates_data;

    const params = [
      data.name !== undefined ? data.name : current.name,
      data.nameEn !== undefined ? data.nameEn : current.name_en,
      data.status !== undefined ? data.status : current.status,
      data.rating !== undefined ? parseFloat(data.rating) : current.rating,
      data.fleetSize !== undefined ? parseInt(data.fleetSize, 10) : current.fleet_size,
      data.fleetLabel !== undefined ? data.fleetLabel : current.fleet_label,
      data.fleetLabelEn !== undefined ? data.fleetLabelEn : current.fleet_label_en,
      data.phone !== undefined ? data.phone : current.phone,
      data.email !== undefined ? data.email : current.email,
      data.address !== undefined ? data.address : current.address,
      data.region !== undefined ? data.region : current.region,
      data.regionEn !== undefined ? data.regionEn : current.region_en,
      data.vehicleCategory !== undefined ? data.vehicleCategory : current.vehicle_category,
      data.vehicleCategoryEn !== undefined ? data.vehicleCategoryEn : current.vehicle_category_en,
      data.image !== undefined ? data.image : current.image,
      photosJson,
      pricingJson,
      data.description !== undefined ? data.description : current.description,
      data.notes !== undefined ? data.notes : current.notes,
      id,
    ];

    await pool.query(sql, params);
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE transports SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM transports WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TransportModel;
