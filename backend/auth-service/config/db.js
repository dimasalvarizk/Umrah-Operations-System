const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'root_password';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'umrah_db';

// Create connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

// Auto-initialize tables on startup
async function initDb() {
  try {
    // First, check or create the database if not exists
    const adminConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConnection.end();

    // Now ensure users table exists in pool
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`role\` VARCHAR(50) DEFAULT 'admin',
        \`phone\` VARCHAR(50) DEFAULT NULL,
        \`avatar\` MEDIUMTEXT DEFAULT NULL,
        \`employee_id\` VARCHAR(50) DEFAULT NULL,
        \`branch\` VARCHAR(100) DEFAULT NULL,
        \`department\` VARCHAR(100) DEFAULT NULL,
        \`job_title\` VARCHAR(100) DEFAULT NULL,
        \`status\` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        \`last_login\` DATETIME DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_users_email\` (\`email\`),
        INDEX \`idx_users_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.query(createUsersTableQuery);

    // Auto-migrate newly added columns if table previously created
    const [cols] = await pool.query(`SHOW COLUMNS FROM \`users\``);
    const colNames = cols.map((c) => c.Field);
    if (!colNames.includes('employee_id')) {
      await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`employee_id\` VARCHAR(50) DEFAULT NULL AFTER \`avatar\``);
    }
    if (!colNames.includes('branch')) {
      await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`branch\` VARCHAR(100) DEFAULT NULL AFTER \`employee_id\``);
    }
    if (!colNames.includes('department')) {
      await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`department\` VARCHAR(100) DEFAULT NULL AFTER \`branch\``);
    }
    if (!colNames.includes('job_title')) {
      await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`job_title\` VARCHAR(100) DEFAULT NULL AFTER \`department\``);
    }
    // Check if avatar and role need modification
    await pool.query(`ALTER TABLE \`users\` MODIFY COLUMN \`avatar\` MEDIUMTEXT DEFAULT NULL`);
    await pool.query(`ALTER TABLE \`users\` MODIFY COLUMN \`role\` VARCHAR(50) DEFAULT 'admin'`);

    // Create login_logs table for real-time audit logs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`login_logs\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT DEFAULT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`ip\` VARCHAR(50) DEFAULT '127.0.0.1',
        \`agent\` VARCHAR(255) DEFAULT 'Browser',
        \`city\` VARCHAR(100) DEFAULT NULL,
        \`country\` VARCHAR(100) DEFAULT NULL,
        \`status\` ENUM('Success', 'Failed') DEFAULT 'Success',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_login_user\` (\`user_id\`),
        INDEX \`idx_login_email\` (\`email\`),
        INDEX \`idx_login_created\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Auto-migrate newly added columns in login_logs
    try {
      const [logCols] = await pool.query(`SHOW COLUMNS FROM \`login_logs\``);
      const logColNames = logCols.map((c) => c.Field);
      if (!logColNames.includes('city')) {
        await pool.query(`ALTER TABLE \`login_logs\` ADD COLUMN \`city\` VARCHAR(100) DEFAULT NULL AFTER \`agent\``);
      }
      if (!logColNames.includes('country')) {
        await pool.query(`ALTER TABLE \`login_logs\` ADD COLUMN \`country\` VARCHAR(100) DEFAULT NULL AFTER \`city\``);
      }
      if (!logColNames.includes('user_id')) {
        await pool.query(`ALTER TABLE \`login_logs\` ADD COLUMN \`user_id\` INT DEFAULT NULL AFTER \`id\``);
      }
    } catch (migLogErr) {
      console.warn('login_logs migration notice:', migLogErr.message);
    }

    // Create user_sessions table for active sessions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`user_sessions\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`user_id\` INT NOT NULL,
        \`device\` VARCHAR(150) NOT NULL,
        \`ip\` VARCHAR(50) NOT NULL,
        \`location\` VARCHAR(150) DEFAULT 'Saudi Arabia',
        \`type\` ENUM('desktop', 'mobile') DEFAULT 'desktop',
        \`is_current\` TINYINT(1) DEFAULT 0,
        \`last_active\` VARCHAR(100) DEFAULT 'Active now',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_sess_user\` (\`user_id\`),
        INDEX \`idx_sess_device\` (\`device\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Auto-migrate newly added columns in user_sessions
    try {
      const [sessCols] = await pool.query(`SHOW COLUMNS FROM \`user_sessions\``);
      const sessColNames = sessCols.map((c) => c.Field);
      if (!sessColNames.includes('type')) {
        await pool.query(`ALTER TABLE \`user_sessions\` ADD COLUMN \`type\` ENUM('desktop', 'mobile') DEFAULT 'desktop' AFTER \`location\``);
      }
      if (!sessColNames.includes('is_current')) {
        await pool.query(`ALTER TABLE \`user_sessions\` ADD COLUMN \`is_current\` TINYINT(1) DEFAULT 0 AFTER \`type\``);
      }
      if (!sessColNames.includes('last_active')) {
        await pool.query(`ALTER TABLE \`user_sessions\` ADD COLUMN \`last_active\` VARCHAR(100) DEFAULT 'Active now' AFTER \`is_current\``);
      }
    } catch (migSessErr) {
      console.warn('user_sessions migration notice:', migSessErr.message);
    }

    // Create activity_logs table for audit trail
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`activity_logs\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT DEFAULT NULL,
        \`user_name\` VARCHAR(150) NOT NULL,
        \`user_email\` VARCHAR(150) DEFAULT NULL,
        \`user_role\` VARCHAR(50) DEFAULT 'Staff',
        \`action\` VARCHAR(50) NOT NULL,
        \`module\` VARCHAR(50) NOT NULL,
        \`entity_id\` VARCHAR(100) DEFAULT NULL,
        \`entity_name\` VARCHAR(255) DEFAULT NULL,
        \`description_en\` TEXT NOT NULL,
        \`description_ar\` TEXT NOT NULL,
        \`metadata\` JSON DEFAULT NULL,
        \`ip_address\` VARCHAR(45) DEFAULT NULL,
        \`login_city\` VARCHAR(100) DEFAULT NULL,
        \`login_country\` VARCHAR(100) DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_act_user_name\` (\`user_name\`),
        INDEX \`idx_act_module\` (\`module\`),
        INDEX \`idx_act_action\` (\`action\`),
        INDEX \`idx_act_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create password_resets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`password_resets\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`email\` VARCHAR(150) NOT NULL,
        \`otp_code\` VARCHAR(10) NOT NULL,
        \`token\` VARCHAR(255) NOT NULL,
        \`expires_at\` DATETIME NOT NULL,
        \`used\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_pwd_email\` (\`email\`),
        INDEX \`idx_pwd_token\` (\`token\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Auto-seed default Super Admin accounts if not exist
    try {
      const bcrypt = require('bcryptjs');
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const [dimasCheck] = await pool.query("SELECT id FROM `users` WHERE `email` = 'alvarizkidimas@gmail.com' LIMIT 1");
      if (dimasCheck.length === 0) {
        await pool.query(
          `INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`, \`role\`, \`phone\`, \`employee_id\`, \`branch\`, \`department\`, \`job_title\`, \`status\`)
           VALUES (?, ?, ?, 'admin', ?, 'EMP-0001', 'Jeddah Main Office', 'Operations Management', 'Super Admin & Lead Director', 'active')`,
          ['Dimas Alvarizki', 'alvarizkidimas@gmail.com', hashedPassword, '+62 812 3456 7890']
        );
      }

      const [aliCheck] = await pool.query("SELECT id FROM `users` WHERE `email` = 'ali@odst.id' LIMIT 1");
      if (aliCheck.length === 0) {
        await pool.query(
          `INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`, \`role\`, \`phone\`, \`employee_id\`, \`branch\`, \`department\`, \`job_title\`, \`status\`)
           VALUES (?, ?, ?, 'admin', ?, 'EMP-0002', 'Makkah Branch', 'Operations Management', 'Super Admin & Operations Director', 'active')`,
          ['Ali', 'ali@odst.id', hashedPassword, '+966 50 123 4567']
        );
      }
    } catch (seedErr) {
      console.warn('Super Admin seeding note:', seedErr.message);
    }

    console.log('✅ Database connected and `users`, `login_logs`, `user_sessions`, `password_resets` tables verified successfully.');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
