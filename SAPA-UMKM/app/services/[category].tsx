import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';

import {
  serviceCatalog,
  type ServiceAction,
  type ServiceCategoryDetail,
} from '@/constants/servicesCatalog';

const palette = {
  light: {
    background: '#FAFBFC',
    surface: '#FFFFFF',
    text: '#1A202C',
    subtle: '#64748B',
    border: '#E2E8F0',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    subtle: '#94A3B8',
    border: '#334155',
  },
};

const findCategory = (categoryId?: string): ServiceCategoryDetail | undefined => {
  if (!categoryId) return undefined;
  return serviceCatalog.find(category => category.id === categoryId);
};

const actionVisuals: Record<string, {
  colors: string[];
  iconBG: string;
  accent: string;
  bullet: string;
}> = {
  nib: {
    colors: ['#EFF6FF', '#DBEAFE'],
    iconBG: '#3B82F6',
    accent: '#2563EB',
    bullet: 'Pastikan data perusahaan dan KTP siap sebelum memulai.',
  },
  merek: {
    colors: ['#EFF6FF', '#DBEAFE'],
    iconBG: '#3B82F6',
    accent: '#2563EB',
    bullet: 'Siapkan logo/identitas visual untuk didaftarkan.',
  },
  sertifikasi: {
    colors: ['#EFF6FF', '#DBEAFE'],
    iconBG: '#3B82F6',
    accent: '#2563EB',
    bullet: 'Pilih jenis sertifikasi (Halal, SNI, dsb) sesuai kebutuhan.',
  },
  kur: {
    colors: ['#F0FDF4', '#DCFCE7'],
    iconBG: '#22C55E',
    accent: '#16A34A',
    bullet: 'Siapkan dokumen usaha dan rencana penggunaan dana.',
  },
  umi: {
    colors: ['#F0FDF4', '#DCFCE7'],
    iconBG: '#22C55E',
    accent: '#16A34A',
    bullet: 'Program khusus untuk usaha mikro dengan proses cepat.',
  },
  lpdb: {
    colors: ['#F0FDF4', '#DCFCE7'],
    iconBG: '#22C55E',
    accent: '#16A34A',
    bullet: 'Dana bergulir untuk ekspansi usaha yang sudah berjalan.',
  },
  inkubasi: {
    colors: ['#F0FDF4', '#DCFCE7'],
    iconBG: '#22C55E',
    accent: '#16A34A',
    bullet: 'Pendampingan intensif untuk pengembangan bisnis berkelanjutan.',
  },
};

const actionRoutes: Record<string, string> = {
  nib: '/services/nib',
  merek: '/services/merek',
  sertifikasi: '/services/sertifikasi',
  kur: '/services/kur',
  umi: '/services/umi',
  lpdb: '/services/lpdb',
  inkubasi: '/services/inkubasi',
  laporan: '/services/laporan',
  profil: '/services/profil',
  forum: '/services/forum',
  'pelatihan-komunitas': '/services/pelatihan-komunitas',
  penyaluran: '/services/penyaluran',
  'pelatihan-teknis': '/services/pelatihan-teknis',
  elearning: '/services/elearning',
};

export default function ServiceDetailScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { user } = useAuth();

  const categoryDetail = useMemo(() => findCategory(params.category), [params.category]);

  if (!categoryDetail) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.emptyState}>
          <Feather name="alert-triangle" size={32} color={colors.subtle} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Kategori tidak ditemukan</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
            Kategori layanan yang Anda pilih belum tersedia. Silakan kembali dan pilih kategori lain.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.emptyButton}
          >
            <Feather name="arrow-left" size={16} color="#FFFFFF" />
            <Text style={styles.emptyButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAction = (action: ServiceAction) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const targetRoute = actionRoutes[action.id];
    if (targetRoute) {
      router.push(targetRoute as never);
      return;
    }

    Alert.alert(
      action.title,
      `${action.description}\n\nIntegrasi layanan daring akan tersedia pada tahap berikutnya.`,
    );
  };

  const renderActions = () => {
    if (categoryDetail.id === 'layanan' || categoryDetail.id === 'pemberdayaan') {
      return (
        <View style={styles.featuredList}>
          {categoryDetail.actions.map((action) => {
            const visuals = actionVisuals[action.id] ?? actionVisuals.nib;
            return (
              <View
                key={action.id}
                style={[
                  styles.featuredCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 3,
                  }
                ]}
              >
                <LinearGradient
                  colors={visuals.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.featuredGradientBar}
                />

                <View style={styles.featuredContent}>
                  <View style={styles.featuredHeader}>
                    <View style={[styles.featuredIconWrapper, { backgroundColor: visuals.iconBG }]}>
                      <Feather name={action.icon} size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.featuredTitleBlock}>
                      <Text style={[styles.featuredTitle, { color: colors.text }]}>
                        {action.title}
                      </Text>
                      <Text style={[styles.featuredSubtitle, { color: colors.subtle }]}>
                        {action.description}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.featuredBulletRow, {
                    backgroundColor: `${visuals.accent}08`,
                    borderColor: `${visuals.accent}15`,
                  }]}>
                    <Feather name="check-circle" size={14} color={visuals.accent} />
                    <Text style={[styles.featuredBulletText, { color: colors.subtle }]}>
                      {visuals.bullet}
                    </Text>
                  </View>

                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => handleAction(action)}
                    activeOpacity={0.7}
                    style={[styles.featuredButton, { backgroundColor: visuals.iconBG }]}
                  >
                    <Text style={styles.featuredButtonText}>{action.ctaLabel}</Text>
                    <Feather name="arrow-right" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      );
    }

    return categoryDetail.actions.map(action => (
      <View key={action.id} style={[styles.actionRow, {
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }]}>
        <View style={[styles.actionIcon, { backgroundColor: `${categoryDetail.accent}12` }]}>
          <Feather name={action.icon} size={18} color={categoryDetail.accent} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
          <Text style={[styles.actionDescription, { color: colors.subtle }]}>{action.description}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleAction(action)}
            activeOpacity={0.7}
            style={[styles.ctaButton, { backgroundColor: categoryDetail.accent }]}
          >
            <Text style={styles.ctaButtonText}>{action.ctaLabel}</Text>
            <Feather name="arrow-right" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Hero Section */}
        <LinearGradient
          colors={[`${categoryDetail.accent}`, `${categoryDetail.accent}E6`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative Background Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={16} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Feather name={categoryDetail.icon} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.heroTitle}>{categoryDetail.title}</Text>
            <Text style={styles.heroSubtitle}>{categoryDetail.summary}</Text>
            <Text style={styles.heroDescription}>{categoryDetail.description}</Text>
          </View>
        </LinearGradient>

        {/* Services Card */}
        <View style={[styles.card, {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Layanan yang tersedia</Text>
            <View style={[styles.badge, { backgroundColor: `${categoryDetail.accent}15` }]}>
              <Text style={[styles.badgeText, { color: categoryDetail.accent }]}>
                {categoryDetail.actions.length}
              </Text>
            </View>
          </View>
          {renderActions()}
        </View>

        {/* Tips Card */}
        <View style={[styles.card, {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }]}>
          <View style={styles.cardHeader}>
            <Feather name="info" size={18} color={categoryDetail.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Tips pengajuan</Text>
          </View>
          {categoryDetail.tips.map((tip, index) => (
            <View key={tip} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: categoryDetail.accent }]} />
              <Text style={[styles.tipText, { color: colors.subtle }]}>{tip}</Text>
            </View>
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
    padding: 20,
    gap: 20,
    paddingBottom: 32,
  },
  hero: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -80,
    right: -60,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -40,
    left: -40,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroContent: {
    gap: 14,
    zIndex: 1,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginTop: 2,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: {
    flex: 1,
    gap: 8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  ctaButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginTop: 12,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  featuredList: {
    gap: 16,
    marginTop: 12,
  },
  featuredCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  featuredGradientBar: {
    height: 4,
  },
  featuredContent: {
    padding: 20,
    gap: 16,
  },
  featuredHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featuredIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTitleBlock: {
    flex: 1,
    gap: 4,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  featuredSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  featuredBulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  featuredBulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
