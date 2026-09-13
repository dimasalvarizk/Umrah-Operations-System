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
