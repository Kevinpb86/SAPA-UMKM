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
        await pool.execute(
            `INSERT INTO forum_posts (user_id, title, content, tags) 
             VALUES (?, 'Cara Daftar NIB untuk Usaha Rumahan', 'Halo rekan-rekan, ada yang punya pengalaman daftar NIB lewat OSS RBA untuk kuliner rumahan?', ?)`,
            [userId, JSON.stringify(['Legalitas', 'Operasional'])]
        );

        console.log('✅ Community data seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        process.exit();
    }
}

seedCommunity();
