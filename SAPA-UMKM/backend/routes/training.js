const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token tidak valid' });
        }
        req.user = user;
        next();
    });
};

// GET Approved Training Certificates
router.get('/certificates', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.execute(
            'SELECT * FROM pelatihan_submissions WHERE user_id = ? AND status = "approved" ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data sertifikat' });
    }
});

module.exports = router;
