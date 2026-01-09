const pool = require('./config/database').pool;

async function seedLaporan() {
    console.log('Seeding business report data...');
    try {
        const userId = 2; // pelakuumkm@gmail.com

        await pool.execute(
            `INSERT INTO laporan_submissions (user_id, period, revenue, expenses, key_activities, achievements, challenges, support_requested, status) 
             VALUES (?, 'Januari 2026', '12.500.000', '4.200.000', 'Produksi massal keripik tempe varian pedas', 'Peningkatan penjualan 15%', 'Kenaikan harga minyak goreng', 'Pelatihan manajemen stok', 'approved')`,
            [userId]
        );

        console.log('✅ Laporan seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        process.exit();
    }
}

seedLaporan();
