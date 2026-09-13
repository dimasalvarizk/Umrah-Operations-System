const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password',
  database: process.env.DB_NAME || 'umrah_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

async function initDb() {
  try {
    const adminConnection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root_password',
    });

    const dbName = process.env.DB_NAME || 'umrah_db';
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConnection.end();

    // Table: groups
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(200) NOT NULL,
        \`agreement_number\` VARCHAR(100) DEFAULT NULL,
        \`main_agent\` VARCHAR(200) DEFAULT NULL,
        \`sub_agent\` VARCHAR(200) DEFAULT NULL,
        \`nationality\` VARCHAR(100) DEFAULT NULL,
        \`package_type\` VARCHAR(200) DEFAULT NULL,
        \`pilgrims_count\` INT NOT NULL DEFAULT 1,
        \`status\` VARCHAR(50) DEFAULT 'قيد التجهيز',
        \`makkah_hotel\` VARCHAR(255) DEFAULT NULL,
        \`makkah_checkin\` VARCHAR(50) DEFAULT NULL,
        \`makkah_checkout\` VARCHAR(50) DEFAULT NULL,
        \`madinah_hotel\` VARCHAR(255) DEFAULT NULL,
        \`madinah_checkin\` VARCHAR(50) DEFAULT NULL,
        \`madinah_checkout\` VARCHAR(50) DEFAULT NULL,
        \`makkah_hotel2\` VARCHAR(255) DEFAULT NULL,
        \`makkah2_checkin\` VARCHAR(50) DEFAULT NULL,
        \`makkah2_checkout\` VARCHAR(50) DEFAULT NULL,
        \`hospitality_notes\` TEXT DEFAULT NULL,
        \`departure_airline\` VARCHAR(255) DEFAULT NULL,
        \`departure_flight_no\` VARCHAR(100) DEFAULT NULL,
        \`departure_date\` VARCHAR(50) DEFAULT NULL,
        \`departure_airport\` VARCHAR(255) DEFAULT NULL,
        \`departure_destination\` VARCHAR(255) DEFAULT NULL,
        \`arrival_airline\` VARCHAR(255) DEFAULT NULL,
        \`arrival_flight_no\` VARCHAR(100) DEFAULT NULL,
        \`arrival_date\` VARCHAR(50) DEFAULT NULL,
        \`arrival_airport\` VARCHAR(255) DEFAULT NULL,
        \`arrival_origin\` VARCHAR(255) DEFAULT NULL,
        \`transport_company\` VARCHAR(255) DEFAULT NULL,
        \`operation_number\` VARCHAR(100) DEFAULT NULL,
        \`driver_name\` VARCHAR(255) DEFAULT NULL,
        \`driver_phone\` VARCHAR(100) DEFAULT NULL,
        \`bus_plate_no\` VARCHAR(100) DEFAULT NULL,
        \`umrah_permit_status\` VARCHAR(100) DEFAULT NULL,
        \`rawdah_men_permit_status\` VARCHAR(100) DEFAULT NULL,
        \`rawdah_women_permit_status\` VARCHAR(100) DEFAULT NULL,
        \`arrival_grouping_status\` VARCHAR(100) DEFAULT NULL,
        \`intercity_grouping_status\` VARCHAR(100) DEFAULT NULL,
        \`departure_grouping_status\` VARCHAR(100) DEFAULT NULL,
        \`makkah_ziyarat\` TEXT DEFAULT NULL,
        \`madinah_ziyarat\` TEXT DEFAULT NULL,
        \`enrichment_program\` TEXT DEFAULT NULL,
        \`missing_requirements\` TEXT DEFAULT NULL,
        \`additional_notes\` TEXT DEFAULT NULL,
        \`uploaded_files\` JSON DEFAULT NULL,
        \`hotels_data\` JSON DEFAULT NULL,
        \`flight_transport_data\` JSON DEFAULT NULL,
        \`permits_notes_data\` JSON DEFAULT NULL,
        \`created_by\` INT DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_groups_code\` (\`code\`),
        INDEX \`idx_groups_status\` (\`status\`),
        INDEX \`idx_groups_main_agent\` (\`main_agent\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Groups Service database and `groups` table verified successfully.');
  } catch (error) {
    console.error('❌ Groups Service DB error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
