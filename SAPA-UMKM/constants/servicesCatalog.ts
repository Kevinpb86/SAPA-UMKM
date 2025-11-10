import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export type ServiceAction = {
  id: string;
  title: string;
  description: string;
  icon: FeatherIconName;
  ctaLabel: string;
};

export type ServiceCategoryDetail = {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: FeatherIconName;
  accent: string;
  actions: ServiceAction[];
  tips: string[];
};

export const serviceCatalog: ServiceCategoryDetail[] = [
  {
    id: 'layanan',
    title: 'A. Layanan Publik & Perizinan',
    summary: 'Pengajuan dan manajemen legalitas usaha dalam satu tempat.',
    description:
      'Pastikan bisnis Anda terdaftar dan memiliki legalitas yang lengkap. Ajukan NIB, kelola merek, serta lengkapi kebutuhan sertifikasi seperti Halal dan SNI.',
    icon: 'shield',
    accent: '#4C7DFF',
    actions: [
      {
        id: 'nib',
        title: 'Pengajuan & Pembaruan Izin Usaha (NIB)',
        description: 'Proses pembuatan dan pembaruan Nomor Induk Berusaha secara daring.',
        icon: 'file-text',
        ctaLabel: 'Ajukan NIB',
      },
      {
        id: 'merek',
        title: 'Registrasi & Manajemen Merek Produk',
        description: 'Lindungi identitas usaha dengan merek dagang resmi.',
        icon: 'tag',
        ctaLabel: 'Kelola Merek',
      },
      {
        id: 'sertifikasi',
        title: 'Pengajuan Sertifikasi (Halal, SNI, dsb)',
        description: 'Dapatkan sertifikasi penting sesuai sektor usaha Anda.',
        icon: 'award',
        ctaLabel: 'Cek Sertifikasi',
      },
    ],
    tips: [
      'Siapkan dokumen identitas pemilik dan legalitas usaha.',
      'Pastikan data usaha telah diperbarui sebelum mengajukan layanan baru.',
    ],
  },
  {
    id: 'pemberdayaan',
    title: 'B. Program Pemberdayaan Pemerintah',
    summary: 'Akses bantuan pendanaan dan pendampingan resmi pemerintah.',
    description:
      'Temukan program pembiayaan dan pendampingan yang sesuai kebutuhan modal dan pengembangan usaha Anda.',
    icon: 'layers',
    accent: '#F97316',
    actions: [
      {
        id: 'kur',
        title: 'Pendaftaran Program KUR',
        description: 'Ajukan Kredit Usaha Rakyat dengan panduan dan simulasi cicilan.',
        icon: 'credit-card',
        ctaLabel: 'Ajukan KUR',
      },
      {
        id: 'umi',
        title: 'Pendaftaran Program UMi',
        description: 'Pembiayaan Ultra Mikro untuk kebutuhan modal usaha harian.',
        icon: 'trending-up',
        ctaLabel: 'Daftar Program UMi',
      },
      {
        id: 'lpdb',
        title: 'Pendaftaran Program LPDB',
        description: 'Dana bergulir untuk UMKM siap ekspansi.',
        icon: 'layers',
        ctaLabel: 'Mulai LPDB',
      },
      {
        id: 'inkubasi',
        title: 'Program Inkubasi/Bimbingan',
        description: 'Ikuti pendampingan intensif bersama mentor usaha.',
        icon: 'compass',
        ctaLabel: 'Lihat Inkubasi',
      },
    ],
    tips: [
      'Bandingkan ketentuan setiap program untuk memilih opsi terbaik.',
      'Lengkapi laporan keuangan singkat sebelum mengajukan pendanaan.',
    ],
  },
  {
    id: 'pelaporan',
    title: 'C. Pelaporan & Data Usaha',
    summary: 'Kelola data usaha dan penuhi kewajiban pelaporan.',
    description:
      'Laporkan perkembangan usaha dan perbarui profil UMKM agar pemerintah dapat memberikan dukungan yang tepat.',
    icon: 'bar-chart-2',
    accent: '#22C55E',
    actions: [
      {
        id: 'laporan',
        title: 'Pelaporan Kegiatan Usaha',
        description: 'Kirim laporan perkembangan dan aktivitas bulanan.',
        icon: 'bar-chart-2',
        ctaLabel: 'Upload Laporan',
      },
      {
        id: 'profil',
        title: 'Pembaruan Data Profil UMKM',
        description: 'Perbarui skala usaha, alamat, dan data penting lainnya.',
        icon: 'edit-3',
        ctaLabel: 'Perbarui Profil',
      },
    ],
    tips: [
      'Jadwalkan pengingat bulanan untuk pelaporan kegiatan.',
      'Gunakan format laporan standar agar evaluasi berjalan cepat.',
    ],
  },
  {
    id: 'komunitas',
    title: 'D. Komunitas & Jaringan',
    summary: 'Bangun jejaring dan tingkatkan kapabilitas bersama.',
    description:
      'Terhubung dengan pelaku UMKM lain, ikuti pelatihan komunitas, dan dapatkan informasi penyaluran program resmi.',
    icon: 'users',
    accent: '#A855F7',
    actions: [
      {
        id: 'forum',
        title: 'Forum Komunikasi/Diskusi',
        description: 'Diskusikan tantangan dan peluang usaha bersama komunitas.',
        icon: 'message-circle',
        ctaLabel: 'Masuk Forum',
      },
      {
        id: 'pelatihan-komunitas',
        title: 'Pelatihan Anggota Komunitas',
        description: 'Daftar pelatihan berbasis komunitas di daerah Anda.',
        icon: 'users',
        ctaLabel: 'Daftar Pelatihan',
      },
      {
        id: 'penyaluran',
        title: 'Informasi Penyaluran Program KemenKopUKM',
        description: 'Pantau program terbaru dari Kementerian Koperasi dan UKM.',
        icon: 'send',
        ctaLabel: 'Lihat Program',
      },
    ],
    tips: [
      'Aktif di forum untuk mendapatkan insight dan kolaborasi baru.',
      'Gunakan pelatihan komunitas untuk meningkatkan kapasitas tim.',
    ],
  },
  {
    id: 'kompetensi',
    title: 'E. Peningkatan Kompetensi',
    summary: 'Akses materi pembelajaran dan pelatihan resmi.',
    description:
      'Ikuti pelatihan teknis dan manajemen untuk meningkatkan kemampuan bisnis, serta akses modul e-learning mandiri.',
    icon: 'book-open',
    accent: '#0EA5E9',
    actions: [
      {
        id: 'pelatihan-teknis',
        title: 'Pelatihan Teknis & Manajemen KemenKopUKM',
        description: 'Jadwalkan pelatihan sesuai kebutuhan usaha Anda.',
        icon: 'book-open',
        ctaLabel: 'Jadwalkan Pelatihan',
      },
      {
        id: 'elearning',
        title: 'Modul Pembelajaran E-Learning',
        description: 'Belajar mandiri kapan saja dengan modul digital.',
        icon: 'monitor',
        ctaLabel: 'Mulai Belajar',
      },
    ],
    tips: [
      'Rancang rencana pengembangan kompetensi bersama tim Anda.',
      'Catat hasil pelatihan untuk evaluasi dan sertifikasi internal.',
    ],
  },
];

export const heroHighlights = [
  {
    id: 'highlight-legalitas',
    label: 'Legalitas disetujui',
    value: '12',
    icon: 'check-circle' as FeatherIconName,
    accent: '#C7D2FE',
  },
  {
    id: 'highlight-dana',
    label: 'Program pendanaan aktif',
    value: '7',
    icon: 'credit-card' as FeatherIconName,
    accent: '#FDE68A',
  },
  {
    id: 'highlight-kompetensi',
    label: 'Sesi pelatihan bulan ini',
    value: '15',
    icon: 'book-open' as FeatherIconName,
    accent: '#BBF7D0',
  },
];

export type { FeatherIconName };
