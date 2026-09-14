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
  timezone: '+00:00',
});

async function initDb() {
  try {
    const adminConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConnection.end();

    // Table 1: system_lists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`system_lists\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`category\` ENUM('agents', 'airlines', 'countries', 'branches', 'transport', 'packages', 'airports', 'room_types', 'guides', 'routes') NOT NULL,
        \`name_en\` VARCHAR(200) NOT NULL,
        \`name_ar\` VARCHAR(200) NOT NULL,
        \`code\` VARCHAR(50) DEFAULT NULL,
        \`secondary\` VARCHAR(255) DEFAULT NULL,
        \`status\` ENUM('Active', 'Inactive') DEFAULT 'Active',
        \`notes\` TEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_system_lists_category\` (\`category\`),
        INDEX \`idx_system_lists_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure ENUM is updated on existing tables
    try {
      await pool.query(`
        ALTER TABLE \`system_lists\` 
        MODIFY COLUMN \`category\` ENUM('agents', 'airlines', 'countries', 'branches', 'transport', 'packages', 'airports', 'room_types', 'guides', 'routes') NOT NULL;
      `);
    } catch (e) {
      // Ignored if already up to date
    }

    // Ensure initial real system list records in database if category is empty
    const CATEGORY_INITIALS = {
      routes: [
        { nameEn: 'Makkah ➔ Madinah', nameAr: 'مكة ← المدينة', code: 'MKH-MED', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
        { nameEn: 'Madinah ➔ Makkah', nameAr: 'المدينة ← مكة', code: 'MED-MKH', secondary: 'Intercity Bus / Haramain', status: 'Active', notes: 'Standard umrah route' },
        { nameEn: 'Jeddah Airport ➔ Makkah', nameAr: 'مطار جدة ← مكة', code: 'JED-MKH', secondary: 'Airport Arrival Transfer', status: 'Active', notes: 'Arrival reception' },
        { nameEn: 'Makkah ➔ Jeddah Airport', nameAr: 'مكة ← مطار جدة', code: 'MKH-JED', secondary: 'Airport Departure Transfer', status: 'Active', notes: 'Departure farewell' },
        { nameEn: 'Makkah (Rusaifah) ↔ Madinah', nameAr: 'مكة (الرصيفة) ↔ المدينة', code: 'HSR-MKH-MED', secondary: 'Haramain High Speed Train', status: 'Active', notes: 'Express bullet train' },
        { nameEn: 'Makkah ↔ Mount Thawr', nameAr: 'مكة المكرمة ↔ جبل ثور', code: 'MKH-THW', secondary: 'Makkah Historic Ziyarah', status: 'Active', notes: 'Historical ziyarah site' },
        { nameEn: 'Jakarta ➔ Jeddah (JED Airport)', nameAr: 'جاكرتا ← جدة (مطار الملك عبد العزيز)', code: 'CGK-JED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - KSA' },
        { nameEn: 'Jakarta ➔ Madinah (MED Airport)', nameAr: 'جاكرتا ← المدينة (مطار الأمير محمد)', code: 'CGK-MED', secondary: 'International Flight', status: 'Active', notes: 'Direct flight Indonesia - Madinah' },
        { nameEn: 'Jeddah ➔ Jakarta', nameAr: 'جدة ← جاكرتا', code: 'JED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight to Indonesia' },
        { nameEn: 'Madinah ➔ Jakarta', nameAr: 'المدينة ← جاكرتا', code: 'MED-CGK', secondary: 'Return International Flight', status: 'Active', notes: 'Return flight from Madinah' },
      ],
      agents: [
        { nameEn: 'Hasoob Al-Haiba', nameAr: 'حاسوب الهيبة', code: 'AGT-01', secondary: 'Saudi Arabia', status: 'Active', notes: 'Main agency partner' },
        { nameEn: 'ODST Group Partner', nameAr: 'مجموعة أو دي إس تي', code: 'AGT-02', secondary: 'Saudi Arabia', status: 'Active', notes: 'Core operational partner' },
        { nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران', code: 'AGT-03', secondary: 'Egypt', status: 'Active', notes: 'Tasheel Tourism sub-agent' },
        { nameEn: 'Noor Al-Iman International', nameAr: 'نور الإيمان الدولية', code: 'AGT-04', secondary: 'Egypt', status: 'Active', notes: 'Cairo regional agent' },
        { nameEn: 'Indonesia Travel Umrah', nameAr: 'إندونيسيا ترافيل', code: 'AGT-05', secondary: 'Indonesia', status: 'Active', notes: 'Al-Huda Trips partner' },
        { nameEn: 'Al-Safa Travel India', nameAr: 'الصفا ترافيل الهند', code: 'AGT-06', secondary: 'India', status: 'Active', notes: 'Mumbai & Delhi operations' },
        { nameEn: 'Ankara Tourism Agency', nameAr: 'وكالة أنقرة للسياحة', code: 'AGT-07', secondary: 'Turkey', status: 'Active', notes: 'Tasheel Turkey representative' },
        { nameEn: 'Islamic Association Indonesia', nameAr: 'رابطة الإسلام إندونيسيا', code: 'AGT-08', secondary: 'Indonesia', status: 'Active', notes: 'Jakarta groups partner' },
        { nameEn: 'Modern Amman Agency', nameAr: 'وكالة عمان الحديثة', code: 'AGT-09', secondary: 'Jordan', status: 'Active', notes: 'Al-Quds Jordan affiliate' },
        { nameEn: 'Al-Rahman Pakistan', nameAr: 'الرحمن باكستان', code: 'AGT-10', secondary: 'Pakistan', status: 'Active', notes: 'Karachi & Lahore agent' },
      ],
      airlines: [
        { nameEn: 'Saudia', nameAr: 'الخطوط السعودية', code: 'SV', secondary: 'Jeddah / Madinah', status: 'Active', notes: 'National flag carrier' },
        { nameEn: 'Flynas', nameAr: 'طيران ناس', code: 'XY', secondary: 'Riyadh / Jeddah', status: 'Active', notes: 'Domestic & Regional' },
        { nameEn: 'Garuda Indonesia', nameAr: 'جارودا إندونيسيا', code: 'GA', secondary: 'Jakarta', status: 'Active', notes: 'Direct Hajj & Umrah charter' },
        { nameEn: 'EgyptAir', nameAr: 'مصر للطيران', code: 'MS', secondary: 'Cairo / Alexandria', status: 'Active', notes: 'Daily flights' },
        { nameEn: 'Qatar Airways', nameAr: 'الخطوط القطرية', code: 'QR', secondary: 'Doha', status: 'Active', notes: 'Transit international' },
        { nameEn: 'Emirates Airlines', nameAr: 'طيران الإمارات', code: 'EK', secondary: 'Dubai', status: 'Active', notes: 'Global transit hubs' },
        { nameEn: 'Turkish Airlines', nameAr: 'الخطوط التركية', code: 'TK', secondary: 'Istanbul', status: 'Active', notes: 'European & Central Asia traffic' },
        { nameEn: 'Lion Air', nameAr: 'ليون إير', code: 'JT', secondary: 'Surabaya / Jakarta', status: 'Active', notes: 'Direct umrah charter' },
      ],
      countries: [
        { nameEn: 'Indonesia', nameAr: 'إندونيسيا', code: 'ID (+62)', secondary: 'Southeast Asia', status: 'Active', notes: 'High volume pilgrims' },
        { nameEn: 'Pakistan', nameAr: 'باكستان', code: 'PK (+92)', secondary: 'South Asia', status: 'Active', notes: 'High volume pilgrims' },
        { nameEn: 'Egypt', nameAr: 'مصر', code: 'EG (+20)', secondary: 'Middle East', status: 'Active', notes: 'Year-round operations' },
        { nameEn: 'Turkey', nameAr: 'تركيا', code: 'TR (+90)', secondary: 'Eurasia', status: 'Active', notes: 'Regular season & Ramadan' },
        { nameEn: 'India', nameAr: 'الهند', code: 'IN (+91)', secondary: 'South Asia', status: 'Active', notes: 'Regular groups' },
        { nameEn: 'Jordan', nameAr: 'الأردن', code: 'JO (+962)', secondary: 'Levant', status: 'Active', notes: 'Direct land & air umrah' },
        { nameEn: 'Algeria', nameAr: 'الجزائر', code: 'DZ (+213)', secondary: 'North Africa', status: 'Active', notes: 'Seasonal groups' },
        { nameEn: 'Malaysia', nameAr: 'ماليزيا', code: 'MY (+60)', secondary: 'Southeast Asia', status: 'Active', notes: 'Premium programs' },
      ],
      branches: [
        { nameEn: 'Makkah Main Operations', nameAr: 'الفرع الرئيسي - مكة المكرمة', code: 'MKH-01', secondary: 'Ibrahim Al-Khalil St.', status: 'Active', notes: 'Main HQ operations' },
        { nameEn: 'Madinah Regional Hub', nameAr: 'فرع المدينة المنورة', code: 'MED-01', secondary: 'Central Area North', status: 'Active', notes: 'Prophet Mosque operations' },
        { nameEn: 'Jeddah Airport Terminal Desk', nameAr: 'مكتب مطار الملك عبدالعزيز - جدة', code: 'JED-AIR', secondary: 'Terminal 1 & North', status: 'Active', notes: '24/7 Pilgrim Reception' },
        { nameEn: 'Yanbu Port Logistics', nameAr: 'مكتب ميناء ينبع التجاري', code: 'YNB-01', secondary: 'Maritime Terminal', status: 'Active', notes: 'Ferry and cruise support' },
      ],
      transport: [
        { nameEn: 'SAPTO Transport Company', nameAr: 'شركة سابتكو للنقل', code: 'BUS-SAP', secondary: 'VIP Coaches & standard', status: 'Active', notes: 'Approved Naqaba operator' },
        { nameEn: 'Dallah Transport Fleet', nameAr: 'أسطول دله للنقل', code: 'BUS-DAL', secondary: 'Mercedes Travego / Man', status: 'Active', notes: 'VIP group logistics' },
        { nameEn: 'Rawahel Al-Mashaer', nameAr: 'رواحل المشاعر', code: 'BUS-RAW', secondary: 'Modern High-deckers', status: 'Active', notes: 'Large group transfers' },
        { nameEn: 'Qawafil International', nameAr: 'قوافل الدولية', code: 'BUS-QAW', secondary: 'King Long / Yutong', status: 'Active', notes: 'Full season contracts' },
        { nameEn: 'Al-Qaid Transport', nameAr: 'شركة القائد لخدمات النقل', code: 'BUS-QAD', secondary: 'Airport shuttles & buses', status: 'Active', notes: 'Fast response fleet' },
        { nameEn: 'Hafil Transport Company', nameAr: 'شركة حافل لنقل الحجاج', code: 'BUS-HFL', secondary: 'Approved Naqaba Fleet', status: 'Active', notes: 'Government certified mass transport' },
      ],
      packages: [
        { nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات التنفيذية (١٤ يوم)', code: 'PKG-VIP14', secondary: '5-Star Front Row Hotels', status: 'Active', notes: 'Full Board & Private GMC transfers' },
        { nameEn: 'Premium Gold 12 Days', nameAr: 'الباقة الذهبية المميزة (١٢ يوم)', code: 'PKG-GLD12', secondary: '5-Star Walking Distance', status: 'Active', notes: 'Half Board & Luxury Bus' },
        { nameEn: 'Classic Economy 10 Days', nameAr: 'الباقة الاقتصادية الكلاسيكية (١٠ أيام)', code: 'PKG-ECO10', secondary: '4-Star Central Hotels', status: 'Active', notes: 'Bed & Breakfast, Group Coach' },
        { nameEn: 'Ramadan Last 10 Days Special', nameAr: 'برنامج العشر الأواخر من رمضان', code: 'PKG-RAM10', secondary: 'Makkah Clock Towers', status: 'Active', notes: 'Iftar & Suhoor Included' },
      ],
      airports: [
        { nameEn: 'Prince Mohammad Bin Abdulaziz Int. Airport - Madinah (MED)', nameAr: 'مطار الأمير محمد بن عبد العزيز الدولي - المدينة (MED)', code: 'MED', secondary: 'Madinah, KSA', status: 'Active', notes: 'GACA Approved Umrah Terminal' },
        { nameEn: 'King Abdulaziz Int. Airport - Jeddah (JED)', nameAr: 'مطار الملك عبد العزيز الدولي - جدة (JED)', code: 'JED', secondary: 'Jeddah, KSA', status: 'Active', notes: 'Hajj & Umrah Main Gateway' },
        { nameEn: 'Taif International Airport (TIF)', nameAr: 'مطار الطائف الدولي (TIF)', code: 'TIF', secondary: 'Taif, KSA', status: 'Active', notes: 'Miqat Qarn Al-Manazil Gateway' },
        { nameEn: 'King Khalid Int. Airport - Riyadh (RUH)', nameAr: 'مطار الملك خالد الدولي - الرياض (RUH)', code: 'RUH', secondary: 'Riyadh, KSA', status: 'Active', notes: 'Capital Hub & Connecting Port' },
        { nameEn: 'Yanbu Prince Abdul Mohsin Int. Airport (YNB)', nameAr: 'مطار الأمير عبد المحسن بن عبد العزيز ينبع (YNB)', code: 'YNB', secondary: 'Yanbu, KSA', status: 'Active', notes: 'Red Sea & Western Port' },
      ],
      room_types: [
        { nameEn: 'Double Room (2 Persons)', nameAr: 'غرفة ثنائية (شخصين)', code: 'DBL-2', secondary: '2 Beds • 28 m²', status: 'Active', notes: '2 Standard Single Beds' },
        { nameEn: 'King Room (2 Persons)', nameAr: 'غرفة كينج فاخرة (شخصين)', code: 'KNG-2', secondary: '1 King Bed • 32 m²', status: 'Active', notes: '1 Master King Size Bed' },
        { nameEn: 'Single Room (1 Person)', nameAr: 'غرفة مفردة (شخص واحد)', code: 'SGL-1', secondary: '1 Bed • 22 m²', status: 'Active', notes: 'Private single traveler' },
        { nameEn: 'Triple Room (3 Persons)', nameAr: 'غرفة ثلاثية (٣ أشخاص)', code: 'TRP-3', secondary: '3 Beds • 30 m²', status: 'Active', notes: '3 Standard Single Beds' },
        { nameEn: 'Quad Room (4 Persons)', nameAr: 'غرفة رباعية (٤ أشخاص)', code: 'QAD-4', secondary: '4 Beds • 36 m²', status: 'Active', notes: '4 Standard Single Beds' },
        { nameEn: 'Quint Room (5 Persons)', nameAr: 'غرفة خماسية (٥ أشخاص)', code: 'QNT-5', secondary: '5 Beds • 45 m²', status: 'Active', notes: '5 Single Beds Family' },
        { nameEn: 'Family Suite (6 Persons)', nameAr: 'جناح عائلي (٦ أشخاص)', code: 'STE-6', secondary: '6 Beds • 55 m²', status: 'Active', notes: 'Connecting Suite 6 Pax' },
        { nameEn: 'Royal VIP Suite (4-6 Persons)', nameAr: 'جناح ملكي فاخر (٤-٦ أشخاص)', code: 'ROY-VIP', secondary: '4-6 Beds • 75 m²', status: 'Active', notes: 'Direct Haram View Luxury' },
      ],
      guides: [
        { nameEn: 'Youssef Makki', nameAr: 'يوسف مكي', code: 'GUD-01', secondary: 'Senior Makkah Mutawwif', status: 'Active', notes: 'Arabic, English, Indonesian' },
        { nameEn: 'Abdulrahman Saber', nameAr: 'عبد الرحمن صابر', code: 'GUD-02', secondary: 'Madinah Ziyarah Specialist', status: 'Active', notes: 'Arabic, English, Urdu' },
        { nameEn: 'Ahmed Al-Otaibi', nameAr: 'أحمد العتيبي', code: 'GUD-03', secondary: 'Historical Sites Guide', status: 'Active', notes: 'Arabic, English' },
        { nameEn: 'Faisal Al-Harbi', nameAr: 'فيصل الحربي', code: 'GUD-04', secondary: 'VIP Delegations Lead', status: 'Active', notes: 'Arabic, English, Turkish' },
        { nameEn: 'Jamal Mustafa', nameAr: 'جمال مصطفى', code: 'GUD-05', secondary: 'Airport Logistics & Guide', status: 'Active', notes: 'Arabic, English, French' },
        { nameEn: 'Tariq Al-Husseini', nameAr: 'طارق الحسيني', code: 'GUD-06', secondary: 'Hajj & Umrah Fiqh Guide', status: 'Active', notes: 'Arabic, English, Malay' },
      ],
    };

    for (const [cat, list] of Object.entries(CATEGORY_INITIALS)) {
      const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM `system_lists` WHERE `category` = ?', [cat]);
      if (existing[0].cnt === 0) {
        for (const item of list) {
          await pool.query(
            'INSERT INTO `system_lists` (`category`, `name_en`, `name_ar`, `code`, `secondary`, `status`, `notes`) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [cat, item.nameEn, item.nameAr, item.code, item.secondary, item.status, item.notes]
          );
        }
      }
    }

    // Table 2: team_members
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`team_members\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT DEFAULT NULL,
        \`name_en\` VARCHAR(150) NOT NULL,
        \`name_ar\` VARCHAR(150) DEFAULT NULL,
        \`email\` VARCHAR(150) NOT NULL UNIQUE,
        \`phone\` VARCHAR(50) DEFAULT NULL,
        \`employee_id\` VARCHAR(50) DEFAULT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'Staff',
        \`branch\` VARCHAR(100) DEFAULT NULL,
        \`department\` VARCHAR(100) DEFAULT NULL,
        \`job_title\` VARCHAR(100) DEFAULT NULL,
        \`status\` ENUM('Active', 'Inactive') DEFAULT 'Active',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_team_email\` (\`email\`),
        INDEX \`idx_team_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure newly added columns exist if table was previously created
    const [cols] = await pool.query(`SHOW COLUMNS FROM \`team_members\``);
    const colNames = cols.map((c) => c.Field);
    if (!colNames.includes('employee_id')) {
      await pool.query(`ALTER TABLE \`team_members\` ADD COLUMN \`employee_id\` VARCHAR(50) DEFAULT NULL AFTER \`phone\``);
    }
    if (!colNames.includes('branch')) {
      await pool.query(`ALTER TABLE \`team_members\` ADD COLUMN \`branch\` VARCHAR(100) DEFAULT NULL AFTER \`role\``);
    }
    if (!colNames.includes('job_title')) {
      await pool.query(`ALTER TABLE \`team_members\` ADD COLUMN \`job_title\` VARCHAR(100) DEFAULT NULL AFTER \`department\``);
    }

    // Auto-seed default team members if not exist
    try {
      const [dimasTeam] = await pool.query("SELECT id FROM `team_members` WHERE `email` = 'alvarizkidimas@gmail.com' LIMIT 1");
      if (dimasTeam.length === 0) {
        await pool.query(
          `INSERT INTO \`team_members\` (\`name_en\`, \`name_ar\`, \`email\`, \`phone\`, \`employee_id\`, \`role\`, \`branch\`, \`department\`, \`job_title\`, \`status\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'Dimas Alvarizki',
            'ديماس ألفاريزكي',
            'alvarizkidimas@gmail.com',
            '+62 812 3456 7890',
            'EMP-0001',
            'Super Admin',
            'Jeddah Main Office',
            'Operations Management',
            'Super Admin & Lead Director',
            'Active'
          ]
        );
      }

      const [aliTeam] = await pool.query("SELECT id FROM `team_members` WHERE `email` = 'ali@odst.id' LIMIT 1");
      if (aliTeam.length === 0) {
        await pool.query(
          `INSERT INTO \`team_members\` (\`name_en\`, \`name_ar\`, \`email\`, \`phone\`, \`employee_id\`, \`role\`, \`branch\`, \`department\`, \`job_title\`, \`status\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'Ali',
            'علي',
            'ali@odst.id',
            '+966 50 123 4567',
            'EMP-0002',
            'Super Admin',
            'Makkah Branch',
            'Operations Management',
            'Super Admin & Operations Director',
            'Active'
          ]
        );
      }

      // Auto-sync any existing team_members to users table if missing
      try {
        const bcrypt = require('bcryptjs');
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Ensure users table role column supports custom roles (Super Admin, Staff, Viewer)
        try {
          await pool.query("ALTER TABLE `users` MODIFY COLUMN `role` VARCHAR(50) DEFAULT 'admin'");
        } catch {}

        const [allTeam] = await pool.query('SELECT * FROM `team_members`');
        for (const tm of allTeam) {
          if (!tm.email) continue;
          const cleanEmail = tm.email.toLowerCase().trim();
          const [userCheck] = await pool.query('SELECT id FROM `users` WHERE `email` = ? LIMIT 1', [cleanEmail]);
          const userStatus = (tm.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive';
          const displayName = (tm.name_en || tm.name_ar || cleanEmail).trim();

          if (userCheck.length === 0) {
            const [insUser] = await pool.query(
              `INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`, \`role\`, \`phone\`, \`employee_id\`, \`branch\`, \`department\`, \`job_title\`, \`status\`)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                displayName,
                cleanEmail,
                hashedPassword,
                tm.role || 'Staff',
                tm.phone || null,
                tm.employee_id || null,
                tm.branch || null,
                tm.department || null,
                tm.job_title || null,
                userStatus
              ]
            );
            await pool.query('UPDATE `team_members` SET `user_id` = ? WHERE `id` = ?', [insUser.insertId, tm.id]);
          } else {
            if (!tm.user_id) {
              await pool.query('UPDATE `team_members` SET `user_id` = ? WHERE `id` = ?', [userCheck[0].id, tm.id]);
            }
          }
        }
      } catch (syncErr) {
        console.warn('Team to Users startup sync note:', syncErr.message);
      }
    } catch (teamSeedErr) {
      console.warn('Team seeding note:', teamSeedErr.message);
    }

    // Table 3: notification_settings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`notification_settings\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL UNIQUE,
        \`settings\` JSON NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_notif_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table 4: notifications (Operational Feed)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`notifications\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title_en\` VARCHAR(255) NOT NULL,
        \`title_ar\` VARCHAR(255) NOT NULL,
        \`desc_en\` TEXT,
        \`desc_ar\` TEXT,
        \`type\` VARCHAR(50) DEFAULT 'system',
        \`reference_id\` VARCHAR(100) DEFAULT NULL,
        \`reference_link\` VARCHAR(255) DEFAULT NULL,
        \`is_read\` TINYINT(1) DEFAULT 0,
        \`user_id\` INT DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_notif_created_at\` (\`created_at\`),
        INDEX \`idx_notif_is_read\` (\`is_read\`),
        INDEX \`idx_notif_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Complete Auto-migrate for notifications table
    try {
      const [notifCols] = await pool.query(`SHOW COLUMNS FROM \`notifications\``);
      const notifColNames = notifCols.map((c) => c.Field);

      if (!notifColNames.includes('title_en')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`title_en\` VARCHAR(255) NOT NULL DEFAULT 'Notification' AFTER \`id\``);
      }
      if (!notifColNames.includes('title_ar')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`title_ar\` VARCHAR(255) NOT NULL DEFAULT 'إشعار' AFTER \`title_en\``);
      }
      if (!notifColNames.includes('desc_en')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`desc_en\` TEXT DEFAULT NULL AFTER \`title_ar\``);
      }
      if (!notifColNames.includes('desc_ar')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`desc_ar\` TEXT DEFAULT NULL AFTER \`desc_en\``);
      }
      if (!notifColNames.includes('type')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`type\` VARCHAR(50) DEFAULT 'system' AFTER \`desc_ar\``);
      }
      if (!notifColNames.includes('reference_id')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`reference_id\` VARCHAR(100) DEFAULT NULL AFTER \`type\``);
      }
      if (!notifColNames.includes('reference_link')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`reference_link\` VARCHAR(255) DEFAULT NULL AFTER \`reference_id\``);
      }
      if (!notifColNames.includes('is_read')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`is_read\` TINYINT(1) DEFAULT 0 AFTER \`reference_link\``);
      }
      if (!notifColNames.includes('user_id')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`user_id\` INT DEFAULT NULL AFTER \`is_read\``);
      }
      if (!notifColNames.includes('created_at')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      }
      if (!notifColNames.includes('updated_at')) {
        await pool.query(`ALTER TABLE \`notifications\` ADD COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
      }
    } catch (migErr) {
      console.warn('Notifications migration check note:', migErr.message);
    }

    console.log('✅ Settings Service database and tables verified successfully.');
  } catch (error) {
    console.error('❌ Settings Service DB error:', error.message);
  }
}

module.exports = {
  pool,
  initDb,
};
