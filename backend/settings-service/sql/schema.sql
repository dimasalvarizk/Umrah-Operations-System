-- Umrah Operations System - Settings & System Lists Schema
-- Database: umrah_db

USE `umrah_db`;

-- 1. System Master Lists Table
CREATE TABLE IF NOT EXISTS `system_lists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` ENUM('agents', 'airlines', 'countries', 'branches', 'transport', 'packages') NOT NULL,
  `name_en` VARCHAR(200) NOT NULL,
  `name_ar` VARCHAR(200) NOT NULL,
  `code` VARCHAR(50) DEFAULT NULL,
  `secondary` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_system_lists_category` (`category`),
  INDEX `idx_system_lists_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `name_ar` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `role` VARCHAR(50) NOT NULL DEFAULT 'operator',
  `department` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_team_email` (`email`),
  INDEX `idx_team_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
