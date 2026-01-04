# Integrasi Backend dengan Frontend SAPA UMKM

## Ringkasan

Backend Express.js dengan MySQL telah dibuat dan terintegrasi dengan aplikasi SAPA UMKM. Ketika user melakukan registrasi di aplikasi, data akan tersimpan ke database MySQL.

## Struktur Backend

```
backend/
├── config/
│   └── database.js          # Konfigurasi koneksi MySQL
├── routes/
│   └── auth.js              # Endpoint untuk registrasi dan login
├── database/
│   └── schema.sql           # Schema database MySQL
├── server.js                # Server Express utama
├── package.json             # Dependencies backend
├── env.example              # Template konfigurasi environment
├── README.md                # Dokumentasi API
└── SETUP.md                 # Panduan setup lengkap
```

## Perubahan pada Frontend

1. **File baru: `lib/api.ts`**
   - Service untuk memanggil API backend
   - Fungsi `registerUser()` dan `loginUser()`

2. **Update: `components/auth-provider.tsx`**
   - Fungsi `register()` sekarang memanggil API backend
   - Data registrasi dikirim ke server Express

## Cara Menggunakan

### 1. Setup Backend

Ikuti panduan di `backend/SETUP.md` untuk:
- Install dependencies
- Setup database MySQL
- Konfigurasi environment
- Jalankan server

### 2. Konfigurasi API URL

Untuk development, API URL default adalah `http://localhost:3000/api`.

**Jika testing dari device/emulator:**
- Gunakan IP address komputer Anda, bukan `localhost`
- Contoh: `http://192.168.1.100:3000/api`
- Set environment variable `EXPO_PUBLIC_API_URL` di file `.env` di root project

**Membuat file `.env` di root project:**
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

Atau untuk localhost (web/development):
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Test Registrasi

1. Pastikan backend server berjalan (`npm start` di folder `backend`)
2. Buka aplikasi mobile
3. Klik tombol "Daftar"
4. Isi form registrasi
5. Submit form
6. Data akan tersimpan di database MySQL

## Endpoint API

### POST /api/auth/register
Registrasi user baru.

**Request:**
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

**Response Success:**
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

## Database Schema

Tabel `users` menyimpan:
- Informasi autentikasi (email, password)
- Data pemilik (NIK, nama, alamat, NPWP)
- Data usaha (nama usaha, alamat, KBLI, sektor, skala, modal)
- Timestamps (created_at, updated_at)

## Catatan Penting

1. **Password di-hash** menggunakan bcryptjs sebelum disimpan
2. **Email dinormalisasi** menjadi lowercase
3. **Email admin** (`adminumkm@gmail.com`) tidak bisa digunakan untuk registrasi
4. **CORS enabled** untuk mengizinkan request dari frontend
5. **Validasi input** dilakukan di backend untuk keamanan

## Troubleshooting

### Error: "Network request failed"
- Pastikan backend server berjalan
- Cek API URL di `lib/api.ts` atau environment variable
- Untuk device/emulator, gunakan IP address bukan localhost

### Error: "Email sudah terdaftar"
- Email tersebut sudah ada di database
- Gunakan email lain atau hapus data dari database

### Error: "Database connection failed"
- Pastikan MySQL service berjalan
- Cek konfigurasi di `backend/.env`
- Pastikan database `sapa_umkm` sudah dibuat

## Next Steps (Opsional)

1. Implementasi JWT untuk autentikasi
2. Upload dokumen (e-KTP, SKD) ke server
3. Validasi email dengan OTP
4. Reset password
5. Update profil user

