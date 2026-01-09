const { pool } = require('./config/database');

const seedPrograms = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('🌱 Seeding Program Submissions...');

        // 1. Ambil User ID (prioritas pelakuumkm@gmail.com, default admin)
        const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', ['pelakuumkm@gmail.com']);
        const userId = users.length > 0 ? users[0].id : 1;

        console.log(`Using User ID: ${userId}`);

        // Bersihkan data lama agar bersih
        await connection.execute('DELETE FROM kur_submissions');
        await connection.execute('DELETE FROM umi_submissions');
        await connection.execute('DELETE FROM lpdb_submissions');
        await connection.execute('DELETE FROM inkubasi_submissions');

        // 2. Seed KUR
        console.log('  - Seeding KUR...');
        await connection.execute(`
            INSERT INTO kur_submissions 
            (user_id, owner_name, nik, email, phone, business_name, business_sector, business_duration, monthly_revenue, loan_amount, loan_purpose, tenor, collateral, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, 'Budi Santoso', '3275012345678901', 'budi@kopi.id', '081234567890',
            'Kopi Nusantara', 'Kuliner', '3 Tahun', 'Rp 25.000.000', 'Rp 75.000.000',
            'Pembelian mesin roasting baru dan renovasi kedai', '24 bulan', 'Sertifikat Tanah', 'pending'
        ]);

        // 3. Seed UMi
        console.log('  - Seeding UMi...');
        await connection.execute(`
            INSERT INTO umi_submissions 
            (user_id, owner_name, nik, phone, email, business_name, business_type, business_address, monthly_revenue, funding_need, fund_usage, repayment_plan, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, 'Budi Santoso', '3275012345678901', '081234567890', 'budi@kopi.id',
            'Kopi Nusantara', 'Warung Kopi', 'Jl. Merdeka No. 123, Bandung', 'Rp 8.000.000',
            'Rp 10.000.000', 'Modal stok biji kopi mentah (green beans)', 'Cicilan mingguan dari laba harian', 'pending'
        ]);

        // 4. Seed LPDB
        console.log('  - Seeding LPDB...');
        await connection.execute(`
            INSERT INTO lpdb_submissions 
            (user_id, institution_name, legal_entity, established_since, address, contact_person, phone, email, business_focus, requested_fund, fund_usage_plan, collateral_summary, financial_statement_link, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, 'Koperasi Maju Bersama', 'Koperasi', '2015', 'Jl. Ekonomi Sejahtera No. 45',
            'Budi Santoso', '081234567890', 'kontak@koperasimaju.id', 'Produksi pangan olahan dan simpan pinjam',
            'Rp 500.000.000', 'Ekspansi pasar ke tingkat nasional dan upgrade alat produksi',
            'Aset tetap gedung koperasi', 'https://drive.google.com/sample-lpdb-report', 'pending'
        ]);

        // 5. Seed Inkubasi
        console.log('  - Seeding Inkubasi...');
        await connection.execute(`
            INSERT INTO inkubasi_submissions 
            (user_id, founder_name, email, phone, business_name, business_stage, focus_area, program_goal, support_needed, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, 'Budi Santoso', 'budi@kopi.id', '081234567890', 'Kopi Nusantara',
            'Sudah Berjualan', 'Digitalisasi UMKM Kopi', 'Meningkatkan efisiensi operasional dan branding digital',
            'Mentor pemasaran dan akses jaringan venture capital', 'pending'
        ]);

        console.log('✅ All program submissions seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding programs:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

seedPrograms();
