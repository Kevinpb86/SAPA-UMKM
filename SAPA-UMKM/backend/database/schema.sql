-- Database Schema untuk SAPA UMKM
-- Buat database terlebih dahulu: CREATE DATABASE sapa_umkm;

USE sapa_umkm;

-- Tabel users untuk menyimpan data registrasi
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  display_name VARCHAR(255),
  nik VARCHAR(16),
  owner_name VARCHAR(255),
  npwp VARCHAR(20),
  owner_address TEXT,
  business_name VARCHAR(255),
  business_address TEXT,
  kbli VARCHAR(50),
  sector VARCHAR(100),
  scale ENUM('Mikro', 'Kecil', 'Menengah'),
  capital VARCHAR(50),
  id_card_path VARCHAR(500),
  domicile_letter_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin account default
INSERT INTO users (email, password, role, display_name) 
VALUES ('adminumkm@gmail.com', 'Admin123', 'admin', 'Administrator SAPA UMKM')
ON DUPLICATE KEY UPDATE email=email;

