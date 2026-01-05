import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
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
  elearningPalette,
  LearningResource,
  Lesson,
  Module,
  moduleCatalog,
} from '../../constants/elearningModules';

const palette = elearningPalette;

const lessonTypeIcon: Record<Lesson['type'], keyof typeof Feather.glyphMap> = {
  Video: 'play',
  Artikel: 'file-text',
  Kuis: 'help-circle',
  Tugas: 'check-square',
};

export default function ElearningScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [activeModuleId, setActiveModuleId] = useState(moduleCatalog[0].id);
  const activeModule = moduleCatalog.find(module => module.id === activeModuleId) ?? moduleCatalog[0];

  const handleResourcePress = (resource: LearningResource) => {
    Alert.alert(
      resource.label,
      `${resource.description}\n\nSalin tautan berikut untuk mengakses materi:\n${resource.link}`,
    );
  };

  const handleStartModule = (module: Module) => {
    router.push(`/services/elearning/${module.id}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={colors.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.backText}>Kembali</Text>
            </TouchableOpacity>
            <Text style={styles.heroKicker}>Modul Pembelajaran E-Learning</Text>
            <Text style={styles.heroTitle}>Belajar Mandiri Kapan Saja dan Di Mana Saja</Text>
            <Text style={styles.heroSubtitle}>
              Akses modul interaktif yang disusun oleh KemenKopUKM. Tingkatkan kompetensi usaha Anda melalui video,
              studi kasus, dan kuis evaluasi.
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={scheme === 'dark' ? [`${colors.accent}33`, 'transparent'] : ['#E0F2FE', 'transparent']}
            style={styles.meshGradient}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="book-open" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pilih Modul Pembelajaran</Text>
          </View>
          <View style={styles.moduleList}>
            {moduleCatalog.map(module => {
              const active = module.id === activeModuleId;
              return (
                <TouchableOpacity
                  key={module.id}
                  accessibilityRole="button"
                  onPress={() => setActiveModuleId(module.id)}
                  style={[
                    styles.moduleCard,
                    {
                      borderColor: active ? colors.accent : colors.border,
                      backgroundColor: active ? `${colors.accent}12` : colors.card,
                    },
                  ]}
                >
                  <View style={styles.moduleHeader}>
                    <Text style={[styles.moduleTitle, { color: colors.text }]}>{module.title}</Text>
                    {active && (
                      <View style={[styles.activePill, { backgroundColor: `${colors.accent}1F` }]}>
                        <Feather name="check-circle" size={14} color={colors.accent} />
                        <Text style={[styles.activePillText, { color: colors.accent }]}>Dipilih</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.moduleSummary, { color: colors.subtle }]}>{module.summary}</Text>
                  <View style={styles.moduleMeta}>
                    <View style={[styles.metaPill, { borderColor: colors.border }]}>
                      <Feather name="clock" size={14} color={colors.subtle} />
                      <Text style={[styles.metaText, { color: colors.subtle }]}>{module.duration}</Text>
                    </View>
                    <View style={[styles.metaPill, { borderColor: colors.border }]}>
                      <Feather name="layers" size={14} color={colors.subtle} />
                      <Text style={[styles.metaText, { color: colors.subtle }]}>{module.level}</Text>
                    </View>
                    <View style={[styles.metaPill, { borderColor: colors.border }]}>
                      <Feather name="play-circle" size={14} color={colors.subtle} />
                      <Text style={[styles.metaText, { color: colors.subtle }]}>
                        {module.lessons.length} materi
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="monitor" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Detail Modul</Text>
          </View>

          <View style={styles.detailHeader}>
            <Text style={[styles.detailTitle, { color: colors.text }]}>{activeModule.title}</Text>
            <Text style={[styles.detailSummary, { color: colors.subtle }]}>{activeModule.summary}</Text>
            <View style={styles.detailMeta}>
              <View style={[styles.metaPill, { borderColor: colors.border }]}>
                <Feather name="clock" size={14} color={colors.accent} />
                <Text style={[styles.metaText, { color: colors.accent }]}>{activeModule.duration}</Text>
              </View>
              <View style={[styles.metaPill, { borderColor: colors.border }]}>
                <Feather name="layers" size={14} color={colors.accent} />
                <Text style={[styles.metaText, { color: colors.accent }]}>{activeModule.level}</Text>
              </View>
              <View style={[styles.metaPill, { borderColor: colors.border }]}>
                <Feather name="bookmark" size={14} color={colors.accent} />
                <Text style={[styles.metaText, { color: colors.accent }]}>
                  {activeModule.lessons.length} materi
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleStartModule(activeModule)}
            style={styles.submitWrapper}
          >
            <LinearGradient
              colors={[`${colors.accent}`, '#0284C7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Feather name="play" size={16} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Mulai Modul Sekarang</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View
            style={[
              styles.sectionDivider,
              { backgroundColor: scheme === 'dark' ? `${colors.border}80` : 'rgba(15, 23, 42, 0.1)' },
            ]}
          />

          <View>
            <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Rangkaian Materi</Text>
            <View style={styles.lessonList}>
              {activeModule.lessons.map(lesson => (
                <View key={lesson.id} style={[styles.lessonItem, { borderColor: colors.border }]}>
                  <View style={[styles.lessonBadge, { backgroundColor: `${colors.accent}12` }]}>
                    <Feather
                      name={lessonTypeIcon[lesson.type] ?? 'book'}
                      size={14}
                      color={colors.accent}
                    />
                    <Text style={[styles.lessonBadgeText, { color: colors.accent }]}>{lesson.type}</Text>
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                    <Text style={[styles.lessonSubtitle, { color: colors.subtle }]}>{lesson.description}</Text>
                  </View>
                  <View style={styles.durationWrapper}>
                    <Feather name="clock" size={14} color={colors.subtle} />
                    <Text style={[styles.durationText, { color: colors.subtle }]}>{lesson.duration}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.sectionDivider,
              { backgroundColor: scheme === 'dark' ? `${colors.border}80` : 'rgba(15, 23, 42, 0.1)' },
            ]}
          />

          <View>
            <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Hasil Pembelajaran</Text>
            <View style={styles.outcomeList}>
              {activeModule.outcomes.map(outcome => (
                <View key={outcome} style={styles.outcomeItem}>
                  <Feather name="check-circle" size={16} color={colors.accent} />
                  <Text style={[styles.outcomeText, { color: colors.text }]}>{outcome}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.sectionDivider,
              { backgroundColor: scheme === 'dark' ? `${colors.border}80` : 'rgba(15, 23, 42, 0.1)' },
            ]}
          />

          <View>
            <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Materi Pendukung</Text>
            <View style={styles.resourceList}>
              {activeModule.resources.map(resource => (
                <TouchableOpacity
                  key={resource.id}
                  accessibilityRole="button"
                  onPress={() => handleResourcePress(resource)}
                  style={[styles.resourceCard, { borderColor: colors.border }]}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: `${colors.accent}12` }]}>
                    <Feather name="file-text" size={16} color={colors.accent} />
                  </View>
                  <View style={styles.resourceText}>
                    <Text style={[styles.resourceTitle, { color: colors.text }]}>{resource.label}</Text>
                    <Text style={[styles.resourceSubtitle, { color: colors.subtle }]}>{resource.description}</Text>
                  </View>
                  <Feather name="external-link" size={16} color={colors.accent} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    gap: 20,
    paddingBottom: 48,
  },
  heroWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  hero: {
    padding: 24,
    gap: 16,
    zIndex: 1,
  },
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(219, 239, 255, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(225, 245, 255, 0.92)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    borderRadius: 32,
    borderWidth: 0,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  moduleList: {
    gap: 12,
  },
  moduleCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  moduleSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
  moduleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailHeader: {
    gap: 12,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  detailSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  submitWrapper: {
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  lessonList: {
    gap: 12,
  },
  lessonItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  lessonBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonInfo: {
    flex: 1,
    gap: 8,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  lessonSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  durationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  outcomeList: {
    gap: 10,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  outcomeText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  resourceList: {
    gap: 12,
  },
  resourceCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceText: {
    flex: 1,
    gap: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  resourceSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
});