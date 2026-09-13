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
