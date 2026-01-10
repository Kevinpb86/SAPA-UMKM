import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  TrainingAudience,
  TrainingLevel,
  TrainingMode,
  TrainingModule,
  trainingModules,
} from '../../constants/trainingPrograms';

const palette = {
  light: {
    background: '#F1F7FF',
    hero: ['#0EA5E9', '#3B82F6'],
    card: '#FFFFFF',
    border: '#CFE3FF',
    text: '#0B1D3A',
    subtle: '#4E648A',
    accent: '#0EA5E9',
  },
  dark: {
    background: '#071426',
    hero: ['#1E40AF', '#0EA5E9'],
    card: '#0F2037',
    border: '#1D3454',
    text: '#F8FBFF',
    subtle: '#B4C9F7',
    accent: '#60A5FA',
  },
};

const modeFilters: Array<TrainingMode | 'Semua'> = ['Semua', 'Tatap Muka', 'Hybrid', 'Daring'];
const levelFilters: Array<TrainingLevel | 'Semua'> = ['Semua', 'Dasar', 'Menengah', 'Lanjutan'];
const audienceFilters: Array<TrainingAudience | 'Semua'> = ['Semua', 'UMKM Pemula', 'UMKM Berkembang', 'Koperasi', 'Asosiasi'];

type HighlightCard = {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
};

const highlightCards: HighlightCard[] = [
  {
    id: 'highlight-1',
    icon: 'layers',
    title: 'Kurikulum Fleksibel',
    description: 'Setiap modul dirancang adaptif untuk kebutuhan operasional dan manajemen UMKM lintas sektor.',
  },
  {
    id: 'highlight-2',
    icon: 'users',
    title: 'Fasilitator Praktisi',
    description: 'Tim pelatih berpengalaman mendampingi UMKM dan koperasi di berbagai daerah Indonesia.',
  },
  {
    id: 'highlight-3',
    icon: 'refresh-cw',
    title: 'Pendampingan Pasca Pelatihan',
    description: 'Tersedia mentoring, klinik konsultasi, serta akses komunitas untuk implementasi berkelanjutan.',
  },
];

export default function TechnicalTrainingScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  // Animations
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesh rotation
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade-in entry
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 20,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const meshRotate = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<TrainingMode | 'Semua'>('Semua');
  const [levelFilter, setLevelFilter] = useState<TrainingLevel | 'Semua'>('Semua');
  const [audienceFilter, setAudienceFilter] = useState<TrainingAudience | 'Semua'>('Semua');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return trainingModules.filter(module => {
      const matchMode = modeFilter === 'Semua' || module.mode === modeFilter;
      const matchLevel = levelFilter === 'Semua' || module.level === levelFilter;
      const matchAudience =
        audienceFilter === 'Semua' || module.audience.includes(audienceFilter);
      const matchQuery =
        normalizedQuery.length === 0 ||
        module.title.toLowerCase().includes(normalizedQuery) ||
        module.description.toLowerCase().includes(normalizedQuery);

      return matchMode && matchLevel && matchAudience && matchQuery;
    });
  }, [searchQuery, modeFilter, levelFilter, audienceFilter]);

  const handleToggleModule = (moduleId: string) => {
    setExpandedModuleId(prev => (prev === moduleId ? null : moduleId));
  };

  const renderModuleCard = ({ item }: { item: TrainingModule }) => {
    const expanded = expandedModuleId === item.id;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.92}
        onPress={() => handleToggleModule(item.id)}
        style={[styles.moduleCard, { borderColor: expanded ? colors.accent : colors.border, backgroundColor: expanded ? `${colors.accent}0F` : colors.card }]}
      >
        <View style={styles.moduleHeader}>
          <View style={styles.moduleHeaderLeft}>
            <View style={[styles.modeBadge, { backgroundColor: `${colors.accent}18` }]}>
              <Feather name={item.mode === 'Tatap Muka' ? 'map-pin' : item.mode === 'Hybrid' ? 'shuffle' : 'wifi'} size={14} color={colors.accent} />
              <Text style={[styles.modeBadgeText, { color: colors.accent }]}>{item.mode}</Text>
            </View>
            <View style={styles.moduleHeading}>
              <Text style={[styles.moduleTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.moduleSubtitle, { color: colors.subtle }]}>{item.duration} • {item.level}</Text>
            </View>
          </View>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.subtle} />
        </View>

        <Text style={[styles.moduleDescription, { color: colors.text }]} numberOfLines={expanded ? undefined : 3}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
          <MetaTag icon="users" text={`Peserta: ${item.audience.join(', ')}`} colors={colors} />
          <MetaTag icon="check-circle" text={`${item.outcomes.length} capaian belajar utama`} colors={colors} />
        </View>

        {expanded && (
          <View style={styles.moduleExpanded}>
            <SectionTitle icon="target" title="Capaian Pembelajaran" colors={colors} />
            <View style={styles.outcomeList}>
              {item.outcomes.map(outcome => (
                <View key={outcome} style={styles.outcomeRow}>
                  <Feather name="check" size={14} color={colors.accent} />
                  <Text style={[styles.outcomeText, { color: colors.text }]}>{outcome}</Text>
                </View>
              ))}
            </View>

            <SectionTitle icon="calendar" title="Rangkaian Agenda" colors={colors} />
            <View style={styles.agendaList}>
              {item.agenda.map(session => (
                <View key={session.title} style={[styles.agendaCard, { borderColor: colors.border }]}>
                  <View style={styles.agendaHeader}>
                    <Text style={[styles.agendaTitle, { color: colors.text }]}>{session.title}</Text>
                    <MetaTag icon="clock" text={session.duration} colors={colors} compact />
                  </View>
                  <Text style={[styles.agendaDescription, { color: colors.subtle }]}>{session.description}</Text>
                </View>
              ))}
            </View>

            <SectionTitle icon="user" title="Profil Fasilitator" colors={colors} />
            <View style={[styles.facilitatorCard, { borderColor: colors.border }]}>
              <View style={[styles.facilitatorAvatar, { backgroundColor: `${colors.accent}18` }]}>
                <Text style={[styles.facilitatorInitial, { color: colors.accent }]}>{item.facilitator.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={styles.facilitatorInfo}>
                <Text style={[styles.facilitatorName, { color: colors.text }]}>{item.facilitator.name}</Text>
                <Text style={[styles.facilitatorRole, { color: colors.subtle }]}>{item.facilitator.role}</Text>
                <Text style={[styles.facilitatorBio, { color: colors.subtle }]}>{item.facilitator.experience}</Text>
              </View>
            </View>

            <SectionTitle icon="book-open" title="Materi & Template" colors={colors} />
            <View style={styles.materialList}>
              {item.materials.map(material => (
                <TouchableOpacity
                  key={material.id}
                  accessibilityRole="button"
                  style={[styles.materialCard, { borderColor: colors.border }]}>
                  <View style={[styles.materialIcon, { backgroundColor: `${colors.accent}16` }]}>
                    <Feather name="file-text" size={16} color={colors.accent} />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={[styles.materialLabel, { color: colors.text }]}>{material.label}</Text>
                    <Text style={[styles.materialType, { color: colors.subtle }]}>{material.type}</Text>
                  </View>
                  <Feather name="download" size={16} color={colors.accent} />
                </TouchableOpacity>
              ))}
            </View>

            <SectionTitle icon="repeat" title="Pendampingan Lanjutan" colors={colors} />
            <View style={styles.followUpList}>
              {item.followUp.map(entry => (
                <View key={entry} style={styles.followUpRow}>
                  <Feather name="arrow-right" size={14} color={colors.accent} />
                  <Text style={[styles.followUpText, { color: colors.text }]}>{entry}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.ctaButton, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/services/pelatihan-teknis/konsultasi')}
            >
              <Feather name="message-circle" size={16} color="#FFFFFF" />
              <Text style={styles.ctaButtonText}>Diskusikan Kebutuhan Pelatihan</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <FlatList
        data={filteredModules}
        keyExtractor={module => module.id}
        renderItem={renderModuleCard}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Animated.View
              style={[
                styles.heroContainer,
                {
                  opacity: entryAnim,
                  transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
                }
              ]}
            >
              <LinearGradient
                colors={colors.hero}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
              >
                <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
                  <View style={[styles.meshCircle, { top: -80, right: -40, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
                  <View style={[styles.meshCircle, { bottom: -120, left: -60, width: 320, height: 320, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
                </Animated.View>

                <Animated.View style={[styles.floatingIcon, { top: '20%', right: '10%', transform: [{ translateY: floatY }] }]}>
                  <Feather name="award" size={90} color="#FFFFFF" style={{ opacity: 0.1 }} />
                </Animated.View>

                <View style={styles.heroContent}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.backButton}
                  >
                    <Feather name="arrow-left" size={18} color="#FFFFFF" />
                    <Text style={styles.backText}>Kembali</Text>
                  </TouchableOpacity>
                  <Text style={styles.heroKicker}>PELATIHAN TEKNIS</Text>
                  <Text style={styles.heroTitle}>Katalog Modul</Text>
                  <Text style={styles.heroSubtitle}>
                    Telusuri katalog modul pelatihan resmi beserta silabus, fasilitator, dan layanan pendampingan lanjutan dari KemenKopUKM.
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                  <Feather name="zap" size={18} color={colors.accent} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Keunggulan Pelatihan</Text>
              </View>
              <Text style={[styles.sectionSubtitleText, { color: colors.subtle }]}>Dirancang khusus untuk membawa perubahan nyata di usaha Anda.</Text>
              <View style={styles.highlightGrid}>
                {highlightCards.map(card => (
                  <View key={card.id} style={[styles.highlightCard, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
                    <View style={[styles.highlightIcon, { backgroundColor: `${colors.accent}18` }]}>
                      <Feather name={card.icon} size={16} color={colors.accent} />
                    </View>
                    <Text style={[styles.highlightTitle, { color: colors.text }]}>{card.title}</Text>
                    <Text style={[styles.highlightDescription, { color: colors.subtle }]}>{card.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                  <Feather name="search" size={18} color={colors.accent} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Eksplorasi Modul</Text>
              </View>
              <Text style={[styles.sectionSubtitleText, { color: colors.subtle }]}>Gunakan pencarian dan filter untuk menampilkan rekomendasi pelatihan yang relevan.</Text>
              <View style={[styles.searchBar, { backgroundColor: `${colors.subtle}08`, borderColor: 'transparent' }]}>
                <Feather name="search" size={16} color={colors.accent} />
                <TextInput
                  style={[
                    styles.searchInput,
                    { color: colors.text },
                    Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                  ]}
                  placeholder="Cari judul atau fokus pelatihan..."
                  placeholderTextColor={`${colors.subtle}50`}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <FilterRow
                title="Mode Pelatihan"
                options={modeFilters}
                active={modeFilter}
                onSelectOption={setModeFilter}
                colors={colors}
              />
              <FilterRow
                title="Level"
                options={levelFilters}
                active={levelFilter}
                onSelectOption={setLevelFilter}
                colors={colors}
              />
              <FilterRow
                title="Segment Peserta"
                options={audienceFilters}
                active={audienceFilter}
                onSelectOption={setAudienceFilter}
                colors={colors}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="info" size={18} color={colors.subtle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada modul yang cocok</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>Ubah kata kunci atau kombinasikan filter untuk melihat pilihan pelatihan lainnya.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type FilterRowProps<T extends string> = {
  title: string;
  options: T[];
  active: T;
  onSelectOption: (option: T) => void;
  colors: typeof palette.light;
};

function FilterRow<T extends string>({ title, options, active, onSelectOption, colors }: FilterRowProps<T>) {
  return (
    <View style={styles.filterGroup}>
      <Text style={[styles.filterLabel, { color: colors.subtle }]}>{title}</Text>
      <View style={styles.filterList}>
        {options.map(option => {
          const isActive = option === active;
          return (
            <TouchableOpacity
              key={option}
              accessibilityRole="button"
              onPress={() => onSelectOption(option)}
              style={[styles.filterChip, {
                borderColor: isActive ? colors.accent : colors.border,
                backgroundColor: isActive ? `${colors.accent}16` : colors.card,
              }]}
            >
              <Text style={[styles.filterChipText, { color: isActive ? colors.accent : colors.subtle }]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

type SectionTitleProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  colors: typeof palette.light;
};

function SectionTitle({ icon, title, colors }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionTitleIcon, { backgroundColor: `${colors.accent}18` }]}>
        <Feather name={icon} size={14} color={colors.accent} />
      </View>
      <Text style={[styles.sectionTitleText, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

type MetaTagProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  text: string;
  colors: typeof palette.light;
  compact?: boolean;
};

function MetaTag({ icon, text, colors, compact }: MetaTagProps) {
  return (
    <View style={[styles.metaTag, {
      paddingHorizontal: compact ? 10 : 12,
      paddingVertical: compact ? 4 : 6,
    }]}
    >
      <Feather name={icon} size={13} color={colors.accent} />
      <Text style={[styles.metaTagText, { color: colors.accent }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  heroContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    marginBottom: 8,
  },
  hero: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  meshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  meshCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 0,
  },
  heroContent: {
    gap: 8,
    zIndex: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    borderRadius: 32,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  sectionSubtitleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: -12,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    minWidth: '100%',
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  highlightDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moduleCard: {
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  moduleHeading: {
    flex: 1,
    gap: 2,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  moduleSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  metaTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moduleExpanded: {
    gap: 20,
    marginTop: 8,
  },
  outcomeList: {
    gap: 10,
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  outcomeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  agendaList: {
    gap: 12,
  },
  agendaCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  agendaTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  agendaDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  facilitatorCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  facilitatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilitatorInitial: {
    fontSize: 22,
    fontWeight: '600',
  },
  facilitatorInfo: {
    flex: 1,
    gap: 2,
  },
  facilitatorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  facilitatorRole: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  facilitatorBio: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  materialList: {
    gap: 12,
  },
  materialCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  materialIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialInfo: {
    flex: 1,
    gap: 2,
  },
  materialLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  materialType: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  followUpList: {
    gap: 10,
  },
  followUpRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  followUpText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});


