# Panduan Setup Backend SAPA UMKM

## Langkah-langkah Setup

### 1. Install Dependencies

Masuk ke folder `backend` dan install dependencies:

```bash
cd backend
npm install
```

### 2. Setup Database MySQL

1. Pastikan MySQL sudah terinstall dan berjalan
2. Buat database baru:
```sql
CREATE DATABASE sapa_umkm;
```

3. Import schema database:

**Untuk Windows PowerShell:**
```powershell
Get-Content database/schema.sql | mysql -u root -p sapa_umkm
```

**Untuk Windows CMD:**
```cmd
mysql -u root -p sapa_umkm < database/schema.sql
```

**Atau gunakan MySQL client GUI:**
- Buka phpMyAdmin, MySQL Workbench, atau HeidiSQL
- Pilih database `sapa_umkm`
- Buka dan jalankan file `database/schema.sql`

### 3. Konfigurasi Environment

1. Copy file `env.example` menjadi `.env`:
```bash
cp env.example .env
```

2. Edit file `.env` dan sesuaikan dengan konfigurasi MySQL Anda:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sapa_umkm
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### 4. Jalankan Server

Development mode (dengan auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### 5. Test API

Anda bisa test API menggunakan:
- Postman
- curl
- Browser (untuk GET request)

Contoh test registrasi dengan curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
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
  }'
```

## Troubleshooting

### Error: "Database connection failed"
- Pastikan MySQL service berjalan
- Cek username dan password di file `.env`
- Pastikan database `sapa_umkm` sudah dibuat

### Error: "Table 'users' doesn't exist"
- Pastikan sudah menjalankan file `database/schema.sql`
- Cek apakah tabel `users` ada di database `sapa_umkm`

### Error: "Port 3000 already in use"
- Ubah PORT di file `.env` ke port lain (misalnya 3001)
- Atau hentikan aplikasi lain yang menggunakan port 3000

## Catatan

- Pastikan backend berjalan sebelum menggunakan aplikasi mobile
- Untuk development, gunakan IP address komputer Anda (bukan localhost) jika testing dari device/emulator
- Contoh: `http://192.168.1.100:3000/api` (ganti dengan IP komputer Anda)

