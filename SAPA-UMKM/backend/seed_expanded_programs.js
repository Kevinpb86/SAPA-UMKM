const pool = require('./config/database').pool;

async function seedExpandedPrograms() {
    console.log('Seeding expanded programs data...');
    try {
        // Assume user ID 2 is a regular user (check users table if needed)
        // From previous session, we know user 2 is 'kevin@gmail.com'
        const userId = 2;

        // 1. NIB
        console.log('Seeding NIB...');
        await pool.execute(
            `INSERT INTO nib_submissions (user_id, owner_nik, owner_name, owner_email, owner_phone, owner_address, business_name, business_form, business_address, business_sector, business_capital, status) 
             VALUES (?, '1234567890123456', 'Kevin Pratama', 'kevin@gmail.com', '08123456789', 'Jl. Merdeka No. 10', 'Warung Maju Jaya', 'Perorangan', 'Jl. Merdeka No. 10', 'Kuliner dan Makanan', 'Mikro (< Rp 1 Miliar)', 'pending')`,
            [userId]
        );

        // 2. Merek
        console.log('Seeding Merek...');
        await pool.execute(
            `INSERT INTO merek_submissions (user_id, owner_name, contact_email, contact_phone, business_entity, brand_name, brand_summary, product_photo, logo_reference, docs_id_owner, status) 
             VALUES (?, 'Kevin Pratama', 'kevin@gmail.com', '08123456789', 'Perorangan', 'Maju Food', 'Produk sambal kemasan rumahan', 'https://example.com/photo.jpg', 'https://example.com/logo.png', 'https://example.com/ktp.jpg', 'approved')`,
            [userId]
        );

        // 3. Halal
        console.log('Seeding Halal...');
        await pool.execute(
            `INSERT INTO halal_submissions (user_id, certificate_number, holder_name, product_name, issued_by, notes, status) 
             VALUES (?, 'ID1234567890', 'Warung Maju Jaya', 'Sambal Goreng Teri', 'BPJPH', 'Berlaku hingga 2028', 'pending')`,
            [userId]
        );

        // 4. BPOM
        console.log('Seeding BPOM...');
        await pool.execute(
            `INSERT INTO bpom_submissions (user_id, registration_number, product_name, producer_name, product_type, notes, status) 
             VALUES (?, 'MD 123456789012', 'Sambal Goreng Teri', 'Warung Maju Jaya', 'Pangan Olahan', 'Dalam proses audit', 'pending')`,
            [userId]
        );

        // 5. SNI
        console.log('Seeding SNI...');
        await pool.execute(
            `INSERT INTO sni_submissions (user_id, certificate_number, company_name, product_scope, certification_body, notes, status) 
             VALUES (?, '12345/SNI/2024', 'Warung Maju Jaya', 'Makanan Dalam Kemasan', 'LSPro-001', 'Tahap akhir verifikasi', 'pending')`,
            [userId]
        );

        // 6. Lainnya
        console.log('Seeding Lainnya...');
        await pool.execute(
            `INSERT INTO lainnya_submissions (user_id, standard_type, certificate_number, holder_name, product_or_process, issuing_body, notes, status) 
             VALUES (?, 'ISO 22000', 'ISO-12345', 'Warung Maju Jaya', 'Manajemen Keamanan Pangan', 'SGS', 'Audit tahunan', 'pending')`,
            [userId]
        );

        console.log('✅ Expanded programs seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        process.exit();
    }
}

seedExpandedPrograms();
