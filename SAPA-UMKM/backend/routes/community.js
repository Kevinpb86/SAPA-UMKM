const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
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

// Get all posts
router.get('/', async (req, res) => {
    try {
        const userId = req.query.user_id;
        const [posts] = await pool.query(`
            SELECT p.*, u.display_name as author_name,
                   (SELECT COUNT(*) FROM forum_comments WHERE post_id = p.id) as comments_count,
                   (SELECT COUNT(*) FROM forum_likes WHERE post_id = p.id) as likes,
                   ${userId ? `(SELECT COUNT(*) FROM forum_likes WHERE post_id = p.id AND user_id = ${pool.escape(userId)}) > 0` : '0'} as is_liked
            FROM forum_posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
});

// Like/Unlike a post
router.post('/:postId/like', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const [existing] = await pool.query('SELECT * FROM forum_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        if (existing.length > 0) {
            await pool.query('DELETE FROM forum_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            res.json({ success: true, liked: false });
        } else {
            await pool.query('INSERT INTO forum_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            res.json({ success: true, liked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling like' });
    }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const userId = req.query.user_id;
    try {
        const [comments] = await pool.query(`
            SELECT c.*, u.display_name as author_name,
                   (SELECT COUNT(*) FROM forum_comment_likes WHERE comment_id = c.id) as likes,
                   ${userId ? `(SELECT COUNT(*) FROM forum_comment_likes WHERE comment_id = c.id AND user_id = ${pool.escape(userId)}) > 0` : '0'} as is_liked
            FROM forum_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `, [postId]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching comments' });
    }
});

// Add a comment/reply
router.post('/:postId/comments', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { content, parent_comment_id } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: 'Content is required' });

    try {
        await pool.query(
            'INSERT INTO forum_comments (post_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
            [postId, userId, content, parent_comment_id || null]
        );
        res.status(201).json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding comment' });
    }
});

// Like/Unlike a comment
router.post('/comments/:commentId/like', verifyToken, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
        const [existing] = await pool.query('SELECT * FROM forum_comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
        if (existing.length > 0) {
            await pool.query('DELETE FROM forum_comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
            res.json({ success: true, liked: false });
        } else {
            await pool.query('INSERT INTO forum_comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
            res.json({ success: true, liked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling comment like' });
    }
});

module.exports = router;
