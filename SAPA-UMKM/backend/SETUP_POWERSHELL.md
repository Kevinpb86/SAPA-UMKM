# Panduan Setup Backend untuk Windows PowerShell

## Import Database Schema di PowerShell

Karena PowerShell tidak mendukung operator `<` untuk redirect input, gunakan salah satu cara berikut:

### Cara 1: Menggunakan Get-Content (Recommended)

```powershell
# Masuk ke folder backend
cd backend

# Import schema
Get-Content database/schema.sql | mysql -u root -p sapa_umkm
```

Anda akan diminta memasukkan password MySQL.

### Cara 2: Menggunakan CMD

Buka Command Prompt (CMD) dan jalankan:

```cmd
cd backend
mysql -u root -p sapa_umkm < database/schema.sql
```

### Cara 3: Menggunakan MySQL Client GUI (Paling Mudah)

1. Buka **phpMyAdmin** (jika menggunakan XAMPP/WAMP)
   - Buka browser: `http://localhost/phpmyadmin`
   - Pilih database `sapa_umkm` di sidebar kiri
   - Klik tab "SQL"
   - Copy semua isi file `database/schema.sql`
   - Paste ke textarea SQL
   - Klik "Go" atau tekan Ctrl+Enter

2. Atau gunakan **MySQL Workbench**:
   - Buka MySQL Workbench
   - Connect ke database
   - Pilih database `sapa_umkm`
   - File → Open SQL Script → Pilih `database/schema.sql`
   - Klik tombol Execute (⚡)

3. Atau gunakan **HeidiSQL**:
   - Buka HeidiSQL
   - Connect ke MySQL
   - Pilih database `sapa_umkm`
   - Query → Load SQL file → Pilih `database/schema.sql`
   - Klik Execute (F9)

## Langkah-langkah Lengkap Setup

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Setup Database MySQL

**Langkah 1: Buat Database**
```sql
CREATE DATABASE sapa_umkm;
```
Jalankan di MySQL client atau:
```powershell
mysql -u root -p -e "CREATE DATABASE sapa_umkm;"
```

**Langkah 2: Import Schema**
Pilih salah satu cara di atas (Cara 1, 2, atau 3)

### 3. Konfigurasi Environment

```powershell
# Copy file contoh
Copy-Item env.example .env

# Edit file .env dengan notepad atau editor favorit Anda
notepad .env
```

Edit konfigurasi:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=isi_password_mysql_anda
DB_NAME=sapa_umkm
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### 4. Jalankan Server

```powershell
# Development mode
npm run dev

# Atau production mode
npm start
```

## Troubleshooting

### Error: "mysql: command not found"
- Pastikan MySQL sudah terinstall dan ditambahkan ke PATH
- Atau gunakan full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
- Atau gunakan MySQL client GUI (phpMyAdmin, MySQL Workbench)

### Error: "Access denied for user"
- Cek username dan password di file `.env`
- Pastikan user MySQL memiliki akses ke database

### Error: "Database 'sapa_umkm' doesn't exist"
- Buat database terlebih dahulu: `CREATE DATABASE sapa_umkm;`

