export type ForumTag = 'Strategi' | 'Permodalan' | 'Legalitas' | 'Digital' | 'Kemitraan' | 'Operasional';

export type ForumParticipant = {
  id: string;
  name: string;
  role: 'Pelaku UMKM' | 'Mentor' | 'Moderator';
  avatarInitials: string;
};

export type ForumReply = {
  id: string;
  author: ForumParticipant;
  message: string;
  createdAt: string;
  upvotes: number;
  isLiked?: boolean;
};

export type ForumTopic = {
  id: string;
  title: string;
  author: ForumParticipant;
  createdAt: string;
  tags: ForumTag[];
  summary: string;
  replies: ForumReply[];
  status: 'open' | 'closed' | 'pinned';
  likes?: number;
  isLiked?: boolean;
};

export const forumParticipants: ForumParticipant[] = [
  { id: 'p-1', name: 'Dewi Martina', role: 'Pelaku UMKM', avatarInitials: 'DM' },
  { id: 'p-2', name: 'Andika Pratama', role: 'Pelaku UMKM', avatarInitials: 'AP' },
  { id: 'p-3', name: 'Mentor Fajar', role: 'Mentor', avatarInitials: 'MF' },
  { id: 'p-4', name: 'Moderator Nila', role: 'Moderator', avatarInitials: 'MN' },
];

const findParticipant = (id: string) =>
  forumParticipants.find(participant => participant.id === id) ?? forumParticipants[0];

export const forumTopics: ForumTopic[] = [
  {
    id: 't-1',
    title: 'Strategi kolaborasi dengan coffee shop lokal sebagai reseller produk roti',
    author: findParticipant('p-1'),
    createdAt: '2025-11-08T09:15:00Z',
    tags: ['Kemitraan', 'Strategi'],
    summary:
      'Bagaimana cara menyusun paket kemitraan yang menarik untuk coffee shop sebagai reseller roti artisan? Tantangan utama ada pada logistik pengiriman harian dan sistem konsinyasi.',
    replies: [
      {
        id: 'r-1',
        author: findParticipant('p-3'),
        message:
          'Mulai dengan pilot project untuk 3 outlet terlebih dahulu dan gunakan sistem pre-order agar produksi lebih terukur. Sertakan materi promosi digital yang siap pakai untuk partner.',
        createdAt: '2025-11-08T11:22:00Z',
        upvotes: 14,
      },
      {
        id: 'r-2',
        author: findParticipant('p-2'),
        message:
          'Kami kombinasikan konsinyasi dengan diskon early payment. Partner yang membayar lebih cepat dapat margin lebih besar. Cara ini membuat arus kas tetap aman.',
        createdAt: '2025-11-08T13:05:00Z',
        upvotes: 9,
      },
    ],
    status: 'open',
  },
  {
    id: 't-2',
    title: 'Tips mengajukan pembiayaan KUR untuk usaha kuliner rumahan',
    author: findParticipant('p-4'),
    createdAt: '2025-11-07T08:45:00Z',
    tags: ['Permodalan', 'Operasional'],
    summary:
      'Bagikan pengalaman dokumen dan persyaratan yang dibutuhkan saat mengajukan Kredit Usaha Rakyat skala mikro. Adakah rekomendasi bank atau koperasi yang prosesnya cepat?',
    replies: [
      {
        id: 'r-3',
        author: findParticipant('p-2'),
        message:
          'Pastikan laporan keuangan sederhana Anda rapi minimal 6 bulan. Kami pakai format laba rugi sederhana dan sudah cukup diterima Bank BRI unit.',
        createdAt: '2025-11-07T10:12:00Z',
        upvotes: 12,
      },
      {
        id: 'r-4',
        author: findParticipant('p-3'),
        message:
          'Untuk mempercepat proses, lampirkan juga foto lokasi usaha serta rekomendasi dari komunitas UMKM setempat. Beberapa bank menjadikan dokumen tambahan ini sebagai nilai plus.',
        createdAt: '2025-11-07T15:48:00Z',
        upvotes: 7,
      },
    ],
    status: 'pinned',
  },
  {
    id: 't-3',
    title: 'Tools digital marketing gratis yang efektif untuk produk fashion lokal',
    author: findParticipant('p-1'),
    createdAt: '2025-11-06T14:30:00Z',
    tags: ['Digital', 'Strategi'],
    summary:
      'Saya mencari rekomendasi tools gratis untuk menjadwalkan konten, analitik sederhana, dan desain cepat agar tim kecil kami bisa lebih produktif.',
    replies: [
      {
        id: 'r-5',
        author: findParticipant('p-3'),
        message:
          'Canva untuk desain, Buffer versi gratis untuk jadwal konten, dan gunakan Meta Business Suite untuk analitik dasar Facebook/Instagram. Semua bisa dipakai tanpa biaya.',
        createdAt: '2025-11-06T17:10:00Z',
        upvotes: 21,
      },
    ],
    status: 'open',
  },
  {
    id: 't-4',
    title: 'Mempersiapkan sertifikasi halal untuk produk frozen food',
    author: findParticipant('p-2'),
    createdAt: '2025-11-05T09:50:00Z',
    tags: ['Legalitas', 'Operasional'],
    summary:
      'Berapa estimasi waktu dan biaya yang harus disiapkan untuk proses sertifikasi halal? Adakah tips membangun sistem dokumentasi bahan baku yang rapi?',
    replies: [
      {
        id: 'r-6',
        author: findParticipant('p-4'),
        message:
          'Rata-rata 1-2 bulan jika dokumen lengkap. Mulailah dari pencatatan pemasok dengan format sederhana (nama supplier, nomor batch, tanggal masuk). Sertakan foto label di setiap catatan.',
        createdAt: '2025-11-05T12:30:00Z',
        upvotes: 6,
      },
    ],
    status: 'open',
  },
];

export const availableTags: ForumTag[] = [
  'Strategi',
  'Permodalan',
  'Legalitas',
  'Digital',
  'Kemitraan',
  'Operasional',
];


