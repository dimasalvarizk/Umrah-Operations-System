const HotelModel = require('../models/hotelModel');
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


function formatHotel(row) {
  if (!row) return null;
  const parsedImages = safeJsonParse(row.images_data);
  const images = Array.isArray(parsedImages) && parsedImages.length > 0
    ? parsedImages
    : (row.image ? [row.image] : []);

  return {
    id: String(row.id),
    code: row.code,
    name: row.name,
    nameEn: row.name_en,
    location: row.location,
    locationEn: row.location_en,
    address: row.address,
    addressEn: row.address_en,
    status: row.status,
    rating: row.rating,
    availableRooms: row.available_rooms,
    pricePerNight: Number(row.price_per_night),
    distanceToHaram: row.distance_to_haram,
    image: row.image || (images.length > 0 ? images[0] : ''),
    images: images,
    roomTypes: safeJsonParse(row.room_types_data) || [],
    amenities: safeJsonParse(row.amenities_data) || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class HotelsService {
  static async listHotels(filters) {
    const rows = await HotelModel.getAll(filters);
    return rows.map(formatHotel);
  }

  static async getHotelById(id) {
    const row = await HotelModel.getById(id);
    return formatHotel(row);
  }

  static async createHotel(data) {
    const row = await HotelModel.create(data);
    const hotel = formatHotel(row);

    // Push live notification & email alert
    await notifyAndEmail({
      titleEn: `New Hotel Added: ${hotel.name}`,
      titleAr: `تمت إضافة فندق جديد: ${hotel.name}`,
      descEn: `Hotel ${hotel.name} (${hotel.locationEn || hotel.location}) with ${hotel.availableRooms} rooms registered in operations.`,
      descAr: `تم تسجيل فندق ${hotel.name} (${hotel.location}) بعدد ${hotel.availableRooms} غرفة بنجاح.`,
      type: 'hotel',
      referenceId: String(hotel.id),
      referenceLink: `/hotels?hotelId=${hotel.id}`,
    });

    return hotel;
  }

  static async updateHotel(id, data) {
    const row = await HotelModel.update(id, data);
    const hotel = formatHotel(row);

    // Push live notification & email alert
    if (hotel) {
      await notifyAndEmail({
        titleEn: `Hotel Details Updated: ${hotel.name}`,
        titleAr: `تحديث بيانات الفندق: ${hotel.name}`,
        descEn: `Hotel ${hotel.name} accommodation details and room rates have been updated.`,
        descAr: `تم تحديث بيانات التسكين والغرف لفندق ${hotel.name}.`,
        type: 'hotel',
        referenceId: String(hotel.id),
        referenceLink: `/hotels?hotelId=${hotel.id}`,
      });
    }

    return hotel;
  }


  static async updateHotelStatus(id, status) {
    const row = await HotelModel.updateStatus(id, status);
    return formatHotel(row);
  }

  static async deleteHotel(id) {
    return await HotelModel.delete(id);
  }
}

module.exports = HotelsService;
