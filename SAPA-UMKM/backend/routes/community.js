const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM community_posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    const { user_id, author_name, content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        // For simplicity, we assume user_id 1 if not provided, or extract from token in a real middleware
        const uid = user_id || 1;
        const author = author_name || 'Pengguna UMKM';

        await pool.query(
            'INSERT INTO community_posts (user_id, author_name, content) VALUES (?, ?, ?)',
            [uid, author, content]
        );
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating post' });
    }
});

module.exports = router;
