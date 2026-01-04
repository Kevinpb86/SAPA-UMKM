const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Endpoint untuk registrasi
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      email,
      password,
      ownerName,
      nik,
      businessName,
      profile = {}
    } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Validasi email format
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Cek apakah email adalah email admin
    if (normalizedEmail === 'adminumkm@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'EMAIL_RESERVED_FOR_ADMIN'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user baru
    const [result] = await connection.execute(
      `INSERT INTO users (
        email, 
        password, 
        role, 
        display_name, 
        nik, 
        owner_name, 
        npwp, 
        owner_address, 
        business_name, 
        business_address, 
        kbli, 
        sector, 
        scale, 
        capital
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedEmail,
        hashedPassword,
        'user',
        ownerName || businessName || normalizedEmail,
        nik || null,
        ownerName || null,
        profile.npwp || null,
        profile.ownerAddress || null,
        businessName || null,
        profile.businessAddress || null,
        profile.kbli || null,
        profile.sector || null,
        profile.scale || null,
        profile.capital || null
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        id: result.insertId,
        email: normalizedEmail,
        displayName: ownerName || businessName || normalizedEmail
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data. Coba lagi.'
    });
  } finally {
    connection.release();
  }
});

// Endpoint untuk login (opsional, untuk masa depan)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cari user berdasarkan email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const user = users[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Hapus password dari response
    delete user.password;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login. Coba lagi.'
    });
  }
});

// Endpoint untuk mendapatkan daftar user (Khusus Admin)
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, role, display_name, nik, owner_name, business_name, sector, scale, kbli FROM users WHERE role = "user"'
    );

    // Map database snake_case to frontend camelCase if needed, or handle in frontend
    // For now returning as is, frontend auth-provider will likely need adjustment or we map here.
    // Let's map here to match StoredAccount structure partially.

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user'
    });
  }
});

// Endpoint untuk update user
router.put('/users/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { email, password, displayName, profile } = req.body;

    // Build update query dynamically
    let query = 'UPDATE users SET email = ?, display_name = ?';
    const params = [email, displayName];

    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    if (profile) {
      // Add profile fields updates here if needed, for simplicity we update core fields first
      // If profile fields are simple columns:
      if (profile.ownerName) { query += ', owner_name = ?'; params.push(profile.ownerName); }
      if (profile.businessName) { query += ', business_name = ?'; params.push(profile.businessName); }
      if (profile.nik) { query += ', nik = ?'; params.push(profile.nik); }
      if (profile.sector) { query += ', sector = ?'; params.push(profile.sector); }
      if (profile.scale) { query += ', scale = ?'; params.push(profile.scale); }
      if (profile.kbli) { query += ', kbli = ?'; params.push(profile.kbli); }
    }

    query += ' WHERE id = ?';
    params.push(id);

    await connection.execute(query, params);

    // Fetch updated user
    const [updatedUsers] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);

    await connection.commit();

    if (updatedUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const user = updatedUsers[0];
    delete user.password;

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: user
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update user'
    });
  } finally {
    connection.release();
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'Tidak ada token' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak valid' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
};

// Endpoint untuk update profile (Self Service)
router.put('/profile', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { displayName, profile } = req.body;

    // Validasi input minimal
    if (!displayName) {
      return res.status(400).json({ success: false, message: 'Nama tampilan wajib diisi' });
    }

    let query = 'UPDATE users SET display_name = ?';
    const params = [displayName];

    if (profile) {
      if (profile.ownerName) { query += ', owner_name = ?'; params.push(profile.ownerName); }
      if (profile.businessName) { query += ', business_name = ?'; params.push(profile.businessName); }
      if (profile.nik) { query += ', nik = ?'; params.push(profile.nik); }
      if (profile.sector) { query += ', sector = ?'; params.push(profile.sector); }
      if (profile.scale) { query += ', scale = ?'; params.push(profile.scale); }
      if (profile.kbli) { query += ', kbli = ?'; params.push(profile.kbli); }
      if (profile.ownerAddress) { query += ', owner_address = ?'; params.push(profile.ownerAddress); }
      if (profile.businessAddress) { query += ', business_address = ?'; params.push(profile.businessAddress); }
      if (profile.phone) { query += ', phone = ?'; params.push(profile.phone); }
      if (profile.capital) { query += ', capital = ?'; params.push(profile.capital); }
      if (profile.employees) { query += ', employees = ?'; params.push(profile.employees); }
      if (profile.businessDescription) { query += ', business_description = ?'; params.push(profile.businessDescription); }
      if (profile.supportNeeds) { query += ', support_needs = ?'; params.push(profile.supportNeeds); }
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await connection.execute(query, params);

    // Fetch updated user
    const [updatedUsers] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    await connection.commit();

    if (updatedUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const user = updatedUsers[0];
    delete user.password;

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: user
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update profil'
    });
  } finally {
    connection.release();
  }
});

// Endpoint untuk delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus user'
    });
  }
});

module.exports = router;

