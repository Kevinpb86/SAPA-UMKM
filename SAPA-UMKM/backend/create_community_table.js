const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function createTable() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS community_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                author_name VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                likes INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await connection.execute(createTableQuery);
        console.log('Table "community_posts" created or already exists.');

        // Seed some dummy data if empty
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM community_posts');
        if (rows[0].count === 0) {
            const dummyPosts = [
                ['Budi Santoso', 'Bagaimana cara mengajukan NIB secara online? Apakah ada yang punya panduan terbaru?', 5, 2, true],
                ['Siti Aminah', 'Alhamdulillah, KUR saya dari Bank BRI sudah cair hari ini! Semangat buat teman-teman UMKM.', 12, 4, true],
                ['Rudi Hartono', 'Sedang mencari supplier kemasan ramah lingkungan untuk produk keripik saya. Ada rekomendasi?', 3, 8, false],
                ['Dewi Lestari', 'Info pelatihan digital marketing bulan depan sangat bermanfaat. Jangan lupa daftar ya!', 8, 1, true]
            ];

            for (const post of dummyPosts) {
                // Assuming user_id 1 exists (admin/test user), otherwise use a valid ID or nullable
                // We'll use ID 1 for seeding simplicity, assuming at least one user exists
                await connection.execute(
                    'INSERT INTO community_posts (user_id, author_name, content, likes, comments_count, is_verified) VALUES (1, ?, ?, ?, ?, ?)',
                    post
                );
            }
            console.log('Dummy data seeded.');
        }

        await connection.end();
        console.log('Database verification complete.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createTable();
