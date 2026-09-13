const { pool } = require('../config/db');

class HotelModel {
  static async getAll({ search, location, status } = {}) {
    let sql = 'SELECT * FROM hotels WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (name LIKE ? OR name_en LIKE ? OR location LIKE ? OR location_en LIKE ? OR address LIKE ? OR address_en LIKE ? OR code LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s, s, s);
    }

    if (location && location !== 'الكل' && location !== 'All') {
      sql += ' AND (location LIKE ? OR location_en LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      const st = status.toLowerCase();
      if (status.includes('متاح') || st.includes('avail') || status.includes('نشط') || st.includes('active')) {
        sql += ' AND (status LIKE ? OR status LIKE ? OR status LIKE ? OR status LIKE ?)';
        params.push('%متاح%', '%avail%', '%نشط%', '%active%');
      } else if (status.includes('محجوز') || st.includes('book') || st.includes('full')) {
        sql += ' AND (status LIKE ? OR status LIKE ? OR status LIKE ?)';
        params.push('%محجوز%', '%book%', '%full%');
      } else {
        sql += ' AND status = ?';
        params.push(status);
      }
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM hotels WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const isMadinah = (data.locationEn === 'Madinah' || (data.location && data.location.includes('المدينة')));
    const cityPrefix = isMadinah ? 'MED' : 'MKH';
    const randomSuffix = `${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const code = data.code || `HTL-${cityPrefix}-${randomSuffix}`;

    const defaultMakkahImg = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80';
    const defaultMadinahImg = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80';
    const fallbackImage = isMadinah ? defaultMadinahImg : defaultMakkahImg;

    const sql = `
      INSERT INTO hotels (
        code, name, name_en, location, location_en, address, address_en,
        status, rating, available_rooms, price_per_night, distance_to_haram,
        image, images_data, room_types_data, amenities_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const roomTypesJson = data.roomTypes ? JSON.stringify(data.roomTypes) : null;
    const amenitiesJson = data.amenities ? JSON.stringify(data.amenities) : null;
    const imagesJson = data.images && Array.isArray(data.images) ? JSON.stringify(data.images) : null;

    const mainImage = data.image || (data.images && data.images.length > 0 ? data.images[0] : fallbackImage);
    const locationName = data.location || (isMadinah ? 'المدينة المنورة' : 'مكة المكرمة');
    const locationEnName = data.locationEn || (isMadinah ? 'Madinah' : 'Makkah');

    const params = [
      code,
      data.name || '',
      data.nameEn || data.name || null,
      locationName,
      locationEnName,
      data.address || null,
      data.addressEn || data.address || null,
      data.status || 'متاح للتسكين',
      parseInt(data.rating || '5', 10) || 5,
      parseInt(data.availableRooms || '0', 10) || 0,
      parseFloat(data.pricePerNight || '0.00') || 0.00,
      data.distanceToHaram || (isMadinah ? '200m from Prophet Mosque' : '300m from Al-Haram'),
      mainImage,
      imagesJson,
      roomTypesJson,
      amenitiesJson,
    ];

    const [result] = await pool.query(sql, params);
    return this.getById(result.insertId);
  }

  static async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const sql = `
      UPDATE hotels SET
        name = ?,
        name_en = ?,
        location = ?,
        location_en = ?,
        address = ?,
        address_en = ?,
        status = ?,
        rating = ?,
        available_rooms = ?,
        price_per_night = ?,
        distance_to_haram = ?,
        image = ?,
        images_data = ?,
        room_types_data = ?,
        amenities_data = ?
      WHERE id = ?
    `;

    const roomTypesJson = data.roomTypes !== undefined ? JSON.stringify(data.roomTypes) : current.room_types_data;
    const amenitiesJson = data.amenities !== undefined ? JSON.stringify(data.amenities) : current.amenities_data;
    const imagesJson = data.images !== undefined ? JSON.stringify(data.images) : current.images_data;
    const mainImage = data.image !== undefined ? data.image : (data.images && data.images.length > 0 ? data.images[0] : current.image);

    const params = [
      data.name !== undefined ? data.name : current.name,
      data.nameEn !== undefined ? data.nameEn : current.name_en,
      data.location !== undefined ? data.location : current.location,
      data.locationEn !== undefined ? data.locationEn : current.location_en,
      data.address !== undefined ? data.address : current.address,
      data.addressEn !== undefined ? data.addressEn : current.address_en,
      data.status !== undefined ? data.status : current.status,
      data.rating !== undefined ? (parseInt(data.rating, 10) || 5) : current.rating,
      data.availableRooms !== undefined ? (parseInt(data.availableRooms, 10) || 0) : current.available_rooms,
      data.pricePerNight !== undefined ? (parseFloat(data.pricePerNight) || 0) : current.price_per_night,
      data.distanceToHaram !== undefined ? data.distanceToHaram : current.distance_to_haram,
      mainImage,
      imagesJson,
      roomTypesJson,
      amenitiesJson,
      id,
    ];

    await pool.query(sql, params);
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE hotels SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM hotels WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = HotelModel;
