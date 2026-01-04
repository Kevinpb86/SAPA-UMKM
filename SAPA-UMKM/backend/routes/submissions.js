const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const jwt = require('jsonwebtoken');

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

// CREATE Submission
router.post('/', verifyToken, async (req, res) => {
    try {
        const { type, data } = req.body;
        const userId = req.user.id;

        const [result] = await pool.execute(
            'INSERT INTO submissions (user_id, type, data, status) VALUES (?, ?, ?, ?)',
            [userId, type, JSON.stringify(data), 'pending']
        );

        res.json({
            success: true,
            message: 'Pengajuan berhasil dikirim',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create submission error:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat pengajuan' });
    }
});

// GET Submissions (Admin gets all, User gets own)
router.get('/', verifyToken, async (req, res) => {
    try {
        let query = `
            SELECT s.*, u.email, u.display_name, u.role
            FROM submissions s
            JOIN users u ON s.user_id = u.id
        `;
        let params = [];

        if (req.user.role !== 'admin') {
            query += ' WHERE s.user_id = ?';
            params.push(req.user.id);
        }

        query += ' ORDER BY s.created_at DESC';

        const [rows] = await pool.execute(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengajuan' });
    }
});

// UPDATE Status (Admin Only)
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status tidak valid' });
        }

        await pool.execute(
            'UPDATE submissions SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ success: true, message: 'Status pengajuan berhasil diupdate' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Gagal update status' });
    }
});

// GET Single Submission
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        let query = `
            SELECT s.*, u.email, u.display_name, u.role
            FROM submissions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan' });
        }

        const submission = rows[0];

        // Security check: users can only see their own submissions
        if (req.user.role !== 'admin' && submission.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengajuan' });
    }
});

module.exports = router;
