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
    const createContractsTable = `
      CREATE TABLE IF NOT EXISTS contracts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        agreement_no VARCHAR(50) NOT NULL UNIQUE,
        agreement_name VARCHAR(255) NOT NULL,
        entity_name VARCHAR(255) NOT NULL,
        type VARCHAR(100) DEFAULT 'فندق',
        city VARCHAR(100),
        rooms_count INT DEFAULT 0,
        duration_days INT DEFAULT 1,
        start_date VARCHAR(100) NOT NULL,
        end_date VARCHAR(100) NOT NULL,
        total_price DECIMAL(12,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'نشطة',
        notes TEXT,
        details_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createContractsTable);

    // Clean up any previously seeded dummy agreements
    try {
      const dummyAgreements = [
        'AGR-1125900', 'AGR-2294103', 'AGR-3315802', 'AGR-4428190',
        'AGR-5519203', 'AGR-6629104', 'AGR-7738219', 'AGR-8849201'
      ];
      await connection.query(
        'DELETE FROM contracts WHERE agreement_no IN (?)',
        [dummyAgreements]
      );
    } catch (cleanErr) {
      console.warn('Dummy cleanup note:', cleanErr.message);
    }

    connection.release();
    console.log('✅ Contracts Service database initialized successfully without dummy data.');
  } catch (error) {
    console.error('❌ Contracts Service database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
