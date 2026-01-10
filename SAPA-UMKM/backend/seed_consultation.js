const pool = require('./config/database').pool;

async function seedConsultation() {
    console.log('Seeding consultation data...');
    try {
        const userId = 2; // pelakuumkm@gmail.com

        await pool.execute(
            `INSERT INTO consultation_submissions 
             (user_id, full_name, email, phone, business_name, business_field, employee_count, interested_modules, preferred_mode, special_notes, status) 
             VALUES (?, 'Siti Nurhaliza', 'siti@umkm.id', '081234567890', 'Warung Siti Barokah', 'Kuliner & F&B', '1-5 orang', ?, 'Tatap Muka', 'Ingin meningkatkan penjualan melalui media sosial', 'pending')`,
            [userId, JSON.stringify(['digital-marketing', 'financial-management'])]
        );

        console.log('✅ Consultation data seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        process.exit();
    }
}

seedConsultation();
