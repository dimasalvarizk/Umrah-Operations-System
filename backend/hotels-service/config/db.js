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
    const createHotelsTable = `
      CREATE TABLE IF NOT EXISTS hotels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        location VARCHAR(100) NOT NULL,
        location_en VARCHAR(100),
        address VARCHAR(255),
        address_en VARCHAR(255),
        status VARCHAR(50) DEFAULT 'نشط',
        rating INT DEFAULT 5,
        available_rooms INT DEFAULT 0,
        price_per_night DECIMAL(10,2) DEFAULT 0.00,
        distance_to_haram VARCHAR(100),
        image LONGTEXT,
        images_data JSON DEFAULT NULL,
        room_types_data JSON,
        amenities_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createHotelsTable);

    // Ensure images_data column exists
    const [cols] = await connection.query('SHOW COLUMNS FROM `hotels`');
    const colNames = cols.map((c) => c.Field);
    if (!colNames.includes('images_data')) {
      await connection.query('ALTER TABLE `hotels` ADD COLUMN `images_data` JSON DEFAULT NULL AFTER `image`');
    }
    await connection.query('ALTER TABLE `hotels` MODIFY `image` LONGTEXT');

    connection.release();
    console.log('✅ Hotels Service database initialized successfully.');
  } catch (error) {
    console.error('❌ Hotels Service database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
