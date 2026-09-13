const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password',
  database: process.env.DB_NAME || 'umrah_db',
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

    // Seed default transport companies if table is empty
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM transports');
    if (existing[0].count === 0) {
      const defaultPricing = [
        { id: '1', type: 'حافلة عادية', capacity: '45 راكب', price: 350, status: 'متاح' },
        { id: '2', type: 'حافلة VIP', capacity: '30 راكب', price: 600, status: 'متاح' },
        { id: '3', type: 'كوستر (حافلة صغيرة)', capacity: '25 راكب', price: 250, status: 'متاح' },
        { id: '4', type: 'سيدان', capacity: '4 ركاب', price: 150, status: 'متاح' },
      ];

      const seedCompanies = [
        {
          code: 'TRN-1001',
          name: 'شركة نقل الحرمين السريع',
          name_en: 'Haramain Express Transport',
          status: 'متاح',
          rating: 4.9,
          fleet_size: 45,
          fleet_label: '45 حافلة ومركبة',
          fleet_label_en: '45 Buses & Vehicles',
          phone: '+966 50 4567 123',
          email: 'info@alharmain.com',
          address: 'حي المعابدة، مكة المكرمة',
          region: 'مكة المكرمة',
          region_en: 'Makkah',
          vehicle_category: 'حافلات وفانات نقل معتمرين وحجاج',
          vehicle_category_en: 'Pilgrim Buses & Transport Vans',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
        {
          code: 'TRN-1002',
          name: 'شركة أسطول المشاعر للنقل',
          name_en: 'Mashaer Fleet Transport',
          status: 'متاح',
          rating: 4.8,
          fleet_size: 30,
          fleet_label: '30 حافلة',
          fleet_label_en: '30 Buses',
          phone: '+966 55 1234 567',
          email: 'info@mashaerfleet.com',
          address: 'حي العزيزية، مكة المكرمة',
          region: 'مكة المكرمة',
          region_en: 'Makkah',
          vehicle_category: 'حافلات حديثة وسيارات VIP',
          vehicle_category_en: 'Modern Buses & VIP Cars',
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
        {
          code: 'TRN-1003',
          name: 'شركة راحة ضيوف الرحمن للنقل',
          name_en: 'Rahat Dyouf Transport',
          status: 'متاح',
          rating: 5.0,
          fleet_size: 50,
          fleet_label: '50 حافلة',
          fleet_label_en: '50 Buses',
          phone: '+966 54 9876 543',
          email: 'info@rahatdyouf.com',
          address: 'طريق الملك فهد، المدينة المنورة',
          region: 'المدينة المنورة',
          region_en: 'Madinah',
          vehicle_category: 'حافلات VIP ومركبات سياحية',
          vehicle_category_en: 'VIP Buses & Tourist Vehicles',
          image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
        {
          code: 'TRN-1004',
          name: 'مجموعة الجزيرة لخدمات الحافلات',
          name_en: 'Al-Jazeera Bus Group',
          status: 'متوسط',
          rating: 4.7,
          fleet_size: 25,
          fleet_label: '25 حافلة',
          fleet_label_en: '25 Buses',
          phone: '+966 56 3334 444',
          email: 'info@aljazeerabus.sa',
          address: 'طريق المدينة المنورة، جدة',
          region: 'جدة',
          region_en: 'Jeddah',
          vehicle_category: 'نقل سريع ومطارات',
          vehicle_category_en: 'Airport & Express Transit',
          image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
        {
          code: 'TRN-1005',
          name: 'شركة روافد الحجاز للنقل الترددي',
          name_en: 'Rawafed Al-Hejaz Transport',
          status: 'متاح',
          rating: 4.9,
          fleet_size: 60,
          fleet_label: '60 حافلة',
          fleet_label_en: '60 Buses',
          phone: '+966 50 7778 899',
          email: 'support@rawafed.sa',
          address: 'حي كدي، مكة المكرمة',
          region: 'مكة المكرمة',
          region_en: 'Makkah',
          vehicle_category: 'نقل ترددي معتمرين وحجاج',
          vehicle_category_en: 'Pilgrim Shuttle & Transit',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
        {
          code: 'TRN-1006',
          name: 'شركة طيبة للنقل السياحي والفاخر',
          name_en: 'Taybah Luxury Tourism Transport',
          status: 'متاح',
          rating: 4.8,
          fleet_size: 40,
          fleet_label: '40 مركبة',
          fleet_label_en: '40 Vehicles',
          phone: '+966 53 2221 111',
          email: 'contact@taybahbus.sa',
          address: 'حي سيد الشهداء، المدينة المنورة',
          region: 'المدينة المنورة',
          region_en: 'Madinah',
          vehicle_category: 'حافلات سياحية وفاخرة',
          vehicle_category_en: 'Luxury & Tourism Fleet',
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          pricing_rates_data: JSON.stringify(defaultPricing),
        },
      ];

      for (const comp of seedCompanies) {
        await connection.query(
          `INSERT INTO transports (
            code, name, name_en, status, rating, fleet_size, fleet_label, fleet_label_en,
            phone, email, address, region, region_en, vehicle_category, vehicle_category_en,
            image, pricing_rates_data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            comp.code, comp.name, comp.name_en, comp.status, comp.rating, comp.fleet_size,
            comp.fleet_label, comp.fleet_label_en, comp.phone, comp.email, comp.address,
            comp.region, comp.region_en, comp.vehicle_category, comp.vehicle_category_en,
            comp.image, comp.pricing_rates_data
          ]
        );
      }
      console.log('✅ Seeded default transport companies successfully.');
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
