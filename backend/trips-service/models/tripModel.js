const { pool } = require('../config/db');

class TripModel {
  static async getAll({ search, status, route } = {}) {
    let sql = 'SELECT * FROM trips WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (code LIKE ? OR route_name LIKE ? OR guide_name LIKE ? OR airline LIKE ? OR flight_number LIKE ? OR transport_company LIKE ? OR supervisor_name LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s, s);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (route && route !== 'الكل' && route !== 'All') {
      sql += ' AND route_name LIKE ?';
      params.push(`%${route}%`);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const code = data.code || `TRP-${Math.floor(1000 + Math.random() * 9000)}`;
    const sql = `
      INSERT INTO trips (
        code, route_name, start_date, end_date, pilgrims_count, guide_name, status,
        program_name, route_path, program_type, expected_duration, dominant_nationality,
        airline, flight_number, airport_hub, makkah_hotel, makkah_stay, madinah_hotel,
        madinah_stay, transport_company, transport_type, bus_number, driver_name,
        driver_phone, supervisor_name, supervisor_phone, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      code,
      data.routeName || '',
      data.startDate || '',
      data.endDate || '',
      parseInt(data.pilgrimsCount || '1', 10),
      data.guideName || '',
      data.status || 'قيد التنفيذ',
      data.programName || null,
      data.routePath || null,
      data.programType || null,
      data.expectedDuration || null,
      data.dominantNationality || null,
      data.airline || null,
      data.flightNumber || null,
      data.airportHub || null,
      data.makkahHotel || null,
      data.makkahStay || null,
      data.madinahHotel || null,
      data.madinahStay || null,
      data.transportCompany || null,
      data.transportType || null,
      data.busNumber || null,
      data.driverName || null,
      data.driverPhone || null,
      data.supervisorName || null,
      data.supervisorPhone || null,
      data.notes || null,
    ];

    const [result] = await pool.query(sql, params);
    return this.getById(result.insertId);
  }

  static async update(id, data) {
    const current = await this.getById(id);
    if (!current) return null;

    const sql = `
      UPDATE trips SET
        route_name = ?,
        start_date = ?,
        end_date = ?,
        pilgrims_count = ?,
        guide_name = ?,
        status = ?,
        program_name = ?,
        route_path = ?,
        program_type = ?,
        expected_duration = ?,
        dominant_nationality = ?,
        airline = ?,
        flight_number = ?,
        airport_hub = ?,
        makkah_hotel = ?,
        makkah_stay = ?,
        madinah_hotel = ?,
        madinah_stay = ?,
        transport_company = ?,
        transport_type = ?,
        bus_number = ?,
        driver_name = ?,
        driver_phone = ?,
        supervisor_name = ?,
        supervisor_phone = ?,
        notes = ?
      WHERE id = ?
    `;

    const params = [
      data.routeName !== undefined ? data.routeName : current.route_name,
      data.startDate !== undefined ? data.startDate : current.start_date,
      data.endDate !== undefined ? data.endDate : current.end_date,
      data.pilgrimsCount !== undefined ? parseInt(data.pilgrimsCount, 10) : current.pilgrims_count,
      data.guideName !== undefined ? data.guideName : current.guide_name,
      data.status !== undefined ? data.status : current.status,
      data.programName !== undefined ? data.programName : current.program_name,
      data.routePath !== undefined ? data.routePath : current.route_path,
      data.programType !== undefined ? data.programType : current.program_type,
      data.expectedDuration !== undefined ? data.expectedDuration : current.expected_duration,
      data.dominantNationality !== undefined ? data.dominantNationality : current.dominant_nationality,
      data.airline !== undefined ? data.airline : current.airline,
      data.flightNumber !== undefined ? data.flightNumber : current.flight_number,
      data.airportHub !== undefined ? data.airportHub : current.airport_hub,
      data.makkahHotel !== undefined ? data.makkahHotel : current.makkah_hotel,
      data.makkahStay !== undefined ? data.makkahStay : current.makkah_stay,
      data.madinahHotel !== undefined ? data.madinahHotel : current.madinah_hotel,
      data.madinahStay !== undefined ? data.madinahStay : current.madinah_stay,
      data.transportCompany !== undefined ? data.transportCompany : current.transport_company,
      data.transportType !== undefined ? data.transportType : current.transport_type,
      data.busNumber !== undefined ? data.busNumber : current.bus_number,
      data.driverName !== undefined ? data.driverName : current.driver_name,
      data.driverPhone !== undefined ? data.driverPhone : current.driver_phone,
      data.supervisorName !== undefined ? data.supervisorName : current.supervisor_name,
      data.supervisorPhone !== undefined ? data.supervisorPhone : current.supervisor_phone,
      data.notes !== undefined ? data.notes : current.notes,
      id,
    ];

    await pool.query(sql, params);
    return this.getById(id);
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE trips SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM trips WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TripModel;
