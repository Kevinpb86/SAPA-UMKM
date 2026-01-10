import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
  background: string;
};

type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: FeatherIconName;
  accent: string;
  items: string[];
};

const quickActions: QuickAction[] = [
  {
    id: 'izin',
    title: 'Ajukan Izin',
    subtitle: 'NIB & legalitas',
    icon: 'file-text',
    background: '#E6F0FF',
  },
  {
    id: 'brand',
    title: 'Kelola Merek',
    subtitle: 'Pendaftaran & manajemen',
    icon: 'tag',
    background: '#F1EBFF',
  },
  {
    id: 'sertifikasi',
    title: 'Cek Sertifikasi',
    subtitle: 'Halal, SNI, dsb',
    icon: 'award',
    background: '#EFFFF6',
  },
  {
    id: 'kur',
    title: 'Program KUR',
    subtitle: 'Ajukan bantuan modal',
    icon: 'credit-card',
    background: '#FFF3E6',
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    id: 'layanan',
    title: 'A. Layanan Publik & Perizinan',
    description: 'Pengajuan dan manajemen legalitas usaha',
    icon: 'shield',
    accent: '#E6F0FF',
    items: [
      'Pengajuan dan pembaruan Izin Usaha (NIB).',
      'Registrasi dan manajemen Merek Produk.',
      'Pengajuan Sertifikasi (Halal, SNI, dsb).',
    ],
  },
  {
    id: 'pemberdayaan',
    title: 'B. Program Pemberdayaan Pemerintah',
    description: 'Pendaftaran dan akses program bantuan',
    icon: 'layers',
    accent: '#FFF3E6',
    items: [
      'Pendaftaran Program KUR (Kredit Usaha Rakyat).',
      'Pendaftaran Program UMi (Pembiayaan Ultra Mikro).',
      'Pendaftaran Program LPDB (Dana Bergulir).',
      'Informasi dan pendaftaran Program Inkubasi/Bimbingan.',
    ],
  },
  {
    id: 'pelaporan',
    title: 'C. Pelaporan & Data Usaha',
    description: 'Pengelolaan data dan kewajiban laporan',
    icon: 'pie-chart',
    accent: '#F1EBFF',
    items: [
      'Pelaporan kegiatan dan perkembangan usaha ke pemerintah.',
      'Pembaruan data profil UMKM (skala usaha, alamat, dsb).',
    ],
  },
  {
    id: 'komunitas',
    title: 'D. Komunitas & Jaringan',
    description: 'Komunikasi dan peningkatan kapasitas bersama',
    icon: 'users',
    accent: '#EFFFF6',
    items: [
      'Forum komunikasi/diskusi antar pelaku UMKM.',
      'Pendaftaran pelatihan anggota komunitas (non-pemerintah).',
      'Akses informasi penyaluran program dari KemenKopUKM.',
    ],
  },
  {
    id: 'kompetensi',
    title: 'E. Peningkatan Kompetensi',
    description: 'Akses ke materi dan program pelatihan',
    icon: 'book-open',
    accent: '#FFEFF5',
    items: [
      'Pendaftaran pelatihan teknis dan manajemen dari KemenKopUKM.',
      'Modul pembelajaran E-Learning (mandiri).',
    ],
  },
];

const palette = {
  light: {
    background: '#F2F5FA',
    primary: '#1B5CC4',
    primaryGradient: ['#1C60D4', '#1343A3'],
    heroGlow: '#FFFFFF20',
    text: '#0F1B3A',
    subtle: '#5E6B85',
    card: '#FFFFFF',
    border: '#E1E6F0',
    pill: 'rgba(255, 255, 255, 0.25)',
  },
  dark: {
    background: '#0F172A',
    primary: '#2563EB',
    primaryGradient: ['#1E3A8A', '#1D4ED8'],
    heroGlow: '#2563EB1A',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    card: '#1E293B',
    border: '#273449',
    pill: 'rgba(148, 163, 184, 0.12)',
  },
};

const navigateToService = (
  router: ReturnType<typeof useRouter>,
  categoryId: string,
) => {
  router.push({ pathname: '/services/[category]', params: { category: categoryId } });
};

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        bounces={false}
      >
        <LinearGradient
          colors={colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <View style={styles.heroHeader}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/login')}
              style={[styles.heroActionButton, styles.loginButton]}>
              <Feather name="log-in" size={16} color="#FFFFFF" />
              <Text style={[styles.heroActionButtonText, styles.heroActionButtonTextInverse]}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/register')}
              style={[styles.heroActionButton, styles.registerButton]}>
              <Feather name="user-plus" size={16} color={colors.primary} />
              <Text style={styles.heroActionButtonText}>Daftar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroContent}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroKicker}>Halo, Pelaku UMKM!</Text>
              <Text style={styles.heroTitle}>SAPA UMKM</Text>
              <Text style={styles.heroSubtitle}>
                Satu pintu layanan digital yang merangkum legalitas usaha, akses pembiayaan resmi,
                pendampingan komunitas, dan pembelajaran kompetensi dalam satu dasbor terpadu.
              </Text>
              <View style={styles.heroPillRow}>
                <View style={[styles.heroPill, { backgroundColor: colors.pill }]}>
                  <Feather name="zap" size={16} color="#FFFFFF" />
                  <Text style={styles.heroPillText}>Legalitas lebih cepat</Text>
                </View>
                <View style={[styles.heroPill, { backgroundColor: colors.pill }]}>
                  <Feather name="target" size={16} color="#FFFFFF" />
                  <Text style={styles.heroPillText}>Program terkurasi</Text>
                </View>
                <View style={[styles.heroPill, { backgroundColor: colors.pill }]}>
                  <Feather name="globe" size={16} color="#FFFFFF" />
                  <Text style={styles.heroPillText}>Pembelajaran daring</Text>
                </View>
              </View>
            </View>
            <View style={styles.heroVisualWrapper}>
              <View style={[styles.heroVisualGlow, { backgroundColor: colors.heroGlow }]} />
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.heroImage}
                contentFit="contain"
              />
            </View>
          </View>
          <View style={styles.heroStatsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Feather name="layers" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>120+</Text>
              <Text style={styles.statLabel}>Program aktif</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Feather name="users" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>35K</Text>
              <Text style={styles.statLabel}>UMKM terbantu</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Feather name="headphones" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Dukungan daring</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Aksi Cepat</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
              Selesaikan kebutuhan utama Anda dalam hitungan menit.
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionRow}>
            {quickActions.map(action => (
              <View key={action.id} style={[styles.quickActionCard, { backgroundColor: action.background }]}>
                <View style={styles.quickIcon}>
                  <Feather name={action.icon} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.quickTitle, { color: colors.text }]}>{action.title}</Text>
                <Text style={[styles.quickSubtitle, { color: colors.subtle }]}>{action.subtitle}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {user && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Program & Layanan
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                Jelajahi layanan resmi dan komunitas untuk mendukung perjalanan usaha Anda.
              </Text>
            </View>
            {serviceCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                onPress={() => navigateToService(router, category.id)}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIconWrapper, { backgroundColor: category.accent }]}>
                    <Feather name={category.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.categoryText}>
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                    <Text style={[styles.categoryDescription, { color: colors.subtle }]}>
                      {category.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.featureList}>
                  {category.items.map(item => (
                    <View key={item} style={styles.featureItem}>
                      <Feather name="check-circle" size={18} color={colors.primary} />
                      <Text style={[styles.featureText, { color: colors.text }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 28,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  heroActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(15, 27, 58, 0.2)',
  },
  loginButton: {
    backgroundColor: 'rgba(15, 27, 58, 0.2)',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  heroActionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1B3A',
  },
  heroActionButtonTextInverse: {
    color: '#FFFFFF',
  },
  heroTextBlock: {
    width: '100%',
    gap: 10,
  },
  heroKicker: {
    color: '#CFE5FF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.92)',
    fontSize: 15,
    lineHeight: 22,
  },
  heroPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    gap: 6,
    backgroundColor: 'rgba(15, 27, 58, 0.22)',
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  heroImage: {
    width: 104,
    height: 104,
  },
  heroVisualWrapper: {
    position: 'relative',
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  heroVisualGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    opacity: 0.4,
  },
  heroStatsRow: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: '#E0ECFF',
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionRow: {
    paddingRight: 8,
    gap: 16,
  },
  quickActionCard: {
    width: 180,
    borderRadius: 20,
    padding: 16,
    marginRight: 8,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F1B3A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  quickSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
  },
  featureList: {
    marginTop: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  previewContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  previewHeader: {
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
