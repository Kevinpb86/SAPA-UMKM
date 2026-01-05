import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
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
                <Text style={styles.heroKicker}>Pelatihan Teknis & Manajemen KemenKopUKM</Text>
                <Text style={styles.heroTitle}>Sesuaikan Jadwal Pelatihan untuk Tim UMKM Anda</Text>
                <Text style={styles.heroSubtitle}>
                  Telusuri katalog modul pelatihan resmi beserta silabus, fasilitator, dan layanan pendampingan lanjutan.
                </Text>
              </LinearGradient>
              <LinearGradient
                colors={scheme === 'dark' ? ['#0EA5E933', 'transparent'] : ['#F1F7FF', 'transparent']}
                style={styles.meshGradient}
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Mengapa Memilih Pelatihan Resmi?</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>Pelatihan dirancang untuk membawa perubahan nyata di usaha Anda.</Text>
              <View style={styles.highlightGrid}>
                {highlightCards.map(card => (
                  <View key={card.id} style={[styles.highlightCard, { borderColor: colors.border }]}>
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
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Temukan Modul yang Tepat</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>Gunakan pencarian dan filter untuk menampilkan rekomendasi pelatihan yang relevan.</Text>
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
    marginBottom: 16,
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
    backgroundColor: 'rgba(8, 33, 72, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(213, 233, 255, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(226, 241, 255, 0.9)',
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    opacity: 0.7,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    minWidth: 200,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  highlightIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: 14,
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
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterGroup: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moduleCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
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
  },
  modeBadge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  moduleHeading: {
    flex: 1,
    gap: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  moduleSubtitle: {
    fontSize: 12,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
  },
  metaTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleExpanded: {
    gap: 18,
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
  },
  agendaList: {
    gap: 12,
  },
  agendaCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agendaTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  agendaDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  facilitatorCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  facilitatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilitatorInitial: {
    fontSize: 18,
    fontWeight: '700',
  },
  facilitatorInfo: {
    flex: 1,
    gap: 4,
  },
  facilitatorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  facilitatorRole: {
    fontSize: 12,
  },
  facilitatorBio: {
    fontSize: 12,
    lineHeight: 18,
  },
  materialList: {
    gap: 12,
  },
  materialCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialInfo: {
    flex: 1,
    gap: 4,
  },
  materialLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  materialType: {
    fontSize: 12,
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
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  sectionTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});


