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
    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'عام',
        priority VARCHAR(50) DEFAULT 'عادي',
        status VARCHAR(50) DEFAULT 'نشط',
        is_pinned BOOLEAN DEFAULT FALSE,
        related_entity VARCHAR(255),
        author VARCHAR(150) NOT NULL,
        date_string VARCHAR(100),
        tags_data JSON,
        checklist_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createNotesTable);
    connection.release();
    console.log('✅ Notes Service database initialized successfully.');
  } catch (error) {
    console.error('❌ Notes Service database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
