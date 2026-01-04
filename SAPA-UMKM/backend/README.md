# SAPA UMKM Backend API

Backend API untuk aplikasi SAPA UMKM menggunakan Express.js dan MySQL.

## Persyaratan

- Node.js (v14 atau lebih baru)
- MySQL (v5.7 atau lebih baru)
- npm atau yarn

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

3. Edit file `.env` dan sesuaikan konfigurasi database:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sapa_umkm
DB_PORT=3306
PORT=3000
```

4. Buat database MySQL:
```sql
CREATE DATABASE sapa_umkm;
```

5. Import schema database:
```bash
mysql -u root -p sapa_umkm < database/schema.sql
```

Atau jalankan file `database/schema.sql` di MySQL client Anda.

## Menjalankan Server

### Development mode (dengan nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### POST /api/auth/register
Registrasi user baru.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "ownerName": "Nama Pemilik",
  "nik": "1234567890123456",
  "businessName": "Nama Usaha",
  "profile": {
    "ownerAddress": "Alamat Pemilik",
    "businessAddress": "Alamat Usaha",
    "kbli": "10792 - Perdagangan kebutuhan pokok",
    "sector": "Makanan & Minuman",
    "scale": "Mikro",
    "capital": "10000000",
    "npwp": "123456789012345"
  }
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "Nama Pemilik"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    ...
  }
}
```

## Struktur Database

Tabel `users` menyimpan data registrasi dengan kolom:
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- role (ENUM: 'user', 'admin')
- display_name, nik, owner_name, npwp, owner_address
- business_name, business_address, kbli, sector, scale, capital
- id_card_path, domicile_letter_path (untuk dokumen)
- created_at, updated_at (TIMESTAMP)

## Catatan

- Password disimpan dalam bentuk hash menggunakan bcryptjs
- Email dinormalisasi menjadi lowercase
- Email admin (adminumkm@gmail.com) tidak bisa digunakan untuk registrasi
- Semua endpoint menggunakan CORS untuk mengizinkan request dari frontend

