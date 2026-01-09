const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
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

// CREATE Submission
router.post('/', verifyToken, async (req, res) => {
    try {
        const { type, data } = req.body;
        const userId = req.user.id;

        let query = '';
        let params = [];
        let targetTable = '';

        // Route to specific table based on type
        switch (type.toLowerCase()) {
            case 'kur':
                targetTable = 'kur_submissions';
                query = `INSERT INTO kur_submissions 
                        (user_id, owner_name, nik, email, phone, business_name, business_sector, business_duration, monthly_revenue, loan_amount, loan_purpose, tenor, collateral) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.ownerName, data.nik, data.email, data.phone,
                    data.businessName, data.businessSector, data.businessDuration,
                    data.monthlyRevenue, data.loanAmount, data.loanPurpose, data.tenor, data.collateral
                ];
                break;
            case 'umi':
                targetTable = 'umi_submissions';
                query = `INSERT INTO umi_submissions 
                        (user_id, owner_name, nik, phone, email, business_name, business_type, business_address, monthly_revenue, funding_need, fund_usage, repayment_plan) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.ownerName, data.nik, data.phone, data.email,
                    data.businessName, data.businessType, data.businessAddress,
                    data.monthlyRevenue, data.fundingNeed, data.fundUsage, data.repaymentPlan
                ];
                break;
            case 'lpdb':
                targetTable = 'lpdb_submissions';
                query = `INSERT INTO lpdb_submissions 
                        (user_id, institution_name, legal_entity, established_since, address, contact_person, phone, email, business_focus, requested_fund, fund_usage_plan, collateral_summary, financial_statement_link) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.institutionName, data.legalEntity, data.establishedSince,
                    data.address, data.contactPerson, data.phone, data.email,
                    data.businessFocus, data.requestedFund, data.fundUsagePlan,
                    data.collateralSummary, data.financialStatementLink
                ];
                break;
            case 'inkubasi':
                targetTable = 'inkubasi_submissions';
                query = `INSERT INTO inkubasi_submissions 
                        (user_id, founder_name, email, phone, business_name, business_stage, focus_area, program_goal, support_needed) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.founderName, data.email, data.phone,
                    data.businessName, data.businessStage, data.focusArea,
                    data.programGoal, data.supportNeeded
                ];
                break;
            case 'nib':
                targetTable = 'nib_submissions';
                query = `INSERT INTO nib_submissions 
                        (user_id, owner_nik, owner_name, owner_email, owner_phone, owner_address, business_name, business_form, business_address, business_sector, business_capital) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.owner.nik, data.owner.fullName, data.owner.email, data.owner.phone, data.owner.address,
                    data.business.name, data.business.form, data.business.address, data.business.sector, data.business.capital
                ];
                break;
            case 'merek':
                targetTable = 'merek_submissions';
                query = `INSERT INTO merek_submissions 
                        (user_id, owner_name, contact_email, contact_phone, business_entity, brand_name, brand_summary, product_photo, logo_reference, docs_id_owner) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.ownerName, data.contactEmail, data.contactPhone, data.businessEntity,
                    data.brandName, data.brandSummary, data.productPhoto, data.logoReference, data.docsIdOwner
                ];
                break;
            case 'halal':
                targetTable = 'halal_submissions';
                query = `INSERT INTO halal_submissions 
                        (user_id, certificate_number, holder_name, product_name, issued_by, notes) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.certificateNumber, data.holderName, data.productName, data.issuedBy, data.notes
                ];
                break;
            case 'bpom':
                targetTable = 'bpom_submissions';
                query = `INSERT INTO bpom_submissions 
                        (user_id, registration_number, product_name, producer_name, product_type, notes) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.registrationNumber, data.productName, data.producerName, data.productType, data.notes
                ];
                break;
            case 'sni':
                targetTable = 'sni_submissions';
                query = `INSERT INTO sni_submissions 
                        (user_id, certificate_number, company_name, product_scope, certification_body, notes) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.certificateNumber, data.companyName, data.productScope, data.certificationBody, data.notes
                ];
                break;
            case 'lainnya':
                targetTable = 'lainnya_submissions';
                query = `INSERT INTO lainnya_submissions 
                        (user_id, standard_type, certificate_number, holder_name, product_or_process, issuing_body, notes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.standardType, data.certificateNumber, data.holderName, data.productOrProcess, data.issuingBody, data.notes
                ];
                break;
            case 'laporan':
                targetTable = 'laporan_submissions';
                query = `INSERT INTO laporan_submissions 
                        (user_id, period, revenue, expenses, key_activities, achievements, challenges, support_requested) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.period, data.revenue, data.expenses, data.keyActivities, data.achievements, data.challenges, data.supportRequested
                ];
                break;
            case 'pelatihan':
                targetTable = 'pelatihan_submissions';
                query = `INSERT INTO pelatihan_submissions 
                        (user_id, full_name, email, phone, business_name, training_interest, reason, expectations) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                params = [
                    userId, data.fullName, data.email, data.phone, data.businessName, data.trainingInterest, data.reason, data.expectations
                ];
                break;
            case 'forum':
                targetTable = 'forum_posts';
                query = `INSERT INTO forum_posts 
                        (user_id, title, content, tags) 
                        VALUES (?, ?, ?, ?)`;
                params = [
                    userId, data.title, data.content, JSON.stringify(data.tags || [])
                ];
                break;
            default:
                // Fallback to generic submissions table
                targetTable = 'submissions';
                query = 'INSERT INTO submissions (user_id, type, data, status) VALUES (?, ?, ?, ?)';
                params = [userId, type, JSON.stringify(data), 'pending'];
        }

        const [result] = await pool.execute(query, params);

        res.json({
            success: true,
            message: `Pengajuan ${type.toUpperCase()} berhasil dikirim`,
            data: { id: result.insertId, table: targetTable }
        });
    } catch (error) {
        console.error('Create submission error:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat pengajuan: ' + error.message });
    }
});

// GET Submissions (Admin gets all, User gets own)
router.get('/', verifyToken, async (req, res) => {
    try {
        // Base queries for each table
        const tables = [
            { name: 'kur_submissions', label: 'KUR', titleField: 'business_name' },
            { name: 'umi_submissions', label: 'UMi', titleField: 'business_name' },
            { name: 'lpdb_submissions', label: 'LPDB', titleField: 'institution_name' },
            { name: 'inkubasi_submissions', label: 'Inkubasi', titleField: 'business_name' },
            { name: 'nib_submissions', label: 'NIB', titleField: 'business_name' },
            { name: 'merek_submissions', label: 'Merek', titleField: 'brand_name' },
            { name: 'halal_submissions', label: 'Halal', titleField: 'product_name' },
            { name: 'bpom_submissions', label: 'BPOM', titleField: 'product_name' },
            { name: 'sni_submissions', label: 'SNI', titleField: 'company_name' },
            { name: 'lainnya_submissions', label: 'Lainnya', titleField: 'standard_type' },
            { name: 'laporan_submissions', label: 'Laporan', titleField: 'period' },
            { name: 'pelatihan_submissions', label: 'Pelatihan', titleField: 'training_interest' },
            { name: 'forum_posts', label: 'Forum', titleField: 'title' },
            { name: 'submissions', label: 'Layanan', titleField: 'type' }
        ];

        let unionParts = [];
        let params = [];

        tables.forEach(table => {
            let part = `
                SELECT s.id, ${table.name === 'submissions' ? 's.type' : `'${table.label}'`} as type, 
                       s.status, s.created_at, s.user_id,
                       ${table.name === 'submissions' ? `CONCAT('Layanan - ', s.type)` : `CONCAT('Pengajuan ${table.label} - ', s.${table.titleField})`} as title,
                       u.email, u.display_name, u.role
                FROM ${table.name} s
                JOIN users u ON s.user_id = u.id
            `;

            if (req.user.role !== 'admin') {
                part += ' WHERE s.user_id = ?';
                params.push(req.user.id);
            }
            unionParts.push(part);
        });

        const fullQuery = unionParts.join(' UNION ALL ') + ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(fullQuery, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengajuan' });
    }
});

// UPDATE Status (Admin Only)
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status tidak valid' });
        }

        await pool.execute(
            'UPDATE submissions SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ success: true, message: 'Status pengajuan berhasil diupdate' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Gagal update status' });
    }
});

// GET Consolidated User History (User Only)
// NOTE: This must come BEFORE router.get('/:id')
router.get('/my-history', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Comprehensive UNION query to fetch from all specific program tables and generic submissions
        const query = `
            SELECT id, 'KUR' as type, status, created_at, CONCAT('Pengajuan KUR - ', business_name) as title
            FROM kur_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'UMi' as type, status, created_at, CONCAT('Pengajuan UMi - ', business_name) as title
            FROM umi_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'LPDB' as type, status, created_at, CONCAT('Pengajuan LPDB - ', institution_name) as title
            FROM lpdb_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'Inkubasi' as type, status, created_at, CONCAT('Program Inkubasi - ', business_name) as title
            FROM inkubasi_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'NIB' as type, status, created_at, CONCAT('Pengajuan NIB - ', business_name) as title
            FROM nib_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'Merek' as type, status, created_at, CONCAT('Pengajuan Merek - ', brand_name) as title
            FROM merek_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'Halal' as type, status, created_at, CONCAT('Sertifikat Halal - ', product_name) as title
            FROM halal_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'BPOM' as type, status, created_at, CONCAT('Registrasi BPOM - ', product_name) as title
            FROM bpom_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'SNI' as type, status, created_at, CONCAT('Sertifikat SNI - ', company_name) as title
            FROM sni_submissions 
            WHERE user_id = ?
            UNION ALL
                        SELECT id, 'Lainnya' as type, status, created_at, CONCAT('Standar Khusus - ', standard_type) as title
            FROM lainnya_submissions 
            WHERE user_id = ?
            UNION ALL
                        SELECT id, 'Laporan' as type, status, created_at, CONCAT('Laporan Rutin - ', period) as title
            FROM laporan_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'Pelatihan' as type, status, created_at, CONCAT('Pelatihan - ', training_interest) as title
            FROM pelatihan_submissions 
            WHERE user_id = ?
            UNION ALL
            SELECT id, 'Forum' as type, 'approved' as status, created_at, CONCAT('Postingan - ', title) as title
            FROM forum_posts 
            WHERE user_id = ?
            UNION ALL
            SELECT id, type, status, created_at, CONCAT('Layanan - ', type) as title
            FROM submissions 
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        const params = [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId];
        const [rows] = await pool.execute(query, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pengajuan' });
    }
});

// GET Single Submission
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        let query = `
            SELECT s.*, u.email, u.display_name, u.role
            FROM submissions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan' });
        }

        const submission = rows[0];

        // Security check: users can only see their own submissions
        if (req.user.role !== 'admin' && submission.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengajuan' });
    }
});

module.exports = router;
