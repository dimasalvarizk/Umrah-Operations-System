const { pool } = require('../config/db');

class GroupModel {
  /**
   * Get all groups with optional filtering (search, agent, status) and pagination
   */
  static async getAll({ search = '', agent = '', status = '', limit = 100, offset = 0 } = {}) {
    let query = 'SELECT * FROM `groups` WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query += ' AND (code LIKE ? OR name LIKE ? OR main_agent LIKE ? OR sub_agent LIKE ? OR nationality LIKE ? OR package_type LIKE ? OR makkah_hotel LIKE ? OR madinah_hotel LIKE ? OR departure_flight_no LIKE ? OR arrival_flight_no LIKE ? OR driver_name LIKE ? OR bus_plate_no LIKE ?)';
      params.push(s, s, s, s, s, s, s, s, s, s, s, s);
    }

    if (agent && agent !== 'الكل' && agent !== 'All') {
      query += ' AND (main_agent = ? OR sub_agent = ?)';
      params.push(agent, agent);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, params);
    return rows.map(this.formatRow);
  }

  /**
   * Count total groups matching filters
   */
  static async count({ search = '', agent = '', status = '' } = {}) {
    let query = 'SELECT COUNT(*) as total FROM `groups` WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query += ' AND (code LIKE ? OR name LIKE ? OR main_agent LIKE ? OR sub_agent LIKE ? OR nationality LIKE ? OR package_type LIKE ? OR makkah_hotel LIKE ? OR madinah_hotel LIKE ? OR departure_flight_no LIKE ? OR arrival_flight_no LIKE ? OR driver_name LIKE ? OR bus_plate_no LIKE ?)';
      params.push(s, s, s, s, s, s, s, s, s, s, s, s);
    }

    if (agent && agent !== 'الكل' && agent !== 'All') {
      query += ' AND (main_agent = ? OR sub_agent = ?)';
      params.push(agent, agent);
    }

    if (status && status !== 'الكل' && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(query, params);
    return rows[0]?.total || 0;
  }

  /**
   * Get group by ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM `groups` WHERE id = ? LIMIT 1', [id]);
    return rows[0] ? this.formatRow(rows[0]) : null;
  }

  /**
   * Get group by Code
   */
  static async getByCode(code) {
    const [rows] = await pool.execute('SELECT * FROM `groups` WHERE code = ? LIMIT 1', [code]);
    return rows[0] ? this.formatRow(rows[0]) : null;
  }

  /**
   * Create new group
   */
  static async create({
    code,
    name,
    agreementNumber = null,
    mainAgent = null,
    subAgent = null,
    nationality = null,
    packageType = null,
    pilgrimsCount = 1,
    status = 'قيد التجهيز',
    hotelsData = null,
    flightTransportData = null,
    permitsNotesData = null,
    createdBy = null,
  }) {
    let hotelsObj = {};
    let flightsObj = {};
    let permitsObj = {};

    try {
      if (hotelsData) hotelsObj = typeof hotelsData === 'string' ? JSON.parse(hotelsData) : hotelsData;
    } catch {}

    try {
      if (flightTransportData) flightsObj = typeof flightTransportData === 'string' ? JSON.parse(flightTransportData) : flightTransportData;
    } catch {}

    try {
      if (permitsNotesData) permitsObj = typeof permitsNotesData === 'string' ? JSON.parse(permitsNotesData) : permitsNotesData;
    } catch {}

    const hotelsJson = hotelsData ? (typeof hotelsData === 'string' ? hotelsData : JSON.stringify(hotelsData)) : null;
    const flightTransportJson = flightTransportData ? (typeof flightTransportData === 'string' ? flightTransportData : JSON.stringify(flightTransportData)) : null;
    const permitsNotesJson = permitsNotesData ? (typeof permitsNotesData === 'string' ? permitsNotesData : JSON.stringify(permitsNotesData)) : null;
    const uploadedFilesJson = permitsObj.uploadedFiles ? JSON.stringify(permitsObj.uploadedFiles) : null;

    const [result] = await pool.execute(
      `INSERT INTO \`groups\` (
        code, name, agreement_number, main_agent, sub_agent, nationality, package_type, pilgrims_count, status,
        makkah_hotel, makkah_checkin, makkah_checkout, madinah_hotel, madinah_checkin, madinah_checkout,
        makkah_hotel2, makkah2_checkin, makkah2_checkout, hospitality_notes,
        departure_airline, departure_flight_no, departure_date, departure_airport, departure_destination,
        arrival_airline, arrival_flight_no, arrival_date, arrival_airport, arrival_origin,
        transport_company, operation_number, driver_name, driver_phone, bus_plate_no,
        umrah_permit_status, rawdah_men_permit_status, rawdah_women_permit_status,
        arrival_grouping_status, intercity_grouping_status, departure_grouping_status,
        makkah_ziyarat, madinah_ziyarat, enrichment_program, missing_requirements, additional_notes,
        uploaded_files, hotels_data, flight_transport_data, permits_notes_data, created_by
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )`,
      [
        code,
        name,
        agreementNumber,
        mainAgent,
        subAgent,
        nationality,
        packageType,
        pilgrimsCount,
        status,

        hotelsObj.makkahHotel || hotelsObj.makkahHotel1 || null,
        hotelsObj.makkahCheckIn || hotelsObj.makkah1CheckIn || null,
        hotelsObj.makkahCheckOut || hotelsObj.makkah1CheckOut || null,
        hotelsObj.madinahHotel || null,
        hotelsObj.madinahCheckIn || null,
        hotelsObj.madinahCheckOut || null,
        hotelsObj.makkahHotel2 || null,
        hotelsObj.makkah2CheckIn || null,
        hotelsObj.makkah2CheckOut || null,
        hotelsObj.hospitalityNotes || null,

        flightsObj.departureAirline || null,
        flightsObj.departureFlightNo || null,
        flightsObj.departureDate || null,
        flightsObj.departureAirport || null,
        flightsObj.departureDestination || null,
        flightsObj.arrivalAirline || null,
        flightsObj.arrivalFlightNo || null,
        flightsObj.arrivalDate || null,
        flightsObj.arrivalAirport || null,
        flightsObj.arrivalOrigin || null,
        flightsObj.transportCompany || null,
        flightsObj.operationNumber || null,
        flightsObj.driverName || null,
        flightsObj.driverPhone || null,
        flightsObj.busPlateNo || null,

        permitsObj.umrahPermitStatus || null,
        permitsObj.rawdahMenPermitStatus || null,
        permitsObj.rawdahWomenPermitStatus || null,
        permitsObj.arrivalGrouping || null,
        permitsObj.interCityGrouping || null,
        permitsObj.departureGrouping || null,
        permitsObj.makkahZiyarat || null,
        permitsObj.madinahZiyarat || null,
        permitsObj.enrichmentProgram || null,
        permitsObj.missingRequirements || null,
        permitsObj.additionalNotes || null,

        uploadedFilesJson,
        hotelsJson,
        flightTransportJson,
        permitsNotesJson,
        createdBy,
      ]
    );

    return this.getById(result.insertId);
  }

  /**
   * Update existing group
   */
  static async update(
    id,
    {
      code,
      name,
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
    }
  ) {
    const current = await this.getById(id);
    if (!current) return null;

    let hotelsObj = {};
    let flightsObj = {};
    let permitsObj = {};

    try {
      if (hotelsData !== undefined) {
        hotelsObj = hotelsData ? (typeof hotelsData === 'string' ? JSON.parse(hotelsData) : hotelsData) : {};
      } else if (current.hotelsData) {
        hotelsObj = current.hotelsData;
      }
    } catch {}

    try {
      if (flightTransportData !== undefined) {
        flightsObj = flightTransportData ? (typeof flightTransportData === 'string' ? JSON.parse(flightTransportData) : flightTransportData) : {};
      } else if (current.flightTransportData) {
        flightsObj = current.flightTransportData;
      }
    } catch {}

    try {
      if (permitsNotesData !== undefined) {
        permitsObj = permitsNotesData ? (typeof permitsNotesData === 'string' ? JSON.parse(permitsNotesData) : permitsNotesData) : {};
      } else if (current.permitsNotesData) {
        permitsObj = current.permitsNotesData;
      }
    } catch {}

    const hotelsJson = hotelsData !== undefined
      ? (hotelsData ? (typeof hotelsData === 'string' ? hotelsData : JSON.stringify(hotelsData)) : null)
      : (current.hotelsData ? JSON.stringify(current.hotelsData) : null);

    const flightTransportJson = flightTransportData !== undefined
      ? (flightTransportData ? (typeof flightTransportData === 'string' ? flightTransportData : JSON.stringify(flightTransportData)) : null)
      : (current.flightTransportData ? JSON.stringify(current.flightTransportData) : null);

    const permitsNotesJson = permitsNotesData !== undefined
      ? (permitsNotesData ? (typeof permitsNotesData === 'string' ? permitsNotesData : JSON.stringify(permitsNotesData)) : null)
      : (current.permitsNotesData ? JSON.stringify(current.permitsNotesData) : null);

    const uploadedFilesJson = permitsObj.uploadedFiles ? JSON.stringify(permitsObj.uploadedFiles) : null;

    await pool.execute(
      `UPDATE \`groups\` SET
        code = COALESCE(?, code),
        name = COALESCE(?, name),
        agreement_number = COALESCE(?, agreement_number),
        main_agent = COALESCE(?, main_agent),
        sub_agent = COALESCE(?, sub_agent),
        nationality = COALESCE(?, nationality),
        package_type = COALESCE(?, package_type),
        pilgrims_count = COALESCE(?, pilgrims_count),
        status = COALESCE(?, status),
        makkah_hotel = ?,
        makkah_checkin = ?,
        makkah_checkout = ?,
        madinah_hotel = ?,
        madinah_checkin = ?,
        madinah_checkout = ?,
        makkah_hotel2 = ?,
        makkah2_checkin = ?,
        makkah2_checkout = ?,
        hospitality_notes = ?,
        departure_airline = ?,
        departure_flight_no = ?,
        departure_date = ?,
        departure_airport = ?,
        departure_destination = ?,
        arrival_airline = ?,
        arrival_flight_no = ?,
        arrival_date = ?,
        arrival_airport = ?,
        arrival_origin = ?,
        transport_company = ?,
        operation_number = ?,
        driver_name = ?,
        driver_phone = ?,
        bus_plate_no = ?,
        umrah_permit_status = ?,
        rawdah_men_permit_status = ?,
        rawdah_women_permit_status = ?,
        arrival_grouping_status = ?,
        intercity_grouping_status = ?,
        departure_grouping_status = ?,
        makkah_ziyarat = ?,
        madinah_ziyarat = ?,
        enrichment_program = ?,
        missing_requirements = ?,
        additional_notes = ?,
        uploaded_files = ?,
        hotels_data = ?,
        flight_transport_data = ?,
        permits_notes_data = ?
      WHERE id = ?`,
      [
        code || null,
        name || null,
        agreementNumber || null,
        mainAgent || null,
        subAgent || null,
        nationality || null,
        packageType || null,
        pilgrimsCount || null,
        status || null,

        hotelsObj.makkahHotel || hotelsObj.makkahHotel1 || null,
        hotelsObj.makkahCheckIn || hotelsObj.makkah1CheckIn || null,
        hotelsObj.makkahCheckOut || hotelsObj.makkah1CheckOut || null,
        hotelsObj.madinahHotel || null,
        hotelsObj.madinahCheckIn || null,
        hotelsObj.madinahCheckOut || null,
        hotelsObj.makkahHotel2 || null,
        hotelsObj.makkah2CheckIn || null,
        hotelsObj.makkah2CheckOut || null,
        hotelsObj.hospitalityNotes || null,

        flightsObj.departureAirline || null,
        flightsObj.departureFlightNo || null,
        flightsObj.departureDate || null,
        flightsObj.departureAirport || null,
        flightsObj.departureDestination || null,
        flightsObj.arrivalAirline || null,
        flightsObj.arrivalFlightNo || null,
        flightsObj.arrivalDate || null,
        flightsObj.arrivalAirport || null,
        flightsObj.arrivalOrigin || null,
        flightsObj.transportCompany || null,
        flightsObj.operationNumber || null,
        flightsObj.driverName || null,
        flightsObj.driverPhone || null,
        flightsObj.busPlateNo || null,

        permitsObj.umrahPermitStatus || null,
        permitsObj.rawdahMenPermitStatus || null,
        permitsObj.rawdahWomenPermitStatus || null,
        permitsObj.arrivalGrouping || null,
        permitsObj.interCityGrouping || null,
        permitsObj.departureGrouping || null,
        permitsObj.makkahZiyarat || null,
        permitsObj.madinahZiyarat || null,
        permitsObj.enrichmentProgram || null,
        permitsObj.missingRequirements || null,
        permitsObj.additionalNotes || null,

        uploadedFilesJson,
        hotelsJson,
        flightTransportJson,
        permitsNotesJson,
        id,
      ]
    );

    return this.getById(id);
  }

  /**
   * Update group status only
   */
  static async updateStatus(id, status) {
    const [result] = await pool.execute('UPDATE `groups` SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return null;
    return this.getById(id);
  }

  /**
   * Delete group
   */
  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM `groups` WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Helper to format database row into JS object with parsed JSON & flat attributes
   */
  static formatRow(row) {
    let hotelsData = null;
    let flightTransportData = null;
    let permitsNotesData = null;
    let uploadedFiles = null;

    try {
      if (row.hotels_data) {
        hotelsData = typeof row.hotels_data === 'string' ? JSON.parse(row.hotels_data) : row.hotels_data;
      }
    } catch {}

    try {
      if (row.flight_transport_data) {
        flightTransportData = typeof row.flight_transport_data === 'string' ? JSON.parse(row.flight_transport_data) : row.flight_transport_data;
      }
    } catch {}

    try {
      if (row.permits_notes_data) {
        permitsNotesData = typeof row.permits_notes_data === 'string' ? JSON.parse(row.permits_notes_data) : row.permits_notes_data;
      }
    } catch {}

    try {
      if (row.uploaded_files) {
        uploadedFiles = typeof row.uploaded_files === 'string' ? JSON.parse(row.uploaded_files) : row.uploaded_files;
      }
    } catch {}

    return {
      id: String(row.id),
      code: row.code,
      name: row.name,
      agreementNumber: row.agreement_number,
      mainAgent: row.main_agent,
      subAgent: row.sub_agent,
      nationality: row.nationality,
      packageType: row.package_type,
      pilgrimsCount: Number(row.pilgrims_count) || 0,
      status: row.status,

      // Flat columns
      makkahHotel: row.makkah_hotel,
      makkahCheckIn: row.makkah_checkin,
      makkahCheckOut: row.makkah_checkout,
      madinahHotel: row.madinah_hotel,
      madinahCheckIn: row.madinah_checkin,
      madinahCheckOut: row.madinah_checkout,
      makkahHotel2: row.makkah_hotel2,
      makkah2CheckIn: row.makkah2_checkin,
      makkah2CheckOut: row.makkah2_checkout,
      hospitalityNotes: row.hospitality_notes,

      departureAirline: row.departure_airline,
      departureFlightNo: row.departure_flight_no,
      departureDate: row.departure_date,
      departureAirport: row.departure_airport,
      departureDestination: row.departure_destination,
      arrivalAirline: row.arrival_airline,
      arrivalFlightNo: row.arrival_flight_no,
      arrivalDate: row.arrival_date,
      arrivalAirport: row.arrival_airport,
      arrivalOrigin: row.arrival_origin,
      transportCompany: row.transport_company,
      operationNumber: row.operation_number,
      driverName: row.driver_name,
      driverPhone: row.driver_phone,
      busPlateNo: row.bus_plate_no,

      umrahPermitStatus: row.umrah_permit_status,
      rawdahMenPermitStatus: row.rawdah_men_permit_status,
      rawdahWomenPermitStatus: row.rawdah_women_permit_status,
      arrivalGroupingStatus: row.arrival_grouping_status,
      intercityGroupingStatus: row.intercity_grouping_status,
      departureGroupingStatus: row.departure_grouping_status,
      makkahZiyarat: row.makkah_ziyarat,
      madinahZiyarat: row.madinah_ziyarat,
      enrichmentProgram: row.enrichment_program,
      missingRequirements: row.missing_requirements,
      additionalNotes: row.additional_notes,
      uploadedFiles: uploadedFiles || (permitsNotesData ? permitsNotesData.uploadedFiles : null),

      // Structured objects
      hotelsData,
      flightTransportData,
      permitsNotesData,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = GroupModel;
