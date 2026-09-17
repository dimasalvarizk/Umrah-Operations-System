const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'root_password';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'umrah_db';

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDb() {
  try {
    const connection = await pool.getConnection();

    // Ensure notifications table exists
    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        desc_en TEXT,
        desc_ar TEXT,
        type VARCHAR(50) DEFAULT 'system',
        reference_id VARCHAR(100),
        reference_link VARCHAR(255),
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createNotificationsTable);

    const createTransportsTable = `
      CREATE TABLE IF NOT EXISTS transports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        status VARCHAR(50) DEFAULT 'متاح',
        rating DECIMAL(2,1) DEFAULT 5.0,
        fleet_size INT DEFAULT 1,
        fleet_label VARCHAR(100),
        fleet_label_en VARCHAR(100),
        phone VARCHAR(100),
        email VARCHAR(150),
        address VARCHAR(255),
        region VARCHAR(100) DEFAULT 'مكة المكرمة',
        region_en VARCHAR(100) DEFAULT 'Makkah',
        vehicle_category VARCHAR(255),
        vehicle_category_en VARCHAR(255),
        image LONGTEXT,
        photos_data JSON,
        pricing_rates_data JSON,
        description TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createTransportsTable);

    // Auto-migrate new columns
    const [cols] = await connection.query('SHOW COLUMNS FROM `transports`');
    const colNames = cols.map((c) => c.Field);
    if (!colNames.includes('email')) {
      await connection.query('ALTER TABLE `transports` ADD COLUMN `email` VARCHAR(150) AFTER `phone`');
    }
    if (!colNames.includes('address')) {
      await connection.query('ALTER TABLE `transports` ADD COLUMN `address` VARCHAR(255) AFTER `email`');
    }
    if (!colNames.includes('photos_data')) {
      await connection.query('ALTER TABLE `transports` ADD COLUMN `photos_data` JSON AFTER `image`');
    }
    if (!colNames.includes('pricing_rates_data')) {
      await connection.query('ALTER TABLE `transports` ADD COLUMN `pricing_rates_data` JSON AFTER `photos_data`');
    }
    await connection.query('ALTER TABLE `transports` MODIFY `image` LONGTEXT');

    // Clean up any previously seeded dummy transport companies
    try {
      const dummyCodes = ['TRN-1001', 'TRN-1002', 'TRN-1003', 'TRN-1004', 'TRN-1005', 'TRN-1006'];
      await connection.query('DELETE FROM transports WHERE code IN (?)', [dummyCodes]);
      console.log('✅ Cleaned up dummy transport companies.');
    } catch (cleanErr) {
      console.warn('Transport cleanup note:', cleanErr.message);
    }

    // Seed default approved transport companies if table is empty
    try {
      const [rows] = await connection.query('SELECT COUNT(*) as count FROM transports');
      if (rows && rows[0] && rows[0].count === 0) {
        const DEFAULT_TRANSPORT_COMPANIES = [
          {
            code: 'TRN-SAPTO',
            name: 'شركة سابتكو للنقل (SAPTO)',
            name_en: 'SAPTO Transport Company',
            status: 'متاح',
            rating: 5.0,
            fleet_size: 48,
            fleet_label: '48 مركبة',
            fleet_label_en: '48 Vehicles',
            phone: '+966 50 456 7890',
            email: 'operations@saptco.com.sa',
            address: 'شارع إبراهيم الخليل، مكة المكرمة',
            region: 'مكة المكرمة',
            region_en: 'Makkah',
            vehicle_category: 'حافلات نقل حجاج ومعتمرين 50 راكب VIP',
            vehicle_category_en: '50-Seater Pilgrim Mass VIP Buses',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([
              'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            ]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة VIP 50 راكب', capacity: '50 راكب', price: 650, status: 'متاح' },
              { id: '2', type: 'فان سياحي VIP', capacity: '12 راكب', price: 350, status: 'متاح' },
              { id: '3', type: 'كوستر حديث', capacity: '24 راكب', price: 450, status: 'متاح' },
            ]),
            description: 'المشغل الوطني المعتمد لرحلات وتفويج الحجاج والمعتمرين',
            notes: 'Approved Naqaba operator',
          },
          {
            code: 'TRN-DALLAH',
            name: 'أسطول دله للنقل (Dallah)',
            name_en: 'Dallah Transport Fleet',
            status: 'متاح',
            rating: 4.9,
            fleet_size: 36,
            fleet_label: '36 مركبة',
            fleet_label_en: '36 Vehicles',
            phone: '+966 50 234 5678',
            email: 'info@dallah-transport.sa',
            address: 'طريق الملك فهد، المدينة المنورة',
            region: 'المدينة المنورة',
            region_en: 'Madinah',
            vehicle_category: 'حافلات مرسيدس ترافيكو وفانات فاخرة',
            vehicle_category_en: 'Mercedes Travego VIP Coaches & Vans',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([
              'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            ]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة مرسيدس ترافيكو', capacity: '49 راكب', price: 600, status: 'متاح' },
              { id: '2', type: 'فان مرسيدس سبرينتر', capacity: '14 راكب', price: 400, status: 'متاح' },
            ]),
            description: 'أسطول حديث مجهز لنقل الوفود والمجموعات بين مكة والمدينة',
            notes: 'VIP group logistics',
          },
          {
            code: 'TRN-RAWAHEL',
            name: 'شركة رواحل المشاعر (Rawahel)',
            name_en: 'Rawahel Al-Mashaer',
            status: 'متاح',
            rating: 4.8,
            fleet_size: 40,
            fleet_label: '40 مركبة',
            fleet_label_en: '40 Vehicles',
            phone: '+966 50 345 6789',
            email: 'contact@rawahel.sa',
            address: 'حي العزيزية، مكة المكرمة',
            region: 'مكة المكرمة',
            region_en: 'Makkah',
            vehicle_category: 'حافلات سياحية مجهزة لنقل المجموعات',
            vehicle_category_en: 'Modern High-Deck Mass Coaches',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة نقل جماعي 50 راكب', capacity: '50 راكب', price: 550, status: 'متاح' },
            ]),
            description: 'خدمات نقل متكاملة للمعتمرين وتفويج الحرمين',
            notes: 'Large group transfers',
          },
          {
            code: 'TRN-QAWAFIL',
            name: 'شركة قوافل الدولية (Qawafil)',
            name_en: 'Qawafil International',
            status: 'متاح',
            rating: 4.9,
            fleet_size: 30,
            fleet_label: '30 مركبة',
            fleet_label_en: '30 Vehicles',
            phone: '+966 50 123 4567',
            email: 'ops@qawafil.com',
            address: 'طريق المدينة، جدة',
            region: 'جدة',
            region_en: 'Jeddah',
            vehicle_category: 'حافلات نقل جماعي وفانات مطار',
            vehicle_category_en: 'King Long / Yutong Deluxe Coaches',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة يوتونج فاخرة', capacity: '50 راكب', price: 580, status: 'متاح' },
            ]),
            description: 'استقبال ونقل معتمرين من مطار الملك عبدالعزيز الدولي',
            notes: 'Full season contracts',
          },
          {
            code: 'TRN-ALQAID',
            name: 'شركة القائد لخدمات النقل (Al-Qaid)',
            name_en: 'Al-Qaid Transport',
            status: 'متاح',
            rating: 4.7,
            fleet_size: 25,
            fleet_label: '25 مركبة',
            fleet_label_en: '25 Vehicles',
            phone: '+966 50 567 8901',
            email: 'info@alqaid-trans.com',
            address: 'حي الشوقية، مكة المكرمة',
            region: 'مكة المكرمة',
            region_en: 'Makkah',
            vehicle_category: 'فانات سريعة وحافلات VIP للمعتمرين',
            vehicle_category_en: 'Airport Shuttles & Fast Response Fleet',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'فان نقل سريع VIP', capacity: '10 ركاب', price: 320, status: 'متاح' },
            ]),
            description: 'نقل سريع وحافلات مجهزة ومكيفة',
            notes: 'Fast response fleet',
          },
          {
            code: 'TRN-HAFIL',
            name: 'شركة حافل لنقل الحجاج (Hafil)',
            name_en: 'Hafil Transport Company',
            status: 'متاح',
            rating: 4.8,
            fleet_size: 55,
            fleet_label: '55 مركبة',
            fleet_label_en: '55 Vehicles',
            phone: '+966 50 333 4455',
            email: 'support@hafil.com.sa',
            address: 'طريق مكة جدة السريع، مكة المكرمة',
            region: 'مكة المكرمة',
            region_en: 'Makkah',
            vehicle_category: 'حافلات النقل المعتمدة للنقابة العامة للسيارات',
            vehicle_category_en: 'Approved Naqaba Fleet',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة حافل المعتمدة', capacity: '50 راكب', price: 500, status: 'متاح' },
            ]),
            description: 'أكبر أسطول حافلات لنقل ضيوف الرحمن ومعتمرين البر والجو',
            notes: 'Government certified mass transport',
          },
          {
            code: 'TRN-HARAMAIN',
            name: 'نقل الحرمين السريع',
            name_en: 'Haramain Express Transport',
            status: 'متاح',
            rating: 5.0,
            fleet_size: 32,
            fleet_label: '32 مركبة',
            fleet_label_en: '32 Vehicles',
            phone: '+966 50 678 9012',
            email: 'haramain@express-transport.sa',
            address: 'المنطقة المركزية، المدينة المنورة',
            region: 'المدينة المنورة',
            region_en: 'Madinah',
            vehicle_category: 'حافلات نقل حجاج ومعتمرين 50 راكب',
            vehicle_category_en: '50-Seater Pilgrim Mass Buses',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة 50 راكب VIP', capacity: '50 راكب', price: 620, status: 'متاح' },
            ]),
            description: 'رحلات يومية منتظمة بين مكة والمدينة وجدة',
            notes: 'Express VIP transport',
          },
          {
            code: 'TRN-RAJHI',
            name: 'شركة الراجحي للنقل',
            name_en: 'Al Rajhi Transport',
            status: 'متاح',
            rating: 4.9,
            fleet_size: 28,
            fleet_label: '28 مركبة',
            fleet_label_en: '28 Vehicles',
            phone: '+966 50 789 0123',
            email: 'info@alrajhi-transport.sa',
            address: 'طريق الملك عبدالعزيز، الرياض',
            region: 'الرياض',
            region_en: 'Riyadh',
            vehicle_category: 'فانات سياحية مجهزة وحافلات VIP',
            vehicle_category_en: 'Equipped Tourist Vans & VIP Buses',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
            photos_data: JSON.stringify([]),
            pricing_rates_data: JSON.stringify([
              { id: '1', type: 'حافلة VIP فاخرة', capacity: '45 راكب', price: 650, status: 'متاح' },
            ]),
            description: 'خدمات نقل راقية للوفود والبرامج الخاصة',
            notes: 'Premium services',
          },
        ];

        for (const comp of DEFAULT_TRANSPORT_COMPANIES) {
          await connection.query(
            `INSERT INTO transports (
              code, name, name_en, status, rating, fleet_size, fleet_label, fleet_label_en,
              phone, email, address, region, region_en, vehicle_category, vehicle_category_en,
              image, photos_data, pricing_rates_data, description, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              comp.code, comp.name, comp.name_en, comp.status, comp.rating, comp.fleet_size,
              comp.fleet_label, comp.fleet_label_en, comp.phone, comp.email, comp.address,
              comp.region, comp.region_en, comp.vehicle_category, comp.vehicle_category_en,
              comp.image, comp.photos_data, comp.pricing_rates_data, comp.description, comp.notes,
            ]
          );
        }
        console.log('✅ Seeded default transport companies into database.');
      }
    } catch (seedErr) {
      console.warn('Transport seed note:', seedErr.message);
    }

    connection.release();
    console.log('✅ Transport Service database initialized successfully.');
  } catch (error) {
    console.error('❌ Transport Service database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
