const pool = require('./config/database').pool;

async function seedCommunity() {
    console.log('Seeding community data...');
    try {
        const userId = 2; // pelakuumkm@gmail.com

        // Seed Pelatihan
        await pool.execute(
            `INSERT INTO pelatihan_submissions (user_id, full_name, email, phone, business_name, training_interest, reason, expectations, status) 
             VALUES (?, 'Budi Santoso', 'budi@umkm.id', '08123456789', 'Kripik Renyah', 'Pemasaran Digital', 'Ingin memperluas jangkauan ke media sosial', 'Bisa membuat iklan Facebook sendiri', 'pending')`,
            [userId]
        );

        // Seed Forum Post
        const [result] = await pool.execute(
            `INSERT INTO forum_posts (user_id, title, content, tags, status) 
             VALUES (?, 'Cara Daftar NIB untuk Usaha Rumahan', 'Halo rekan-rekan, ada yang punya pengalaman daftar NIB lewat OSS RBA untuk kuliner rumahan?', ?, 'pinned')`,
            [userId, JSON.stringify(['Legalitas', 'Operasional'])]
        );
        const postId = result.insertId;

        // Seed Likes for Post
        await pool.execute(
            'INSERT IGNORE INTO forum_likes (post_id, user_id) VALUES (?, ?)',
            [postId, userId]
        );

        // Seed Comments
        const [commentResult] = await pool.execute(
            'INSERT INTO forum_comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, 1, 'Pastikan KBLI yang dipilih sudah sesuai dengan jenis produknya ya.']
        );
        const commentId = commentResult.insertId;

        // Seed Comment Likes
        await pool.execute(
            'INSERT IGNORE INTO forum_comment_likes (comment_id, user_id) VALUES (?, ?)',
            [commentId, userId]
        );

        console.log('✅ Community data (Posts, Likes, Comments) seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        process.exit();
    }
}

seedCommunity();
