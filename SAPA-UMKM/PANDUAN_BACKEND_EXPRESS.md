# Panduan Implementasi Backend (Express + MySQL)

Dokumen ini berisi langkah-langkah detail untuk menjalankan backend text API menggunakan Express.js dan menghubungkannya dengan database MySQL.

## Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
1.  **Node.js**: [Download disini](https://nodejs.org/)
2.  **XAMPP** (untuk MySQL): [Download disini](https://www.apachefriends.org/)
3.  **Visual Studio Code**: Editor kode.

---

## Langkah 1: Persiapan Database

1.  Buka **XAMPP Control Panel** dan klik **Start** pada module **Apache** dan **MySQL**.
2.  Buka browser dan akses `http://localhost/phpmyadmin`.
3.  Klik **Baru (New)** di sidebar kiri untuk membuat database baru.
4.  Beri nama database: `sapa_umkm`
5.  Klik **Buat (Create)**.
6.  Pilih database `sapa_umkm` yang barusan dibuat.
7.  Klik tab **Import** di bagian atas.
8.  Klik **Choose File** dan cari file schema di project Anda:
    `d:\Semester 7\Pengembangan Aplikasi Bergerak\SAPA-UMKM\SAPA-UMKM\backend\database\schema.sql`
9.  Klik tombol **Kiriman (Import/Go)** di bagian bawah halaman.
    *   *Ini akan membuat tabel-tabel yang diperlukan seperti `users`.*

---

## Langkah 2: Konfigurasi Backend

1.  Buka terminal di VS Code (Ctrl + `).
2.  Masuk ke folder backend:
    ```bash
    cd backend
    ```
3.  Salin file konfigurasi lingkungan:
    *   Buat file baru bernama `.env`.
    *   Salin isi dari `env.example` ke dalam `.env`.
    *   Pastikan isinya sesuai dengan konfigurasi XAMPP Anda (defaultnya biasanya user `root` dan password kosong):

    **Isi file `.env`:**
    ```env
    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=sapa_umkm
    DB_PORT=3306

    # Server Configuration
    PORT=3000
    ```

---

## Langkah 3: Install Dependencies

Jika Anda belum menjalankannya, install library yang dibutuhkan:

```bash
npm install
```

---

## Langkah 4: Menjalankan Server

1.  Jalankan server dalam mode development:
    ```bash
    npm run dev
    ```
2.  Anda akan melihat pesan sukses:
    ```
    ✅ Database connected successfully
    🚀 Server running on http://localhost:3000
    ```

---

## Langkah 5: Testing API Register

Anda bisa mengetes fitur registrasi tanpa frontend menggunakan **Postman** atau **Thunder Client** di VS Code.

*   **URL**: `http://localhost:3000/api/auth/register`
*   **Method**: `POST`
*   **Body** (JSON):

```json
{
  "email": "contoh@gmail.com",
  "password": "password123",
  "ownerName": "Budi Santoso",
  "businessName": "Keripik Budi",
  "nik": "1234567890123456"
}
```

Jika berhasil, data akan tersimpan di tabel `users` pada database MySQL.

---

## Langkah 6: Testing API Login

Setelah register, Anda bisa mencoba login untuk mendapatkan token JWT.

*   **URL**: `http://localhost:3000/api/auth/login`
*   **Method**: `POST`
*   **Body** (JSON):

```json
{
  "email": "contoh@gmail.com",
  "password": "password123"
}
```

**Response Sukses:**
Anda akan mendapatkan response berisi data user dan `token`. Token ini nantinya digunakan untuk mengakses endpoint lain yang butuh otentikasi.

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": { ... },
    "token": "eyJhGciO..."
  }
}
```
