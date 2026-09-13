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
    const createTripsTable = `
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        route_name VARCHAR(255) NOT NULL,
        start_date VARCHAR(100) NOT NULL,
        end_date VARCHAR(100) NOT NULL,
        pilgrims_count INT DEFAULT 1,
        guide_name VARCHAR(150),
        status VARCHAR(50) DEFAULT 'قيد التنفيذ',
        program_name VARCHAR(255),
        route_path VARCHAR(255),
        program_type VARCHAR(100),
        expected_duration VARCHAR(100),
        dominant_nationality VARCHAR(100),
        airline VARCHAR(150),
        flight_number VARCHAR(100),
        airport_hub VARCHAR(150),
        makkah_hotel VARCHAR(150),
        makkah_stay VARCHAR(100),
        madinah_hotel VARCHAR(150),
        madinah_stay VARCHAR(100),
        transport_company VARCHAR(150),
        transport_type VARCHAR(150),
        bus_number VARCHAR(100),
        driver_name VARCHAR(150),
        driver_phone VARCHAR(100),
        supervisor_name VARCHAR(150),
        supervisor_phone VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createTripsTable);
    connection.release();
    console.log('✅ Trips Service database initialized successfully.');
  } catch (error) {
    console.error('❌ Trips Service database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
