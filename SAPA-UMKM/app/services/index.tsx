import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
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

import {
  heroHighlights,
  serviceCatalog,
  type ServiceAction,
  type ServiceCategoryDetail,
} from '@/constants/servicesCatalog';

const palette = {
  light: {
    background: '#EEF3FF',
    surface: '#FFFFFF',
    text: '#0C1A3A',
    subtle: '#5F6C8F',
    border: '#D6E0F5',
    primary: '#1A4ED8',
    accent: '#14B8A6',
    pill: 'rgba(26, 78, 216, 0.14)',
    heroTop: ['#1A4ED8', '#4C1FD4'],
    heroBottom: ['#1A6885', '#166534'],
  },
  dark: {
    background: '#0B1224',
    surface: '#111C32',
    text: '#F9FAFB',
    subtle: '#94A3B8',
    border: '#1F2A40',
    primary: '#3B82F6',
    accent: '#22D3EE',
    pill: 'rgba(59, 130, 246, 0.16)',
    heroTop: ['#1E293B', '#0F172A'],
    heroBottom: ['#0B4080', '#064E3B'],
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

const getInitialCategory = (categoryParam?: string) => {
  const fallback = serviceCatalog[0]?.id ?? 'layanan';
  if (!categoryParam) return fallback;
  const match = serviceCatalog.find(category => category.id === categoryParam);
  return match ? match.id : fallback;
};

export default function ServicesScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [activeCategory, setActiveCategory] = useState<string>(getInitialCategory(params.category));

  useEffect(() => {
    if (params.category) {
      setActiveCategory(getInitialCategory(params.category));
    }
  }, [params.category]);

  const categoryDetail = useMemo(
    () => serviceCatalog.find(category => category.id === activeCategory) ?? serviceCatalog[0],
    [activeCategory],
  );

  const openCategoryDetail = (categoryId: string) => {
    router.push({ pathname: '/services/[category]', params: { category: categoryId } });
  };

  const handleAction = (category: ServiceCategoryDetail, action: ServiceAction) => {
    const targetRoute = actionRoutes[action.id];
    if (targetRoute) {
      router.push(targetRoute as never);
      return;
    }

    Alert.alert(action.title, `${action.description}\n\nIntegrasi layanan daring akan tersedia pada tahap berikutnya.`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={colors.heroTop}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}>
            <View style={styles.heroTopRow}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={[styles.backButton, { borderColor: 'rgba(255,255,255,0.35)' }]}
              >
                <Feather name="arrow-left" size={18} color="#FFFFFF" />
                <Text style={[styles.backText, { color: '#FFFFFF' }]}>Kembali</Text>
              </TouchableOpacity>
              <View style={styles.heroBadge}>
                <Feather name="sparkles" size={16} color="#FACC15" />
                <Text style={styles.heroBadgeText}>Portal Layanan Terpadu</Text>
              </View>
            </View>

            <Text style={styles.heroHeading}>Kompas Layanan UMKM</Text>
            <Text style={styles.heroSubheading}>
              Telusuri seluruh program legalitas, pendanaan, pelaporan, komunitas, dan pengembangan kompetensi secara terpadu di SAPA UMKM.
            </Text>

            <View style={styles.heroHighlightRow}>
              {heroHighlights.map(highlight => (
                <View
                  key={highlight.id}
                  style={[
                    styles.heroHighlightCard,
                    {
                      backgroundColor:
                        scheme === 'dark' ? 'rgba(255,255,255,0.08)' : highlight.accent,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.heroHighlightIcon,
                      {
                        backgroundColor:
                          scheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.7)',
                      },
                    ]}
                  >
                    <Feather
                      name={highlight.icon}
                      size={16}
                      color={scheme === 'dark' ? '#FFFFFF' : colors.primary}
                    />
                  </View>
                  <Text style={[styles.heroHighlightValue, { color: scheme === 'dark' ? '#FFFFFF' : colors.text }]}>
                    {highlight.value}
                  </Text>
                  <Text
                    style={[
                      styles.heroHighlightLabel,
                      { color: scheme === 'dark' ? 'rgba(255,255,255,0.72)' : colors.text },
                    ]}
                  >
                    {highlight.label}
                  </Text>
                </View>
              ))}
            </View>

            <LinearGradient
              colors={colors.heroBottom}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroActiveContainer}>
              <View style={styles.heroActiveLeft}>
                <View
                  style={[
                    styles.heroActiveIcon,
                    {
                      backgroundColor: `${categoryDetail.accent}26`,
                      borderColor: `${categoryDetail.accent}44`,
                    },
                  ]}
                >
                  <Feather name={categoryDetail.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.heroActiveCopy}>
                  <Text style={styles.heroActiveLabel}>Sorotan kategori</Text>
                  <Text style={styles.heroActiveTitle}>{categoryDetail.title.replace(/^[A-E]\.\s/, '')}</Text>
                  <Text style={styles.heroActiveDescription}>{categoryDetail.summary}</Text>
                </View>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => openCategoryDetail(categoryDetail.id)}
                style={styles.heroActiveButton}>
                <Text style={styles.heroActiveButtonText}>Buka halaman detail</Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>

        <View style={styles.categoryRail}>
          {serviceCatalog.map(category => {
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                accessibilityRole="button"
                onPress={() => setActiveCategory(category.id)}
                style={[
                  styles.categoryChip,
                  {
                    borderColor: isActive ? `${category.accent}80` : colors.border,
                    backgroundColor: isActive ? `${category.accent}1A` : 'transparent',
                  },
                ]}
              >
                <View
                  style={[
                    styles.categoryChipIcon,
                    {
                      backgroundColor: isActive
                        ? category.accent
                        : scheme === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : colors.pill,
                    },
                  ]}
                >
                  <Feather
                    name={category.icon}
                    size={16}
                    color={isActive ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryChipLabel,
                    { color: isActive ? colors.text : colors.subtle },
                  ]}
                >
                  {category.title.replace(/^[A-E]\.\s/, '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.surface,
              borderColor: `${categoryDetail.accent}33`,
              shadowColor: `${categoryDetail.accent}33`,
            },
          ]}
        >
          <View style={[styles.sectionAccent, { backgroundColor: categoryDetail.accent }]} />
          <View style={styles.sectionHeaderRow}>
            <View
              style={[styles.sectionIcon, { backgroundColor: `${categoryDetail.accent}1A` }]}
            >
              <Feather name={categoryDetail.icon} size={18} color={categoryDetail.accent} />
            </View>
            <View style={styles.sectionHeaderCopy}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {categoryDetail.title}
              </Text>
              <Text style={[styles.sectionSummary, { color: colors.subtle }]}>
                {categoryDetail.summary}
              </Text>
            </View>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.subtle }]}>
            {categoryDetail.description}
          </Text>

          <View style={styles.actionList}>
            {categoryDetail.actions.map(action => (
              <View
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    borderColor: `${categoryDetail.accent}33`,
                    backgroundColor: scheme === 'dark' ? 'rgba(17,28,50,0.65)' : '#F9FBFF',
                  },
                ]}
              >
                <View
                  style={[
                    styles.actionIconWrapper,
                    {
                      backgroundColor: `${categoryDetail.accent}1F`,
                      borderColor: `${categoryDetail.accent}33`,
                    },
                  ]}
                >
                  <Feather name={action.icon} size={20} color={categoryDetail.accent} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                  <Text style={[styles.actionDescription, { color: colors.subtle }]}>
                    {action.description}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handleAction(categoryDetail, action)}
                  style={[styles.actionButton, { backgroundColor: categoryDetail.accent }]}>
                  <Text style={styles.actionButtonText}>{action.ctaLabel}</Text>
                  <Feather name="arrow-up-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.tipCard,
              {
                backgroundColor: scheme === 'dark' ? 'rgba(15,23,42,0.65)' : '#F4F7FB',
                borderColor: `${categoryDetail.accent}29`,
              },
            ]}
          >
            <View
              style={[styles.tipIconWrapper, { backgroundColor: `${categoryDetail.accent}1A` }]}
            >
              <Feather name="info" size={18} color={categoryDetail.accent} />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>Tips pengajuan</Text>
              {categoryDetail.tips.map(tip => (
                <Text key={tip} style={[styles.tipText, { color: colors.subtle }]}>
                  • {tip}
                </Text>
              ))}
            </View>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => openCategoryDetail(categoryDetail.id)}
            style={[styles.detailLinkButton, { borderColor: `${categoryDetail.accent}55` }]}
          >
            <Text style={[styles.detailLinkText, { color: categoryDetail.accent }]}>Lihat seluruh layanan kategori ini</Text>
            <Feather name="arrow-up-right" size={16} color={categoryDetail.accent} />
          </TouchableOpacity>
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
    paddingBottom: 48,
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: 'rgba(26, 78, 216, 0.4)',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroGradient: {
    padding: 24,
    gap: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroHeading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroSubheading: {
    color: 'rgba(255, 255, 255, 0.84)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroHighlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroHighlightCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  heroHighlightIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHighlightValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  heroHighlightLabel: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  heroActiveContainer: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  heroActiveLeft: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  heroActiveIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroActiveCopy: {
    flex: 1,
    gap: 4,
  },
  heroActiveLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroActiveTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroActiveDescription: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 13,
    lineHeight: 18,
  },
  heroActiveButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  heroActiveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryRail: {
    marginTop: 28,
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryChipIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipLabel: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  sectionCard: {
    marginTop: 28,
    marginHorizontal: 20,
    borderRadius: 26,
    borderWidth: 1,
    padding: 24,
    gap: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  sectionAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSummary: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionList: {
    gap: 18,
  },
  actionCard: {
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    alignItems: 'flex-start',
  },
  actionIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    gap: 6,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  tipIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
    gap: 6,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  detailLinkButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
