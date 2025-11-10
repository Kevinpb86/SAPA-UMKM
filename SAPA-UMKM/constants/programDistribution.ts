export type ProgramType = 'KUR' | 'UMi' | 'LPDB' | 'Banpres' | 'Pelatihan';

export type ProgramStatus =
  | 'Pendaftaran dibuka'
  | 'Segera dibuka'
  | 'Sedang seleksi'
  | 'Selesai';

export type ProgramBenefit = {
  id: string;
  title: string;
  description: string;
  icon: 'activity' | 'users' | 'briefcase' | 'award' | 'trending-up' | 'target';
};

export type ProgramTimelineItem = {
  id: string;
  label: string;
  period: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
};

export type ProgramResource = {
  id: string;
  label: string;
  type: 'Dokumen' | 'Panduan' | 'Contoh Formulir' | 'FAQ';
  link: string;
};

export type ProgramInfo = {
  id: string;
  name: string;
  type: ProgramType;
  provider: string;
  status: ProgramStatus;
  summary: string;
  quotaInfo: string;
  financingRange?: string;
  rateInfo?: string;
  nextDeadline?: string;
  benefits: ProgramBenefit[];
  requirements: string[];
  timeline: ProgramTimelineItem[];
  resources: ProgramResource[];
  contact: {
    email: string;
    phone: string;
    notes?: string;
  };
};

export const programInfos: ProgramInfo[] = [
  {
    id: 'program-kur-2025',
    name: 'Kredit Usaha Rakyat (KUR) Mikro 2025',
    type: 'KUR',
    provider: 'Bank BRI, Bank Mandiri, BNI, BSI, Pegadaian, PNM',
    status: 'Pendaftaran dibuka',
    summary:
      'Fasilitas pembiayaan modal kerja dan investasi untuk usaha produktif dengan bunga rendah dan tenor hingga 5 tahun.',
    quotaInfo: 'Kuota nasional 2025: Rp 253 Triliun, prioritas sektor produksi.',
    financingRange: 'Plafon maksimal Rp 500 juta',
    rateInfo: 'Suku bunga 6% efektif per tahun',
    nextDeadline: 'Pengajuan batch I berakhir 31 Desember 2025',
    benefits: [
      {
        id: 'kur-benefit-1',
        title: 'Plafon fleksibel',
        description: 'Penambahan plafon otomatis bagi debitur berprestasi tanpa agunan tambahan.',
        icon: 'trending-up',
      },
      {
        id: 'kur-benefit-2',
        title: 'Pendampingan usaha',
        description: 'Konsultasi manajemen usaha gratis melalui program KUR Coaching Clinic.',
        icon: 'activity',
      },
      {
        id: 'kur-benefit-3',
        title: 'Kemudahan syarat',
        description: 'Menggunakan rekening koran & surat keterangan usaha dari kelurahan.',
        icon: 'briefcase',
      },
    ],
    requirements: [
      'Memiliki usaha produktif minimal berjalan 6 bulan.',
      'Memiliki Nomor Induk Berusaha (NIB) atau surat keterangan usaha dari pemerintah daerah.',
      'Tidak sedang menerima kredit produktif lain (kecuali KUR sebelumnya sesuai ketentuan).',
      'Melampirkan laporan keuangan sederhana 6 bulan terakhir.',
    ],
    timeline: [
      {
        id: 'kur-tl-1',
        label: 'Sosialisasi & Registrasi',
        period: 'Mei - Juni 2025',
        description: 'Pengisian formulir daring dan pengumpulan dokumen administrasi.',
        status: 'completed',
      },
      {
        id: 'kur-tl-2',
        label: 'Verifikasi & Survei',
        period: 'Juli - September 2025',
        description: 'Pemeriksaan kelayakan usaha dan penilaian agunan tambahan jika diperlukan.',
        status: 'current',
      },
      {
        id: 'kur-tl-3',
        label: 'Penyaluran Dana',
        period: 'Oktober - Desember 2025',
        description: 'Penandatanganan akad dan pencairan dana bertahap sesuai kebutuhan usaha.',
        status: 'upcoming',
      },
    ],
    resources: [
      {
        id: 'kur-res-1',
        label: 'Panduan lengkap pengajuan KUR 2025',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/kur-panduan-2025.pdf',
      },
      {
        id: 'kur-res-2',
        label: 'Template laporan keuangan sederhana',
        type: 'Contoh Formulir',
        link: 'https://sapa-umkm.id/dokumen/template-laporan-keuangan.xlsx',
      },
      {
        id: 'kur-res-3',
        label: 'FAQ KUR Mikro 2025',
        type: 'FAQ',
        link: 'https://sapa-umkm.id/dokumen/faq-kur-2025.pdf',
      },
    ],
    contact: {
      email: 'kur@sapaukm.go.id',
      phone: '1500-587',
      notes: 'Layanan helpdesk daring tersedia Senin - Jumat, pukul 08.00 - 17.00 WIB.',
    },
  },
  {
    id: 'program-umi-2025',
    name: 'Pembiayaan Ultra Mikro (UMi) 2025',
    type: 'UMi',
    provider: 'PT Pegadaian, PT PNM, PT BAV Financing',
    status: 'Segera dibuka',
    summary:
      'Pembiayaan untuk pelaku usaha ultra mikro yang belum bankable dengan plafon hingga Rp 20 juta tanpa agunan.',
    quotaInfo: 'Target sasaran 2025: 1,5 juta pelaku usaha ultra mikro.',
    financingRange: 'Plafon maksimal Rp 20 juta',
    rateInfo: 'Margin pembiayaan mulai 3% flat per tahun',
    nextDeadline: 'Pra-registrasi ditutup 15 Januari 2026',
    benefits: [
      {
        id: 'umi-benefit-1',
        title: 'Tanpa agunan',
        description: 'Cukup dengan surat rekomendasi kelompok usaha atau komunitas lokal.',
        icon: 'users',
      },
      {
        id: 'umi-benefit-2',
        title: 'Pembinaan intensif',
        description: 'Pendampingan usaha mingguan melalui Mekaar & program pemberdayaan lainnya.',
        icon: 'target',
      },
      {
        id: 'umi-benefit-3',
        title: 'Pencairan cepat',
        description: 'Proses maksimal 7 hari kerja setelah verifikasi dokumen lengkap.',
        icon: 'activity',
      },
    ],
    requirements: [
      'Usaha skala ultra mikro berjalan minimal 3 bulan.',
      'Belum pernah menerima pembiayaan komersial dari bank.',
      'Memiliki KTP dan Kartu Keluarga pemilik usaha.',
      'Mendaftar melalui kelompok atau komunitas usaha binaan.',
    ],
    timeline: [
      {
        id: 'umi-tl-1',
        label: 'Pra-registrasi komunitas',
        period: 'Desember 2025',
        description: 'Pendaftaran grup usaha/komunitas yang akan menjadi mitra UMi.',
        status: 'current',
      },
      {
        id: 'umi-tl-2',
        label: 'Asesmen kelayakan',
        period: 'Januari 2026',
        description: 'Verifikasi data usaha dan wawancara singkat oleh pendamping.',
        status: 'upcoming',
      },
      {
        id: 'umi-tl-3',
        label: 'Penyaluran & pendampingan',
        period: 'Februari - Maret 2026',
        description: 'Pencairan dana sekaligus jadwal pembinaan mingguan.',
        status: 'upcoming',
      },
    ],
    resources: [
      {
        id: 'umi-res-1',
        label: 'Checklist dokumen UMi',
        type: 'Dokumen',
        link: 'https://sapa-umkm.id/dokumen/checklist-umi.pdf',
      },
      {
        id: 'umi-res-2',
        label: 'Panduan kelompok usaha binaan',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/panduan-kelompok-umi.pdf',
      },
    ],
    contact: {
      email: 'umi@sapaukm.go.id',
      phone: '021-1500-168',
      notes: 'Hubungi pendamping lokal di kabupaten/kota Anda untuk jadwal sosialisasi.',
    },
  },
  {
    id: 'program-lpdb-2025',
    name: 'LPDB-KUMKM Skema Syariah Kemitraan',
    type: 'LPDB',
    provider: 'Lembaga Pengelola Dana Bergulir KUMKM (LPDB-KUMKM)',
    status: 'Sedang seleksi',
    summary:
      'Pendanaan syariah bagi koperasi/UMKM untuk memperkuat rantai pasok sektor pangan dan agribisnis.',
    quotaInfo: 'Total dana bergulir Rp 2,5 Triliun untuk 2025.',
    financingRange: 'Pembiayaan Rp 500 juta - Rp 10 miliar',
    rateInfo: 'Nisbah bagi hasil 70:30 (LPDB : Mitra)',
    nextDeadline: 'Pengumuman hasil seleksi batch II: 30 November 2025',
    benefits: [
      {
        id: 'lpdb-benefit-1',
        title: 'Pendanaan skala besar',
        description: 'Mendukung ekspansi usaha dan investasi alat produksi.',
        icon: 'trending-up',
      },
      {
        id: 'lpdb-benefit-2',
        title: 'Skema syariah',
        description: 'Tanpa bunga, menggunakan nisbah bagi hasil yang disepakati.',
        icon: 'award',
      },
      {
        id: 'lpdb-benefit-3',
        title: 'Kemitraan strategis',
        description: 'Kesempatan bermitra dengan offtaker nasional pada sektor pangan.',
        icon: 'users',
      },
    ],
    requirements: [
      'Berbadan hukum koperasi/UMKM dan telah beroperasi minimal 2 tahun.',
      'Memiliki laporan keuangan audit 2 tahun terakhir.',
      'Memiliki mitra offtaker atau kontrak penjualan yang jelas.',
      'Menyerahkan proposal bisnis dan cashflow minimal 3 tahun.',
    ],
    timeline: [
      {
        id: 'lpdb-tl-1',
        label: 'Pendaftaran daring',
        period: 'Maret - Juli 2025',
        description: 'Pengisian data di portal LPDB dan unggah dokumen pendukung.',
        status: 'completed',
      },
      {
        id: 'lpdb-tl-2',
        label: 'Seleksi administrasi & verifikasi',
        period: 'Agustus - Oktober 2025',
        description: 'Review dokumen, wawancara virtual, dan kunjungan lapangan terpilih.',
        status: 'current',
      },
      {
        id: 'lpdb-tl-3',
        label: 'Penetapan & penyaluran',
        period: 'November - Desember 2025',
        description: 'Penandatanganan akad dan penyaluran dana bertahap.',
        status: 'upcoming',
      },
    ],
    resources: [
      {
        id: 'lpdb-res-1',
        label: 'Template proposal bisnis LPDB',
        type: 'Contoh Formulir',
        link: 'https://sapa-umkm.id/dokumen/template-proposal-lpdb.docx',
      },
      {
        id: 'lpdb-res-2',
        label: 'Pedoman penilaian LPDB 2025',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/pedoman-lpdb-2025.pdf',
      },
    ],
    contact: {
      email: 'lpdb@sapaukm.go.id',
      phone: '1500-859',
      notes: 'Klinik konsultasi daring tersedia setiap Selasa & Kamis pukul 09.00 - 15.00 WIB.',
    },
  },
  {
    id: 'program-banpres-2025',
    name: 'Banpres Produktif Usaha Mikro Tahap II',
    type: 'Banpres',
    provider: 'Kementerian Koperasi dan UKM bersama Pemerintah Daerah',
    status: 'Pendaftaran dibuka',
    summary:
      'Bantuan tunai produktif Rp 2,4 juta untuk pelaku usaha mikro terdampak ekonomi dengan prioritas wilayah 3T.',
    quotaInfo: 'Kuota 2025: 500.000 penerima baru, prioritas perempuan pelaku usaha.',
    financingRange: 'Bantuan tunai Rp 2,4 juta',
    nextDeadline: 'Pendaftaran daring ditutup 10 Januari 2026',
    benefits: [
      {
        id: 'banpres-benefit-1',
        title: 'Tanpa pengembalian',
        description: 'Dana hibah untuk mendukung modal kerja dan adaptasi usaha.',
        icon: 'briefcase',
      },
      {
        id: 'banpres-benefit-2',
        title: 'Prioritas 3T',
        description: 'Dukungan khusus untuk wilayah tertinggal, terdepan, terluar.',
        icon: 'target',
      },
    ],
    requirements: [
      'Pelaku usaha mikro dengan omset maksimal Rp 300 juta per tahun.',
      'Tidak sedang menerima kredit modal kerja produktif dari perbankan.',
      'Memiliki surat rekomendasi dari dinas koperasi setempat atau asosiasi',
      'Mengunggah foto usaha dan bukti transaksi 3 bulan terakhir.',
    ],
    timeline: [
      {
        id: 'banpres-tl-1',
        label: 'Pengajuan daring',
        period: 'Oktober 2025 - Januari 2026',
        description: 'Pengisian data di sistem Banpres dan unggah kelengkapan dokumen.',
        status: 'current',
      },
      {
        id: 'banpres-tl-2',
        label: 'Verifikasi lapangan',
        period: 'Januari - Februari 2026',
        description: 'Validasi data oleh dinas koperasi kab/kota.',
        status: 'upcoming',
      },
      {
        id: 'banpres-tl-3',
        label: 'Penyaluran bantuan',
        period: 'Maret 2026',
        description: 'Transfer langsung ke rekening penerima yang lolos verifikasi.',
        status: 'upcoming',
      },
    ],
    resources: [
      {
        id: 'banpres-res-1',
        label: 'Panduan pengajuan Banpres 2025',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/panduan-banpres-2025.pdf',
      },
      {
        id: 'banpres-res-2',
        label: 'Surat rekomendasi dinas contoh',
        type: 'Contoh Formulir',
        link: 'https://sapa-umkm.id/dokumen/contoh-rekomendasi-banpres.docx',
      },
    ],
    contact: {
      email: 'banpres@sapaukm.go.id',
      phone: '1500-587 ext 3',
      notes: 'Koordinasi dengan dinas koperasi kab/kota untuk jadwal verifikasi.',
    },
  },
  {
    id: 'program-pelatihan-2025',
    name: 'Pelatihan & Pendampingan Transformasi Digital UMKM 2025',
    type: 'Pelatihan',
    provider: 'KemenKopUKM bersama 12 inkubator bisnis daerah',
    status: 'Segera dibuka',
    summary:
      'Program hybrid 3 bulan untuk meningkatkan kapabilitas digital pemasaran, operasional, dan keuangan UMKM.',
    quotaInfo: '500 peserta terpilih di 12 kota.',
    nextDeadline: 'Pra-registrasi batch 1 ditutup 20 Februari 2026',
    benefits: [
      {
        id: 'pelatih-benefit-1',
        title: 'Bootcamp intensif',
        description: 'Workshop online & offline dengan mentor spesialis digital marketing.',
        icon: 'activity',
      },
      {
        id: 'pelatih-benefit-2',
        title: 'Voucher teknologi',
        description: 'Subsidi tools SaaS hingga Rp 5 juta per usaha.',
        icon: 'award',
      },
      {
        id: 'pelatih-benefit-3',
        title: 'Demo day nasional',
        description: 'Kesempatan pitching di hadapan mitra marketplace dan investor.',
        icon: 'trending-up',
      },
    ],
    requirements: [
      'Usaha telah memiliki kanal penjualan digital (marketplace/media sosial).',
      'Memiliki tim minimal 2 orang yang siap mengikuti pelatihan penuh.',
      'Bersedia mengikuti evaluasi pasca program selama 6 bulan.',
    ],
    timeline: [
      {
        id: 'pelatih-tl-1',
        label: 'Pra-registrasi & asesmen',
        period: 'Desember 2025 - Februari 2026',
        description: 'Pengisian data usaha dan asesmen kesiapan digital.',
        status: 'current',
      },
      {
        id: 'pelatih-tl-2',
        label: 'Pelatihan inti',
        period: 'Maret - Mei 2026',
        description: 'Bootcamp hybrid 6 modul + mentoring 1:1.',
        status: 'upcoming',
      },
      {
        id: 'pelatih-tl-3',
        label: 'Demo day & scale-up',
        period: 'Juni 2026',
        description: 'Presentasi hasil implementasi & akses jejaring pasar.',
        status: 'upcoming',
      },
    ],
    resources: [
      {
        id: 'pelatih-res-1',
        label: 'Silabus modul transformasi digital',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/silabus-transformasi-digital.pdf',
      },
      {
        id: 'pelatih-res-2',
        label: 'Template asesmen kesiapan digital',
        type: 'Contoh Formulir',
        link: 'https://sapa-umkm.id/dokumen/asesmen-digital.xlsx',
      },
    ],
    contact: {
      email: 'pelatihan@sapaukm.go.id',
      phone: '0812-3456-7890',
      notes: 'Silakan bergabung di grup Telegram @transformasiUMKM untuk info teknis.',
    },
  },
];


