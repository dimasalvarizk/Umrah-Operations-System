const TripModel = require('../models/tripModel');
const { pool } = require('../config/db');
const { notifyAndEmail } = require('../utils/notificationNotifier');

function formatTrip(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    code: row.code,
    routeName: row.route_name,
    startDate: row.start_date,
    endDate: row.end_date,
    pilgrimsCount: row.pilgrims_count,
    guideName: row.guide_name,
    status: row.status,
    programName: row.program_name,
    routePath: row.route_path,
    programType: row.program_type,
    expectedDuration: row.expected_duration,
    dominantNationality: row.dominant_nationality,
    airline: row.airline,
    flightNumber: row.flight_number,
    airportHub: row.airport_hub,
    makkahHotel: row.makkah_hotel,
    makkahStay: row.makkah_stay,
    madinahHotel: row.madinah_hotel,
    madinahStay: row.madinah_stay,
    transportCompany: row.transport_company,
    transportType: row.transport_type,
    busNumber: row.bus_number,
    driverName: row.driver_name,
    driverPhone: row.driver_phone,
    supervisorName: row.supervisor_name,
    supervisorPhone: row.supervisor_phone,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class TripsService {
  static async listTrips(filters) {
    const rows = await TripModel.getAll(filters);
    return rows.map(formatTrip);
  }

  static async getTripById(id) {
    const row = await TripModel.getById(id);
    return formatTrip(row);
  }

  static async createTrip(data) {
    const row = await TripModel.create(data);
    const trip = formatTrip(row);

    // Push live notification & email alert
    if (trip) {
      await notifyAndEmail({
        titleEn: `New Trip Scheduled: ${trip.programName || trip.routeName}`,
        titleAr: `تمت جدولة رحلة جديدة: ${trip.programName || trip.routeName}`,
        descEn: `Trip ${trip.programName || trip.routeName} (${trip.code}) with ${trip.pilgrimsCount} pilgrims is now scheduled in operations.`,
        descAr: `الرحلة ${trip.programName || trip.routeName} (${trip.code}) بعدد ${trip.pilgrimsCount} معتمر مجدولة الآن.`,
        type: 'trip',
        referenceId: String(trip.code || trip.id),
        referenceLink: `/trips?tripId=${encodeURIComponent(trip.code || trip.id)}`,
      });
    }

    return trip;
  }

  static async updateTrip(id, data) {
    const row = await TripModel.update(id, data);
    const trip = formatTrip(row);

    // Push live notification & email alert
    if (trip) {
      await notifyAndEmail({
        titleEn: `Trip Details Updated: ${trip.programName || trip.routeName}`,
        titleAr: `تحديث بيانات الرحلة: ${trip.programName || trip.routeName}`,
        descEn: `Trip ${trip.programName || trip.routeName} (${trip.code}) schedule and transport details updated.`,
        descAr: `تم تحديث تفاصيل ومسار الرحلة ${trip.programName || trip.routeName} (${trip.code}).`,
        type: 'trip',
        referenceId: String(trip.code || trip.id),
        referenceLink: `/trips?tripId=${encodeURIComponent(trip.code || trip.id)}`,
      });
    }

    return trip;
  }

  static async updateTripStatus(id, status) {
    const row = await TripModel.updateStatus(id, status);
    const trip = formatTrip(row);

    // Push live notification & email alert
    if (trip) {
      await notifyAndEmail({
        titleEn: `Trip Status Updated: ${trip.programName || trip.routeName} -> ${status}`,
        titleAr: `تحديث حالة الرحلة: ${trip.programName || trip.routeName} -> ${status}`,
        descEn: `Trip ${trip.programName || trip.routeName} (${trip.code}) status changed to: ${status}.`,
        descAr: `تم تغيير حالة الرحلة ${trip.programName || trip.routeName} (${trip.code}) إلى: ${status}.`,
        type: 'trip',
        referenceId: String(trip.code || trip.id),
        referenceLink: `/trips?tripId=${encodeURIComponent(trip.code || trip.id)}`,
      });
    }

    return trip;
  }


  static async deleteTrip(id) {
    return await TripModel.delete(id);
  }
}

module.exports = TripsService;
