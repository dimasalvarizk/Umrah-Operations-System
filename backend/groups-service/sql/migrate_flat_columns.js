const { pool } = require('../config/db');

async function migrate() {
  console.log('Starting migration to expand groups table with all individual columns...');

  const columnsToAdd = [
    // Step 2 Hotels
    { name: 'makkah_hotel', type: 'VARCHAR(255) NULL' },
    { name: 'makkah_checkin', type: 'VARCHAR(50) NULL' },
    { name: 'makkah_checkout', type: 'VARCHAR(50) NULL' },
    { name: 'madinah_hotel', type: 'VARCHAR(255) NULL' },
    { name: 'madinah_checkin', type: 'VARCHAR(50) NULL' },
    { name: 'madinah_checkout', type: 'VARCHAR(50) NULL' },
    { name: 'makkah_hotel2', type: 'VARCHAR(255) NULL' },
    { name: 'makkah2_checkin', type: 'VARCHAR(50) NULL' },
    { name: 'makkah2_checkout', type: 'VARCHAR(50) NULL' },
    { name: 'hospitality_notes', type: 'TEXT NULL' },

    // Step 3 Flights & Transport
    { name: 'departure_airline', type: 'VARCHAR(255) NULL' },
    { name: 'departure_flight_no', type: 'VARCHAR(100) NULL' },
    { name: 'departure_date', type: 'VARCHAR(50) NULL' },
    { name: 'departure_airport', type: 'VARCHAR(255) NULL' },
    { name: 'departure_destination', type: 'VARCHAR(255) NULL' },
    { name: 'arrival_airline', type: 'VARCHAR(255) NULL' },
    { name: 'arrival_flight_no', type: 'VARCHAR(100) NULL' },
    { name: 'arrival_date', type: 'VARCHAR(50) NULL' },
    { name: 'arrival_airport', type: 'VARCHAR(255) NULL' },
    { name: 'arrival_origin', type: 'VARCHAR(255) NULL' },
    { name: 'transport_company', type: 'VARCHAR(255) NULL' },
    { name: 'operation_number', type: 'VARCHAR(100) NULL' },
    { name: 'driver_name', type: 'VARCHAR(255) NULL' },
    { name: 'driver_phone', type: 'VARCHAR(100) NULL' },
    { name: 'bus_plate_no', type: 'VARCHAR(100) NULL' },

    // Step 4 Permits & Notes
    { name: 'umrah_permit_status', type: 'VARCHAR(100) NULL' },
    { name: 'rawdah_men_permit_status', type: 'VARCHAR(100) NULL' },
    { name: 'rawdah_women_permit_status', type: 'VARCHAR(100) NULL' },
    { name: 'arrival_grouping_status', type: 'VARCHAR(100) NULL' },
    { name: 'intercity_grouping_status', type: 'VARCHAR(100) NULL' },
    { name: 'departure_grouping_status', type: 'VARCHAR(100) NULL' },
    { name: 'makkah_ziyarat', type: 'TEXT NULL' },
    { name: 'madinah_ziyarat', type: 'TEXT NULL' },
    { name: 'enrichment_program', type: 'TEXT NULL' },
    { name: 'missing_requirements', type: 'TEXT NULL' },
    { name: 'additional_notes', type: 'TEXT NULL' },
    { name: 'uploaded_files', type: 'JSON NULL' }
  ];

  // Check existing columns
  const [existingCols] = await pool.query('DESCRIBE `groups`');
  const existingColNames = new Set(existingCols.map(c => c.Field));

  for (const col of columnsToAdd) {
    if (!existingColNames.has(col.name)) {
      console.log(`Adding column: ${col.name} ${col.type}`);
      await pool.query(`ALTER TABLE \`groups\` ADD COLUMN \`${col.name}\` ${col.type}`);
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  }

  // Backfill existing rows from JSON data
  const [rows] = await pool.query('SELECT * FROM `groups`');
  console.log(`Backfilling ${rows.length} existing rows...`);

  for (const row of rows) {
    let hotels = {};
    let flights = {};
    let permits = {};

    try {
      if (row.hotels_data) {
        hotels = typeof row.hotels_data === 'string' ? JSON.parse(row.hotels_data) : row.hotels_data;
      }
    } catch (e) {}

    try {
      if (row.flight_transport_data) {
        flights = typeof row.flight_transport_data === 'string' ? JSON.parse(row.flight_transport_data) : row.flight_transport_data;
      }
    } catch (e) {}

    try {
      if (row.permits_notes_data) {
        permits = typeof row.permits_notes_data === 'string' ? JSON.parse(row.permits_notes_data) : row.permits_notes_data;
      }
    } catch (e) {}

    const updateData = {
      makkah_hotel: hotels.makkahHotel || hotels.makkahHotel1 || null,
      makkah_checkin: hotels.makkahCheckIn || hotels.makkah1CheckIn || null,
      makkah_checkout: hotels.makkahCheckOut || hotels.makkah1CheckOut || null,
      madinah_hotel: hotels.madinahHotel || null,
      madinah_checkin: hotels.madinahCheckIn || null,
      madinah_checkout: hotels.madinahCheckOut || null,
      makkah_hotel2: hotels.makkahHotel2 || null,
      makkah2_checkin: hotels.makkah2CheckIn || null,
      makkah2_checkout: hotels.makkah2CheckOut || null,
      hospitality_notes: hotels.hospitalityNotes || null,

      departure_airline: flights.departureAirline || null,
      departure_flight_no: flights.departureFlightNo || null,
      departure_date: flights.departureDate || null,
      departure_airport: flights.departureAirport || null,
      departure_destination: flights.departureDestination || null,
      arrival_airline: flights.arrivalAirline || null,
      arrival_flight_no: flights.arrivalFlightNo || null,
      arrival_date: flights.arrivalDate || null,
      arrival_airport: flights.arrivalAirport || null,
      arrival_origin: flights.arrivalOrigin || null,
      transport_company: flights.transportCompany || null,
      operation_number: flights.operationNumber || null,
      driver_name: flights.driverName || null,
      driver_phone: flights.driverPhone || null,
      bus_plate_no: flights.busPlateNo || null,

      umrah_permit_status: permits.umrahPermitStatus || null,
      rawdah_men_permit_status: permits.rawdahMenPermitStatus || null,
      rawdah_women_permit_status: permits.rawdahWomenPermitStatus || null,
      arrival_grouping_status: permits.arrivalGrouping || null,
      intercity_grouping_status: permits.interCityGrouping || null,
      departure_grouping_status: permits.departureGrouping || null,
      makkah_ziyarat: permits.makkahZiyarat || null,
      madinah_ziyarat: permits.madinahZiyarat || null,
      enrichment_program: permits.enrichmentProgram || null,
      missing_requirements: permits.missingRequirements || null,
      additional_notes: permits.additionalNotes || null,
      uploaded_files: permits.uploadedFiles ? JSON.stringify(permits.uploadedFiles) : null
    };

    const setClauses = [];
    const setParams = [];

    for (const [k, v] of Object.entries(updateData)) {
      setClauses.push(`\`${k}\` = ?`);
      setParams.push(v);
    }
    setParams.push(row.id);

    await pool.query(`UPDATE \`groups\` SET ${setClauses.join(', ')} WHERE id = ?`, setParams);
  }

  console.log('Migration & backfill completed successfully!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
