import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

const palette = {
  light: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    primary: '#1B5CC4',
    accent: '#15B79F',
    text: '#0F1B3A',
    subtle: '#66728F',
    border: '#E1E6F3',
    badge: 'rgba(27, 92, 196, 0.12)',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',
    accent: '#34D399',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    border: '#273449',
    badge: 'rgba(59, 130, 246, 0.16)',
  },
};

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type QuickLink = {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
  targetCategory: ServiceCategory['id'];
};

type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: FeatherIconName;
  items: string[];
};

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
};

const quickLinks: QuickLink[] = [
  {
    id: 'nib',
    title: 'Status Izin Usaha',
    subtitle: 'Pantau NIB & legalitas',
    icon: 'file-text',
    targetCategory: 'layanan',
  },
  {
    id: 'brand',
    title: 'Manajemen Merek',
    subtitle: 'Kelola sertifikat merek',
    icon: 'tag',
    targetCategory: 'layanan',
  },
  {
    id: 'program',
    title: 'Ajukan Program KUR',
    subtitle: 'Simulasi dan pengajuan',
    icon: 'credit-card',
    targetCategory: 'pemberdayaan',
  },
  {
    id: 'inkubasi',
    title: 'Program Inkubasi',
    subtitle: 'Mentor & bimbingan',
    icon: 'compass',
    targetCategory: 'pemberdayaan',
  },
  {
    id: 'report',
    title: 'Pelaporan Usaha',
    subtitle: 'Upload laporan perkembangan',
    icon: 'pie-chart',
    targetCategory: 'pelaporan',
  },
  {
    id: 'community',
    title: 'Forum Komunitas',
    subtitle: 'Diskusi antar UMKM',
    icon: 'users',
    targetCategory: 'komunitas',
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    id: 'layanan',
    title: 'A. Layanan Publik & Perizinan',
    description: 'Permohonan legalitas usaha Anda.',
    icon: 'shield',
    items: [
      'Pengajuan & pembaruan NIB.',
      'Registrasi dan manajemen merek produk.',
      'Pengajuan sertifikasi (Halal, SNI, dsb).',
    ],
  },
  {
    id: 'pemberdayaan',
    title: 'B. Program Pemberdayaan Pemerintah',
    description: 'Akses bantuan pembiayaan dan pendampingan.',
    icon: 'layers',
    items: [
      'Pendaftaran Program KUR, UMi, dan LPDB.',
      'Informasi program inkubasi & bimbingan.',
      'Panduan kelayakan dan dokumen persyaratan.',
    ],
  },
  {
    id: 'pelaporan',
    title: 'C. Pelaporan & Data Usaha',
    description: 'Kelola kewajiban pelaporan usaha.',
    icon: 'bar-chart-2',
    items: [
      'Pelaporan kegiatan dan perkembangan ke pemerintah.',
      'Pembaruan data profil UMKM (skala usaha, alamat, dsb).',
    ],
  },
  {
    id: 'komunitas',
    title: 'D. Komunitas & Jaringan',
    description: 'Bangun relasi dan kolaborasi.',
    icon: 'message-circle',
    items: [
      'Forum komunikasi dan diskusi antar pelaku UMKM.',
      'Pendaftaran pelatihan anggota komunitas non-pemerintah.',
      'Informasi penyaluran program KemenKopUKM.',
    ],
  },
  {
    id: 'kompetensi',
    title: 'E. Peningkatan Kompetensi',
    description: 'Perluas pengetahuan dengan materi pelatihan.',
    icon: 'book-open',
    items: [
      'Pendaftaran pelatihan teknis & manajemen dari KemenKopUKM.',
      'Modul pembelajaran mandiri E-Learning.',
    ],
  },
];

const timeline: TimelineItem[] = [
  {
    id: 'step-1',
    title: 'Lengkapi Profil UMKM',
    description: 'Isi data usaha dan unggah dokumen legalitas penting.',
    status: 'completed',
  },
  {
    id: 'step-2',
    title: 'Ajukan Program Bantuan',
    description: 'Pilih program (KUR/UMi/LPDB) yang sesuai kebutuhan modal.',
    status: 'in-progress',
  },
  {
    id: 'step-3',
    title: 'Ikuti Pelatihan Kompetensi',
    description: 'Tingkatkan skill dengan modul pelatihan terkini.',
    status: 'upcoming',
  },
];

export default function UserDashboardScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'community'>('overview');
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  const accountLabel =
    user.displayName ||
    user.profile?.ownerName ||
    user.profile?.businessName ||
    user.email;
  const accountInitial = accountLabel.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleComingSoon = (title: string) => {
    Alert.alert(title, 'Fitur lengkap segera tersedia.');
  };

  const handleNavigateToService = (categoryId: string) => {
    router.push({ pathname: '/services/[category]', params: { category: categoryId } });
  };

  const statBadges = [
    { label: 'Program Aktif', value: '4', icon: 'layers' as FeatherIconName, accent: '#38BDF8' },
    { label: 'Tugas Minggu Ini', value: '2', icon: 'check-square' as FeatherIconName, accent: '#FACC15' },
    { label: 'Diskusi Terbaru', value: '8', icon: 'message-circle' as FeatherIconName, accent: '#A855F7' },
  ];

  const profileDetails = [
    { label: 'Email Akun', value: user.email },
    { label: 'Nama Pemilik', value: user.profile?.ownerName },
    { label: 'Nama Usaha', value: user.profile?.businessName },
    { label: 'Sektor Usaha', value: user.profile?.sector },
    { label: 'Kode KBLI', value: user.profile?.kbli },
    {
      label: 'Alamat Usaha',
      value: [user.profile?.businessAddress, user.profile?.city].filter(Boolean).join(', '),
    },
    { label: 'Kontak Telepon', value: user.profile?.phone },
    { label: 'Kontak Email', value: user.profile?.contactEmail },
    { label: 'Skala Usaha', value: user.profile?.scale },
    { label: 'Estimasi Modal', value: user.profile?.capital },
    { label: 'Jumlah Tenaga Kerja', value: user.profile?.employees },
    { label: 'Deskripsi Usaha', value: user.profile?.businessDescription },
    { label: 'Kebutuhan Dukungan', value: user.profile?.supportNeeds },
  ].filter(detail => detail.value && detail.value.toString().trim().length > 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={scheme === 'dark' ? ['#1E3A8A', '#1E1B4B'] : ['#1D4ED8', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroDecorationOne} />
          <View style={styles.heroDecorationTwo} />

          <View style={styles.heroTopBar}>
            <View style={styles.heroUserInfo}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>
                  {accountInitial || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.heroUserLabel}>Akun</Text>
                <Text style={styles.heroUserName}>{accountLabel}</Text>
              </View>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Feather name="log-out" size={16} color={colors.primary} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroHeader}>
            <View style={styles.heroHeadline}>
              <Text style={styles.heroGreeting}>Selamat datang kembali 👋</Text>
              <Text style={styles.heroTitle}>Dashboard UMKM Anda</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Kelola legalitas, akses bantuan pemerintah, dan ikuti pelatihan untuk menumbuhkan usaha secara berkelanjutan.
            </Text>
          </View>

          <View style={styles.heroStatsRow}>
            {statBadges.map(badge => (
              <LinearGradient
                key={badge.label}
                colors={[`${badge.accent}33`, `${badge.accent}12`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View
                  style={[styles.statIconWrapper, { backgroundColor: `${badge.accent}30` }]}
                >
                  <Feather name={badge.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{badge.value}</Text>
                <Text style={styles.statLabel}>{badge.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </LinearGradient>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profil Akun & Usaha</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Data berikut diambil dari proses registrasi dan pembaruan profil terbaru.
          </Text>
          {profileDetails.length > 0 ? (
            <View style={styles.detailGrid}>
              {profileDetails.map(detail => (
                <View key={detail.label} style={[styles.detailItem, { borderColor: colors.border }]}>
                  <Text style={[styles.detailLabel, { color: colors.subtle }]}>{detail.label}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{detail.value}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.detailEmpty}>
              <Feather name="info" size={16} color={colors.subtle} />
              <Text style={[styles.detailEmptyText, { color: colors.subtle }]}>
                Belum ada data profil. Perbarui profil usaha Anda pada menu layanan.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tabContainer}>
          {[
            { key: 'overview', label: 'Ringkasan' },
            { key: 'services', label: 'Layanan' },
            { key: 'community', label: 'Komunitas' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
              style={[
                styles.tabButton,
                activeTab === tab.key && { backgroundColor: colors.badge },
              ]}>
              <Text
                style={[
                  styles.tabButtonText,
                  { color: activeTab === tab.key ? colors.primary : colors.subtle },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Aksi Cepat</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Pilih layanan yang paling sering Anda gunakan.
          </Text>
          <View style={styles.quickGrid}>
            {quickLinks.map(link => (
              <TouchableOpacity
                key={link.id}
                accessibilityRole="button"
                onPress={() => handleNavigateToService(link.targetCategory)}
                style={[styles.quickCard, { borderColor: colors.border, backgroundColor: scheme === 'dark' ? '#223047' : '#F7F9FD' }]}>
                <View style={styles.quickIconWrapper}>
                  <Feather name={link.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.quickTitle, { color: colors.text }]}>{link.title}</Text>
                <Text style={[styles.quickSubtitle, { color: colors.subtle }]}>{link.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Langkah Perkembangan</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Ikuti alur berikut untuk memastikan usaha Anda berkembang maksimal.
          </Text>
          <View style={styles.timeline}>
            {timeline.map(step => (
              <View
                key={step.id}
                style={[
                  styles.timelineItem,
                  {
                    borderColor: colors.border,
                    backgroundColor: scheme === 'dark' ? '#1E293B' : '#F9FAFB',
                  },
                ]}
              >
                <View
                  style={[
                    styles.timelineIndicator,
                    step.status === 'completed' && styles.timelineIndicatorCompleted,
                    step.status === 'in-progress' && styles.timelineIndicatorProgress,
                    step.status === 'upcoming' && {
                      backgroundColor:
                        scheme === 'dark' ? 'rgba(148, 163, 184, 0.18)' : 'rgba(150, 163, 187, 0.18)',
                    },
                  ]}
                >
                  <Feather
                    name={
                      step.status === 'completed'
                        ? 'check'
                        : step.status === 'in-progress'
                        ? 'activity'
                        : 'circle'
                    }
                    size={16}
                    color={step.status === 'upcoming' ? colors.subtle : '#FFFFFF'}
                  />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.timelineDescription, { color: colors.subtle }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Layanan & Program</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Jelajahi dukungan komprehensif SAPA UMKM berdasarkan kategori.
          </Text>
          {serviceCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.88}
              onPress={() => handleNavigateToService(category.id)}
              style={[styles.categoryCard, { borderColor: colors.border }]}> 
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconWrapper}>
                  <Feather name={category.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.categoryTexts}>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                  <Text style={[styles.categoryDescription, { color: colors.subtle }]}>
                    {category.description}
                  </Text>
                </View>
              </View>
              <View style={styles.categoryItems}>
                {category.items.map(item => (
                  <View key={item} style={styles.categoryItemRow}>
                    <Feather name="check-circle" size={16} color={colors.accent} />
                    <Text style={[styles.categoryItemText, { color: colors.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroDecorationOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -80,
    right: -60,
  },
  heroDecorationTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -70,
    left: -40,
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroUserLabel: {
    color: '#E2EBFF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#0F1B3A',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  logoutButtonText: {
    color: '#0F1B3A',
    fontSize: 13,
    fontWeight: '700',
  },
  heroHeader: {
    gap: 12,
  },
  heroHeadline: {
    gap: 4,
  },
  heroGreeting: {
    color: '#CFE5FF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(233, 244, 255, 0.9)',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(27, 92, 196, 0.07)',
    borderRadius: 999,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexBasis: '48%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
    backgroundColor: 'rgba(27,92,196,0.04)',
  },
  detailLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  detailEmpty: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(27,92,196,0.04)',
  },
  detailEmptyText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    backgroundColor: '#F7F9FD',
  },
  quickIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  quickSubtitle: {
    fontSize: 13,
    color: '#5E6B85',
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  timelineIndicator: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 163, 187, 0.18)',
  },
  timelineIndicatorCompleted: {
    backgroundColor: '#22C55E',
  },
  timelineIndicatorProgress: {
    backgroundColor: '#F97316',
  },
  timelineContent: {
    flex: 1,
    gap: 6,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  timelineDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(27,92,196,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTexts: {
    flex: 1,
    gap: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryDescription: {
    fontSize: 13,
  },
  categoryItems: {
    gap: 10,
  },
  categoryItemRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  categoryItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
