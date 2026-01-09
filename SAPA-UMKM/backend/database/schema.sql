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

-- Tabel submissions (generik/legacy support)
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pendaftaran Program KUR
CREATE TABLE IF NOT EXISTS kur_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_sector VARCHAR(255) NOT NULL,
    business_duration VARCHAR(100),
    monthly_revenue VARCHAR(100),
    loan_amount VARCHAR(100) NOT NULL,
    loan_purpose TEXT NOT NULL,
    tenor VARCHAR(50),
    collateral TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pendaftaran Program UMi
CREATE TABLE IF NOT EXISTS umi_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    business_address TEXT,
    monthly_revenue VARCHAR(100),
    funding_need VARCHAR(100) NOT NULL,
    fund_usage TEXT NOT NULL,
    repayment_plan TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pendaftaran Program LPDB
CREATE TABLE IF NOT EXISTS lpdb_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    legal_entity VARCHAR(100) NOT NULL,
    established_since VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    business_focus TEXT NOT NULL,
    requested_fund VARCHAR(100) NOT NULL,
    fund_usage_plan TEXT NOT NULL,
    collateral_summary TEXT,
    financial_statement_link VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Program Inkubasi/Bimbingan
CREATE TABLE IF NOT EXISTS inkubasi_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    founder_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_stage VARCHAR(100),
    focus_area VARCHAR(255) NOT NULL,
    program_goal TEXT NOT NULL,
    support_needed TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pengajuan NIB
CREATE TABLE IF NOT EXISTS nib_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255),
    owner_phone VARCHAR(20),
    owner_address TEXT,
    business_name VARCHAR(255) NOT NULL,
    business_form VARCHAR(100),
    business_address TEXT,
    business_sector VARCHAR(255),
    business_capital VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pendaftaran Merek
CREATE TABLE IF NOT EXISTS merek_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    business_entity VARCHAR(100),
    brand_name VARCHAR(255) NOT NULL,
    brand_summary TEXT,
    product_photo VARCHAR(500),
    logo_reference VARCHAR(500),
    docs_id_owner VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Sertifikasi Halal
CREATE TABLE IF NOT EXISTS halal_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    issued_by VARCHAR(255),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Registrasi BPOM
CREATE TABLE IF NOT EXISTS bpom_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    producer_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(255),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Sertifikat SNI
CREATE TABLE IF NOT EXISTS sni_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    product_scope VARCHAR(255) NOT NULL,
    certification_body VARCHAR(255),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Standar Khusus Lainnya
CREATE TABLE IF NOT EXISTS lainnya_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    standard_type VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    product_or_process VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(255),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pelaporan Kegiatan Usaha
CREATE TABLE IF NOT EXISTS laporan_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    period VARCHAR(50) NOT NULL,
    revenue VARCHAR(100) NOT NULL,
    expenses VARCHAR(100),
    key_activities TEXT NOT NULL,
    achievements TEXT,
    challenges TEXT,
    support_requested TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pelatihan Anggota Komunitas
CREATE TABLE IF NOT EXISTS pelatihan_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    training_interest VARCHAR(255) NOT NULL,
    reason TEXT,
    expectations TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Postingan Komunitas (Forum)
CREATE TABLE IF NOT EXISTS forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    status ENUM('open', 'closed', 'pinned') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin account default
INSERT INTO users (email, password, role, display_name) 
VALUES ('adminumkm@gmail.com', 'Admin123', 'admin', 'Administrator SAPA UMKM')
ON DUPLICATE KEY UPDATE email=email;

