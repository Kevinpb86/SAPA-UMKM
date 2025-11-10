export type TrainingMode = 'Tatap Muka' | 'Hybrid' | 'Daring';

export type TrainingLevel = 'Dasar' | 'Menengah' | 'Lanjutan';

export type TrainingAudience = 'UMKM Pemula' | 'UMKM Berkembang' | 'Koperasi' | 'Asosiasi';

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  mode: TrainingMode;
  duration: string;
  level: TrainingLevel;
  audience: TrainingAudience[];
  outcomes: string[];
  agenda: {
    title: string;
    description: string;
    duration: string;
  }[];
  facilitator: {
    name: string;
    role: string;
    experience: string;
  };
  materials: {
    id: string;
    label: string;
    type: 'Handout' | 'Template' | 'Panduan';
    link: string;
  }[];
  followUp: string[];
};

export const trainingModules: TrainingModule[] = [
  {
    id: 'digital-marketing-boost',
    title: 'Intensif Digital Marketing untuk UMKM',
    description:
      'Pendampingan menyusun strategi pemasaran digital terintegrasi untuk meningkatkan penjualan dan visibilitas brand.',
    mode: 'Hybrid',
    duration: '3 hari (2 daring + 1 tatap muka)',
    level: 'Menengah',
    audience: ['UMKM Berkembang', 'Asosiasi'],
    outcomes: [
      'Menyusun kalender konten dan funnel pemasaran sesuai karakter produk.',
      'Mengoperasikan kanal pemasaran utama (media sosial, marketplace, iklan digital) dengan efektif.',
      'Menerapkan analitik sederhana untuk evaluasi kampanye dan retensi pelanggan.',
    ],
    agenda: [
      {
        title: 'Hari 1 - Fondasi & Audit Digital',
        description:
          'Mapping persona pelanggan, audit kanal digital, dan penetapan indikator keberhasilan.',
        duration: '6 jam (daring)',
      },
      {
        title: 'Hari 2 - Produksi Konten & Optimasi Iklan',
        description:
          'Workshop konten storytelling, pemanfaatan AI assistant, serta setup iklan Meta & Google.',
        duration: '6 jam (daring)',
      },
      {
        title: 'Hari 3 - Strategi Marketplace & Customer Journey',
        description:
          'Sesi tatap muka: studi kasus marketplace lokal, integrasi CRM, dan rencana aksi 90 hari.',
        duration: '8 jam (tatap muka)',
      },
    ],
    facilitator: {
      name: 'Rina Wibisono',
      role: 'Lead Trainer Digitalisasi UMKM',
      experience: '10 tahun mendampingi UMKM go digital di 15 provinsi.',
    },
    materials: [
      {
        id: 'dm-handout',
        label: 'Handbook Digital Marketing UMKM (2025)',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/handbook-digital-umkm.pdf',
      },
      {
        id: 'dm-template',
        label: 'Template Kalender Konten 60 Hari',
        type: 'Template',
        link: 'https://sapa-umkm.id/dokumen/template-konten-60hari.xlsx',
      },
    ],
    followUp: [
      'Monitoring daring 1 kali per minggu selama 1 bulan.',
      'Sesi konsultasi personal maksimal 2 jam untuk tiap peserta.',
      'Akses grup komunitas digital marketing nasional.',
    ],
  },
  {
    id: 'lean-production',
    title: 'Workshop Lean Production & SOP Mutu',
    description:
      'Membangun sistem produksi efisien dengan standar mutu terukur untuk industri makanan/minuman dan kerajinan.',
    mode: 'Tatap Muka',
    duration: '2 hari in-house (16 jam)',
    level: 'Dasar',
    audience: ['UMKM Pemula', 'UMKM Berkembang'],
    outcomes: [
      'Menetapkan KPI produksi dan peta proses kerja yang jelas.',
      'Menyusun SOP sederhana: persiapan bahan baku, proses produksi, QC, dan distribusi.',
      'Mengimplementasikan sistem pencatatan manual terstruktur untuk pengawasan mutu.',
    ],
    agenda: [
      {
        title: 'Hari 1 - Mapping Proses & Efisiensi',
        description:
          'Identifikasi bottleneck, teknik 5S, serta simulasi layout workshop untuk alur kerja optimal.',
        duration: '8 jam',
      },
      {
        title: 'Hari 2 - SOP Mutu & Implementasi',
        description:
          'Studi kasus UMKM pangan/kerajinan, drafting SOP, checklist mutu, dan rencana implementasi 30 hari.',
        duration: '8 jam',
      },
    ],
    facilitator: {
      name: 'Aditya Nugraha',
      role: 'Konsultan Manufaktur dan Mutu UMKM',
      experience: '15 tahun pengalaman di industri manufaktur pangan dan kosmetik.',
    },
    materials: [
      {
        id: 'lean-handout',
        label: 'Workbook SOP & Checklist Mutu',
        type: 'Template',
        link: 'https://sapa-umkm.id/dokumen/workbook-sop-mutu.docx',
      },
    ],
    followUp: [
      'Kunjungan tindak lanjut oleh fasilitator setelah 45 hari.',
      'Review laporan implementasi SOP dan rekomendasi perbaikan.',
    ],
  },
  {
    id: 'financial-literacy',
    title: 'Kelas Literasi Keuangan & Akses Pembiayaan',
    description:
      'Menguatkan kemampuan pencatatan keuangan, analisis arus kas, dan persiapan dokumen pembiayaan UMKM.',
    mode: 'Daring',
    duration: '4 sesi (masing-masing 2 jam)',
    level: 'Dasar',
    audience: ['UMKM Pemula', 'Koperasi'],
    outcomes: [
      'Memahami dasar akuntansi sederhana dan pemisahan keuangan pribadi-usaha.',
      'Menyusun laporan arus kas, laba rugi, dan neraca sederhana menggunakan template.',
      'Menyiapkan dokumen wajib untuk mengakses KUR/UMi/LPDB.',
    ],
    agenda: [
      {
        title: 'Sesi 1 - Fondasi Pencatatan & Cashflow',
        description: 'Pengantar akuntansi sederhana dan praktik mencatat transaksi harian.',
        duration: '2 jam (daring)',
      },
      {
        title: 'Sesi 2 - Laporan Keuangan Mini',
        description: 'Menyusun laporan laba rugi dan neraca dengan template excel.',
        duration: '2 jam (daring)',
      },
      {
        title: 'Sesi 3 - Analisa Arus Kas & Pricing',
        description: 'Menentukan HPP, margin, dan analisis break-even sederhana.',
        duration: '2 jam (daring)',
      },
      {
        title: 'Sesi 4 - Mempersiapkan Dokumen Pembiayaan',
        description: 'Checklist dokumen KUR/UMi/LPDB dan simulasi pengisian formulir.',
        duration: '2 jam (daring)',
      },
    ],
    facilitator: {
      name: 'Sari Prameswari',
      role: 'Analis Keuangan UMKM',
      experience: '8 tahun mendampingi UMKM mengakses pembiayaan KUR & LPDB.',
    },
    materials: [
      {
        id: 'finance-template',
        label: 'Template Arus Kas & Laba Rugi UMKM',
        type: 'Template',
        link: 'https://sapa-umkm.id/dokumen/template-keuangan.xlsx',
      },
      {
        id: 'finance-guide',
        label: 'Panduan Dokumen Pengajuan KUR',
        type: 'Panduan',
        link: 'https://sapa-umkm.id/dokumen/panduan-dokumen-kur.pdf',
      },
    ],
    followUp: [
      'Klinik konsultasi keuangan daring setiap Jumat (2 jam).',
      'Akses grup WA khusus untuk tanya jawab dokumen pembiayaan.',
    ],
  },
];

