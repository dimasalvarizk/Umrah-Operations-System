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
