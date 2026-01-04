const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('🌱 Seeding Admin Account...');

        const email = 'adminumkm@gmail.com';
        const password = 'Admin123';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Cek apakah admin sudah ada
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('🔄 Admin account already exists. Updating password...');
            await connection.execute(
                'UPDATE users SET password = ?, role = "admin" WHERE email = ?',
                [hashedPassword, email]
            );
        } else {
            console.log('✨ Creating new Admin account...');
            await connection.execute(
                `INSERT INTO users (email, password, role, display_name) 
         VALUES (?, ?, 'admin', 'Administrator SAPA UMKM')`,
                [email, hashedPassword]
            );
        }

        console.log('✅ Admin initialized successfully!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

seedAdmin();
