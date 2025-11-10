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
  View,
} from 'react-native';

import {
  Lesson,
  LearningResource,
  elearningPalette,
  moduleCatalog,
} from '../../../constants/elearningModules';

const lessonTypeIcon: Record<Lesson['type'], keyof typeof Feather.glyphMap> = {
  Video: 'play',
  Artikel: 'file-text',
  Kuis: 'help-circle',
  Tugas: 'check-square',
};

export default function ElearningModuleScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId?: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? elearningPalette.dark : elearningPalette.light;

  const module = useMemo(
    () => moduleCatalog.find(entry => entry.id === moduleId),
    [moduleId],
  );

  const handleResourcePress = (resource: LearningResource) => {
    Alert.alert(
      resource.label,
      `${resource.description}\n\nSalin tautan berikut untuk mengakses materi:\n${resource.link}`,
    );
  };

  const handleStartLesson = (lesson: Lesson) => {
    Alert.alert(
      lesson.title,
      'Integrasikan pemutar video atau halaman materi khusus untuk membuka konten pembelajaran.',
    );
  };

  if (!module) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconWrapper, { backgroundColor: `${colors.accent}12` }]}>
            <Feather name="alert-triangle" size={24} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Modul tidak ditemukan</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
            Kami tidak dapat menemukan modul yang Anda pilih. Silakan kembali dan pilih modul lainnya.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={[styles.secondaryButton, { borderColor: colors.accent }]}
          >
            <Feather name="arrow-left" size={16} color={colors.accent} />
            <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.backText}>Daftar Modul</Text>
          </TouchableOpacity>
          <View style={styles.heroHeader}>
            <View style={[styles.heroBadge, { backgroundColor: 'rgba(15, 23, 42, 0.28)' }]}>
              <Feather name="layers" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>{module.level}</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: 'rgba(15, 23, 42, 0.28)' }]}>
              <Feather name="clock" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>{module.duration}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{module.title}</Text>
          <Text style={styles.heroSubtitle}>{module.summary}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => handleStartLesson(module.lessons[0])}
            style={styles.primaryButton}
          >
            <Feather name="play-circle" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Mulai Pembelajaran</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="list" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Rangkaian Materi</Text>
          </View>
          <View style={styles.lessonList}>
            {module.lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                accessibilityRole="button"
                onPress={() => handleStartLesson(lesson)}
                style={[styles.lessonItem, { borderColor: colors.border }]}
              >
                <View style={[styles.stepIndicator, { borderColor: `${colors.accent}40` }]}>
                  <Text style={[styles.stepIndex, { color: colors.accent }]}>{index + 1}</Text>
                </View>
                <View style={[styles.lessonBadge, { backgroundColor: `${colors.accent}12` }]}>
                  <Feather name={lessonTypeIcon[lesson.type] ?? 'book'} size={14} color={colors.accent} />
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
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="award" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hasil Pembelajaran</Text>
          </View>
          <View style={styles.outcomeList}>
            {module.outcomes.map(outcome => (
              <View key={outcome} style={styles.outcomeItem}>
                <Feather name="check-circle" size={16} color={colors.accent} />
                <Text style={[styles.outcomeText, { color: colors.text }]}>{outcome}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="folder" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Materi Pendukung</Text>
          </View>
          <View style={styles.resourceList}>
            {module.resources.map(resource => (
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
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroHeader: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  heroSubtitle: {
    color: 'rgba(225, 245, 255, 0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 18,
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
    fontWeight: '700',
  },
  lessonList: {
    gap: 12,
  },
  lessonItem: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndex: {
    fontSize: 13,
    fontWeight: '700',
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
    gap: 6,
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
    width: 44,
    height: 44,
    borderRadius: 16,
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
  emptyState: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

