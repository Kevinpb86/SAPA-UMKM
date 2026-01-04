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
    background: '#F3F6FE',
    surface: '#FFFFFF',
    text: '#0C1A3A',
    subtle: '#5F6C8F',
    border: '#D9E3F6',
  },
  dark: {
    background: '#0B1224',
    surface: '#131D34',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    border: '#1F2A40',
  },
};

const findCategory = (categoryId?: string): ServiceCategoryDetail | undefined => {
  if (!categoryId) return undefined;
  return serviceCatalog.find(category => category.id === categoryId);
};

const actionVisuals: Record<string, { colors: string[]; iconBG: string; accent: string; bullet: string }> = {
  nib: {
    colors: ['#F4F8FF', '#E0ECFF'],
    iconBG: '#1D4ED8',
    accent: '#1D4ED8',
    bullet: 'Pastikan data perusahaan dan KTP siap sebelum memulai.',
  },
  merek: {
    colors: ['#F5F3FF', '#ECE7FF'],
    iconBG: '#7C3AED',
    accent: '#7C3AED',
    bullet: 'Siapkan logo/identitas visual untuk didaftarkan.',
  },
  sertifikasi: {
    colors: ['#F0FBF7', '#DEF7EC'],
    iconBG: '#047857',
    accent: '#047857',
    bullet: 'Pilih jenis sertifikasi (Halal, SNI, dsb) sesuai kebutuhan.',
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
    if (categoryDetail.id === 'layanan') {
      return (
        <View style={styles.featuredList}>
          {categoryDetail.actions.map(action => {
            const visuals = actionVisuals[action.id] ?? actionVisuals.nib;
            return (
              <LinearGradient
                key={action.id}
                colors={visuals.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredCard}
              >
                <View style={styles.featuredHeader}>
                  <View style={[styles.featuredIconWrapper, { backgroundColor: visuals.iconBG }]}
                  >
                    <Feather name={action.icon} size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.featuredTitleBlock}>
                    <Text style={[styles.featuredTitle, { color: visuals.iconBG }]}>{action.title}</Text>
                    <Text style={[styles.featuredSubtitle, { color: '#4A5878' }]}>
                      {action.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.featuredBulletRow}>
                  <Feather name="check-circle" size={16} color={visuals.accent} />
                  <Text style={[styles.featuredBulletText, { color: '#4A5878' }]}>{visuals.bullet}</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handleAction(action)}
                  style={[styles.featuredButton, { backgroundColor: visuals.iconBG }]}>
                  <Text style={styles.featuredButtonText}>{action.ctaLabel}</Text>
                  <Feather name="arrow-up-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </View>
      );
    }

    return categoryDetail.actions.map(action => (
      <View key={action.id} style={[styles.actionRow, { borderColor: colors.border }]}>
        <View style={[styles.actionIcon, { backgroundColor: `${categoryDetail.accent}1A` }]}
        >
          <Feather name={action.icon} size={18} color={categoryDetail.accent} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
          <Text style={[styles.actionDescription, { color: colors.subtle }]}>{action.description}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleAction(action)}
            style={[styles.ctaButton, { backgroundColor: categoryDetail.accent }]}
          >
            <Text style={styles.ctaButtonText}>{action.ctaLabel}</Text>
            <Feather name="arrow-up-right" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[`${categoryDetail.accent}FF`, `${categoryDetail.accent}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: 'rgba(255,255,255,0.35)' }]}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.heroHeader}>
            <View style={styles.heroIconWrapper}>
              <Feather name={categoryDetail.icon} size={24} color={categoryDetail.accent} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>{categoryDetail.title}</Text>
              <Text style={styles.heroSubtitle}>{categoryDetail.summary}</Text>
            </View>
          </View>

          <Text style={styles.heroDescription}>{categoryDetail.description}</Text>
        </LinearGradient>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Layanan yang tersedia</Text>
          <View style={styles.divider} />
          {renderActions()}
        </View>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tips pengajuan</Text>
          <View style={styles.divider} />
          {categoryDetail.tips.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Feather name="check-circle" size={16} color={categoryDetail.accent} />
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
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  heroIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: {
    flex: 1,
    gap: 8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredList: {
    gap: 16,
  },
  featuredCard: {
    borderRadius: 22,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(29, 78, 216, 0.08)',
  },
  featuredHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  featuredIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTitleBlock: {
    flex: 1,
    gap: 6,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  featuredSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  featuredBulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  featuredBulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  featuredButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
