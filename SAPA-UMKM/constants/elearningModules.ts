export const elearningPalette = {
  light: {
    background: '#F2FBFF',
    hero: ['#0EA5E9', '#14B8A6'],
    card: '#FFFFFF',
    border: '#CDEFF6',
    text: '#0F172A',
    subtle: '#4C5F7E',
    accent: '#0EA5E9',
  },
  dark: {
    background: '#061C26',
    hero: ['#0F766E', '#0EA5E9'],
    card: '#0F2430',
    border: '#1C3A45',
    text: '#F4FBFF',
    subtle: '#B2E4F2',
    accent: '#38BDF8',
  },
};

export type LessonType = 'Video' | 'Artikel' | 'Kuis' | 'Tugas';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: LessonType;
};

export type LearningResource = {
  id: string;
  label: string;
  description: string;
  link: string;
};

export type ModuleLevel = 'Pemula' | 'Menengah' | 'Lanjutan';

export type Module = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  level: ModuleLevel;
  lessons: Lesson[];
  outcomes: string[];
  resources: LearningResource[];
};

export const moduleCatalog: Module[] = [
  {
    id: 'fundamental',
    title: 'Dasar Pengelolaan UMKM',
    summary: 'Belajar legalitas, perizinan, dan administrasi usaha.',
    duration: '3 jam',
    level: 'Pemula',
    lessons: [
      {
        id: 'fundamental-01',
        title: 'Legalitas & Perizinan Usaha',
        description: 'Panduan memilih badan usaha, OSS, dan dokumen legal wajib.',
        duration: '12 menit',
        type: 'Video',
      },
      {
        id: 'fundamental-02',
        title: 'Administrasi & Pencatatan Sederhana',
        description: 'Contoh format pembukuan harian dan arsip digital.',
        duration: '15 menit',
        type: 'Artikel',
      },
      {
        id: 'fundamental-03',
        title: 'Evaluasi Kesiapan Operasional',
        description: 'Kuis interaktif untuk mengukur pemahaman materi dasar.',
        duration: '10 menit',
        type: 'Kuis',
      },
    ],
    outcomes: [
      'Memahami perbedaan badan usaha dan proses perizinannya.',
      'Mampu menyiapkan dokumen penting untuk legalitas usaha.',
      'Menerapkan pencatatan administrasi dasar secara konsisten.',
    ],
    resources: [
      {
        id: 'fundamental-resource-01',
        label: 'Checklist Legalitas UMKM',
        description: 'Daftar kebutuhan dokumen legal dan alur perizinan.',
        link: 'https://kemenkopukm.go.id/legalitas-umkm.pdf',
      },
      {
        id: 'fundamental-resource-02',
        label: 'Template Buku Kas Harian',
        description: 'Spreadsheet sederhana untuk memulai pencatatan keuangan.',
        link: 'https://kemenkopukm.go.id/template-kas.xlsx',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Pemasaran Digital',
    summary: 'Optimalkan media sosial dan marketplace untuk meningkatkan penjualan.',
    duration: '4 jam',
    level: 'Menengah',
    lessons: [
      {
        id: 'marketing-01',
        title: 'Membangun Persona & Target Pasar',
        description: 'Teknik segmentasi pelanggan dan pemetaan kebutuhan.',
        duration: '14 menit',
        type: 'Video',
      },
      {
        id: 'marketing-02',
        title: 'Konten Strategis untuk Media Sosial',
        description: 'Langkah membuat kalender konten dan template posting.',
        duration: '18 menit',
        type: 'Artikel',
      },
      {
        id: 'marketing-03',
        title: 'Optimasi Marketplace & Iklan',
        description: 'Praktik menulis deskripsi produk dan menyiapkan iklan berbayar.',
        duration: '20 menit',
        type: 'Video',
      },
      {
        id: 'marketing-04',
        title: 'Uji Pemahaman Pemasaran Digital',
        description: 'Kuis singkat untuk menguji strategi pemasaran yang telah dipelajari.',
        duration: '12 menit',
        type: 'Kuis',
      },
    ],
    outcomes: [
      'Menentukan target pelanggan dan proposisi nilai produk.',
      'Membuat konten terjadwal untuk media sosial yang konsisten.',
      'Mengoptimalkan listing marketplace dan menjalankan iklan sederhana.',
    ],
    resources: [
      {
        id: 'marketing-resource-01',
        label: 'Template Kalender Konten 30 Hari',
        description: 'Format siap pakai untuk mengatur jadwal unggahan.',
        link: 'https://sapa-umkm.id/kalender-konten.xlsx',
      },
      {
        id: 'marketing-resource-02',
        label: 'Checklist Optimasi Toko Online',
        description: 'Panduan singkat untuk meningkatkan performa toko di marketplace.',
        link: 'https://sapa-umkm.id/checklist-marketplace.pdf',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Keuangan & Akuntansi Sederhana',
    summary: 'Kelola arus kas, pencatatan, dan laporan keuangan UMKM.',
    duration: '3.5 jam',
    level: 'Menengah',
    lessons: [
      {
        id: 'finance-01',
        title: 'Memahami Arus Kas Usaha',
        description: 'Identifikasi pemasukan, pengeluaran, dan arus kas bersih.',
        duration: '16 menit',
        type: 'Video',
      },
      {
        id: 'finance-02',
        title: 'Pencatatan Transaksi Harian',
        description: 'Simulasi pencatatan transaksi menggunakan sistem sederhana.',
        duration: '15 menit',
        type: 'Artikel',
      },
      {
        id: 'finance-03',
        title: 'Menyusun Laporan Keuangan Mini',
        description: 'Langkah membuat neraca sederhana dan laporan laba rugi.',
        duration: '18 menit',
        type: 'Video',
      },
      {
        id: 'finance-04',
        title: 'Evaluasi Keuangan Usaha',
        description: 'Kuis untuk menguji pemahaman soal pencatatan dan analisis keuangan.',
        duration: '10 menit',
        type: 'Kuis',
      },
    ],
    outcomes: [
      'Menganalisis arus kas dan memisahkan keuangan pribadi serta usaha.',
      'Melakukan pencatatan transaksi yang rapi dan terstruktur.',
      'Menyusun laporan keuangan sederhana untuk evaluasi usaha.',
    ],
    resources: [
      {
        id: 'finance-resource-01',
        label: 'Template Laporan Laba Rugi',
        description: 'Format excel untuk memantau performa penjualan dan biaya.',
        link: 'https://sapa-umkm.id/laba-rugi.xlsx',
      },
      {
        id: 'finance-resource-02',
        label: 'Video Tutorial Pencatatan Kas',
        description: 'Langkah praktis melakukan pencatatan arus kas harian.',
        link: 'https://youtu.be/umkm-finance',
      },
    ],
  },
  {
    id: 'export',
    title: 'Persiapan Ekspor UMKM',
    summary: 'Pelajari standar produk, dokumen ekspor, dan strategi penetrasi pasar global.',
    duration: '5 jam',
    level: 'Lanjutan',
    lessons: [
      {
        id: 'export-01',
        title: 'Memahami Regulasi Ekspor',
        description: 'Standar mutu, HS code, dan perizinan yang diperlukan.',
        duration: '20 menit',
        type: 'Video',
      },
      {
        id: 'export-02',
        title: 'Mempersiapkan Produk & Logistik',
        description: 'Pengemasan, labeling, dan rantai distribusi internasional.',
        duration: '18 menit',
        type: 'Artikel',
      },
      {
        id: 'export-03',
        title: 'Negosiasi & Kontrak Dagang',
        description: 'Strategi negosiasi dan penyusunan kontrak dagang yang aman.',
        duration: '22 menit',
        type: 'Video',
      },
      {
        id: 'export-04',
        title: 'Simulasi Rencana Ekspor',
        description: 'Tugas praktis menyusun rencana ekspor untuk produk unggulan.',
        duration: '25 menit',
        type: 'Tugas',
      },
    ],
    outcomes: [
      'Mengidentifikasi standar mutu dan regulasi ekspor produk UMKM.',
      'Menyiapkan rantai logistik dan dokumen ekspor dengan tepat.',
      'Menyusun rencana ekspor dan negosiasi kontrak dagang yang aman.',
    ],
    resources: [
      {
        id: 'export-resource-01',
        label: 'Template Rencana Ekspor',
        description: 'Worksheet untuk menyusun strategi dan target pasar ekspor.',
        link: 'https://sapa-umkm.id/template-ekspor.docx',
      },
      {
        id: 'export-resource-02',
        label: 'Daftar Dokumen Ekspor',
        description: 'Checklist lengkap dokumen ekspor berdasarkan jenis produk.',
        link: 'https://kemendag.go.id/dokumen-ekspor.pdf',
      },
    ],
  },
];

