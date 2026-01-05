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
  ProgramInfo,
  programInfos,
  ProgramStatus,
  ProgramType,
} from '../../constants/programDistribution';

const palette = {
  light: {
    background: '#F0F6FF',
    hero: ['#2563EB', '#1D4ED8'],
    card: '#FFFFFF',
    border: '#D6E4FF',
    text: '#0B1D3A',
    subtle: '#4E5E82',
    accent: '#2563EB',
  },
  dark: {
    background: '#091429',
    hero: ['#1E3A8A', '#1D4ED8'],
    card: '#0F1E36',
    border: '#1F3052',
    text: '#F8FBFF',
    subtle: '#AEC4F9',
    accent: '#60A5FA',
  },
};

const typeFilters: Array<ProgramType | 'Semua'> = ['Semua', 'KUR', 'UMi', 'LPDB', 'Banpres', 'Pelatihan'];
const statusFilters: Array<ProgramStatus | 'Semua'> = [
  'Semua',
  'Pendaftaran dibuka',
  'Segera dibuka',
  'Sedang seleksi',
  'Selesai',
];

export default function ProgramDistributionScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ProgramType | 'Semua'>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<ProgramStatus | 'Semua'>('Semua');
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return programInfos.filter(program => {
      const meetType = selectedType === 'Semua' || program.type === selectedType;
      const meetStatus = selectedStatus === 'Semua' || program.status === selectedStatus;
      const meetQuery =
        normalizedQuery.length === 0 ||
        program.name.toLowerCase().includes(normalizedQuery) ||
        program.summary.toLowerCase().includes(normalizedQuery) ||
        program.provider.toLowerCase().includes(normalizedQuery);

      return meetType && meetStatus && meetQuery;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const upcomingDeadlines = useMemo(() => {
    return programInfos
      .filter(program => program.nextDeadline)
      .map(program => ({
        id: program.id,
        name: program.name,
        deadline: program.nextDeadline ?? '',
        status: program.status,
      }));
  }, []);

  const handleExpandProgram = (programId: string) => {
    setExpandedProgramId(prev => (prev === programId ? null : programId));
  };

  const renderProgramCard = ({ item }: { item: ProgramInfo }) => {
    const isExpanded = expandedProgramId === item.id;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => handleExpandProgram(item.id)}
        style={[
          styles.programCard,
          {
            borderColor: isExpanded ? colors.accent : colors.border,
            backgroundColor: isExpanded ? `${colors.accent}0F` : colors.card,
          },
        ]}
        activeOpacity={0.92}
      >
        <View style={styles.programHeader}>
          <View style={styles.programHeaderLeft}>
            <View style={[styles.programBadge, { backgroundColor: `${colors.accent}16` }]}>
              <Feather name="layers" size={16} color={colors.accent} />
              <Text style={[styles.programBadgeText, { color: colors.accent }]}>{item.type}</Text>
            </View>
            <View style={styles.programHeading}>
              <Text style={[styles.programName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.programProvider, { color: colors.subtle }]}>{item.provider}</Text>
            </View>
          </View>
          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.subtle}
          />
        </View>

        <Text style={[styles.programSummary, { color: colors.text }]} numberOfLines={isExpanded ? undefined : 3}>
          {item.summary}
        </Text>

        <View style={styles.programMetaRow}>
          <ProgramStatusPill status={item.status} colors={colors} />
          {item.financingRange && <MetaInfo colors={colors} icon="briefcase" text={item.financingRange} />}
          {item.rateInfo && <MetaInfo colors={colors} icon="percent" text={item.rateInfo} />}
        </View>

        <View style={styles.programMetaRow}>
          <MetaInfo colors={colors} icon="pie-chart" text={item.quotaInfo} />
          {item.nextDeadline && (
            <MetaInfo colors={colors} icon="calendar" text={`Deadline: ${item.nextDeadline}`} />
          )}
        </View>

        {isExpanded && (
          <View style={styles.programDetail}>
            <SectionTitle colors={colors} icon="gift" title="Keunggulan Program" />
            <View style={styles.benefitGrid}>
              {item.benefits.map(benefit => (
                <View key={benefit.id} style={[styles.benefitCard, { borderColor: colors.border }]}>
                  <View style={[styles.benefitIcon, { backgroundColor: `${colors.accent}16` }]}>
                    <Feather name={benefit.icon} size={16} color={colors.accent} />
                  </View>
                  <Text style={[styles.benefitTitle, { color: colors.text }]}>{benefit.title}</Text>
                  <Text style={[styles.benefitDescription, { color: colors.subtle }]}>
                    {benefit.description}
                  </Text>
                </View>
              ))}
            </View>

            <SectionTitle colors={colors} icon="check-circle" title="Persyaratan Inti" />
            <View style={styles.requirementsList}>
              {item.requirements.map(requirement => (
                <View key={requirement} style={styles.requirementRow}>
                  <Feather name="check" size={14} color={colors.accent} />
                  <Text style={[styles.requirementText, { color: colors.text }]}>{requirement}</Text>
                </View>
              ))}
            </View>

            <SectionTitle colors={colors} icon="calendar" title="Tahapan Penyaluran" />
            <View style={styles.timelineList}>
              {item.timeline.map(step => (
                <TimelineItemRow key={step.id} step={step} colors={colors} />
              ))}
            </View>

            <SectionTitle colors={colors} icon="file-text" title="Referensi & Formulir" />
            <View style={styles.resourceList}>
              {item.resources.map(resource => (
                <TouchableOpacity
                  key={resource.id}
                  accessibilityRole="button"
                  style={[styles.resourceCard, { borderColor: colors.border }]}
                  onPress={() => router.push('/services/penyaluran/resources')}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: `${colors.accent}16` }]}>
                    <Feather name="download" size={16} color={colors.accent} />
                  </View>
                  <View style={styles.resourceTextWrapper}>
                    <Text style={[styles.resourceLabel, { color: colors.text }]}>{resource.label}</Text>
                    <Text style={[styles.resourceType, { color: colors.subtle }]}>{resource.type}</Text>
                  </View>
                  <Feather name="external-link" size={14} color={colors.accent} />
                </TouchableOpacity>
              ))}
            </View>

            <SectionTitle colors={colors} icon="life-buoy" title="Kontak & Pendampingan" />
            <View style={[styles.contactCard, { borderColor: colors.border }]}>
              <View style={styles.contactRow}>
                <Feather name="mail" size={16} color={colors.accent} />
                <Text style={[styles.contactText, { color: colors.text }]}>{item.contact.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Feather name="phone" size={16} color={colors.accent} />
                <Text style={[styles.contactText, { color: colors.text }]}>{item.contact.phone}</Text>
              </View>
              {item.contact.notes && (
                <View style={styles.contactRow}>
                  <Feather name="info" size={16} color={colors.accent} />
                  <Text style={[styles.contactNotes, { color: colors.subtle }]}>{item.contact.notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <FlatList
        keyExtractor={program => program.id}
        data={filteredPrograms}
        renderItem={renderProgramCard}
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
                <Text style={styles.heroKicker}>Informasi Penyaluran Program KemenKopUKM</Text>
                <Text style={styles.heroTitle}>Akses Dana & Dukungan Resmi untuk UMKM</Text>
                <Text style={styles.heroSubtitle}>
                  Pantau status penyaluran pembiayaan, bantuan usaha, dan program pendampingan yang disediakan pemerintah.
                </Text>
              </LinearGradient>
              <LinearGradient
                colors={scheme === 'dark' ? ['#2563EB33', 'transparent'] : ['#F0F6FF', 'transparent']}
                style={styles.meshGradient}
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter & Pencarian</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                Temukan informasi penyaluran yang paling relevan dengan kebutuhan usaha Anda.
              </Text>
              <View style={[styles.searchBar, { backgroundColor: `${colors.subtle}08`, borderColor: 'transparent' }]}>
                <Feather name="search" size={16} color={colors.accent} />
                <TextInput
                  style={[
                    styles.searchInput,
                    { color: colors.text },
                    Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                  ]}
                  placeholder="Cari nama program, lembaga penyalur, atau kata kunci..."
                  placeholderTextColor={`${colors.subtle}50`}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <FilterRow
                colors={colors}
                label="Jenis Program"
                options={typeFilters}
                active={selectedType}
                onSelect={value => setSelectedType(value)}
              />
              <FilterRow
                colors={colors}
                label="Status Penyaluran"
                options={statusFilters}
                active={selectedStatus}
                onSelect={value => setSelectedStatus(value)}
              />
            </View>

            {upcomingDeadlines.length > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Agenda & Tenggat Terdekat</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Pastikan Anda menyiapkan dokumen sebelum batas waktu pendaftaran.
                </Text>
                <View style={styles.deadlineList}>
                  {upcomingDeadlines.map(deadline => (
                    <View key={deadline.id} style={[styles.deadlineItem, { borderColor: colors.border }]}>
                      <View style={[styles.deadlineIcon, { backgroundColor: `${colors.accent}16` }]}>
                        <Feather name="calendar" size={16} color={colors.accent} />
                      </View>
                      <View style={styles.deadlineContent}>
                        <Text style={[styles.deadlineTitle, { color: colors.text }]}>{deadline.name}</Text>
                        <Text style={[styles.deadlineDate, { color: colors.subtle }]}>{deadline.deadline}</Text>
                      </View>
                      <ProgramStatusPill status={deadline.status} colors={colors} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="inbox" size={20} color={colors.subtle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Program tidak ditemukan</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
              Coba ubah filter atau kata kunci pencarian untuk menampilkan program penyaluran lainnya.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type FilterRowProps<T extends string> = {
  colors: typeof palette.light;
  label: string;
  options: T[];
  active: T;
  onSelect: (value: T) => void;
};

function FilterRow<T extends string>({ colors, label, options, active, onSelect }: FilterRowProps<T>) {
  return (
    <View style={styles.filterGroup}>
      <Text style={[styles.filterLabel, { color: colors.subtle }]}>{label}</Text>
      <View style={styles.filterList}>
        {options.map(option => {
          const isActive = option === active;
          return (
            <TouchableOpacity
              key={option}
              accessibilityRole="button"
              onPress={() => onSelect(option)}
              style={[
                styles.filterChip,
                {
                  borderColor: isActive ? colors.accent : colors.border,
                  backgroundColor: isActive ? `${colors.accent}14` : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isActive ? colors.accent : colors.subtle },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

type ProgramStatusPillProps = {
  status: ProgramStatus;
  colors: typeof palette.light;
};

function ProgramStatusPill({ status, colors }: ProgramStatusPillProps) {
  const statusConfig: Record<ProgramStatus, { icon: React.ComponentProps<typeof Feather>['name']; color: string }> = {
    'Pendaftaran dibuka': { icon: 'zap', color: '#16A34A' },
    'Segera dibuka': { icon: 'clock', color: '#EAB308' },
    'Sedang seleksi': { icon: 'refresh-ccw', color: '#0EA5E9' },
    Selesai: { icon: 'check-circle', color: '#6B7280' },
  };

  const config = statusConfig[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${config.color}22` }]}>
      <Feather name={config.icon} size={12} color={config.color} />
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
}

type MetaInfoProps = {
  colors: typeof palette.light;
  icon: React.ComponentProps<typeof Feather>['name'];
  text: string;
};

function MetaInfo({ colors, icon, text }: MetaInfoProps) {
  return (
    <View style={styles.metaInfo}>
      <Feather name={icon} size={14} color={colors.accent} />
      <Text style={[styles.metaInfoText, { color: colors.subtle }]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

type SectionTitleProps = {
  colors: typeof palette.light;
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
};

function SectionTitle({ colors, icon, title }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionTitleIcon, { backgroundColor: `${colors.accent}16` }]}>
        <Feather name={icon} size={14} color={colors.accent} />
      </View>
      <Text style={[styles.sectionTitleText, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

type TimelineItemRowProps = {
  step: ProgramInfo['timeline'][number];
  colors: typeof palette.light;
};

function TimelineItemRow({ step, colors }: TimelineItemRowProps) {
  const statusColors: Record<
    ProgramInfo['timeline'][number]['status'],
    { background: string; icon: React.ComponentProps<typeof Feather>['name']; iconColor: string }
  > = {
    completed: { background: '#DCFCE7', icon: 'check', iconColor: '#16A34A' },
    current: { background: '#DBEAFE', icon: 'activity', iconColor: '#2563EB' },
    upcoming: { background: '#F5F3FF', icon: 'clock', iconColor: '#7C3AED' },
  };

  const statusConfig = statusColors[step.status];

  return (
    <View style={[styles.timelineItem, { borderColor: colors.border }]}>
      <View style={[styles.timelineIcon, { backgroundColor: statusConfig.background }]}>
        <Feather name={statusConfig.icon} size={14} color={statusConfig.iconColor} />
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineLabel, { color: colors.text }]}>{step.label}</Text>
        <Text style={[styles.timelinePeriod, { color: colors.accent }]}>{step.period}</Text>
        <Text style={[styles.timelineDescription, { color: colors.subtle }]}>{step.description}</Text>
      </View>
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
    backgroundColor: 'rgba(11, 29, 58, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(219, 234, 254, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(230, 241, 255, 0.9)',
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
    gap: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deadlineList: {
    gap: 12,
  },
  deadlineItem: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deadlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlineContent: {
    flex: 1,
    gap: 4,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  deadlineDate: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  programCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 24,
    gap: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  programBadge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  programBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  programHeading: {
    flex: 1,
    gap: 4,
  },
  programName: {
    fontSize: 16,
    fontWeight: '700',
  },
  programProvider: {
    fontSize: 12,
  },
  programSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  programMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    maxWidth: '100%',
  },
  metaInfoText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  programDetail: {
    gap: 18,
    paddingTop: 8,
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
  benefitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  benefitDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  requirementsList: {
    gap: 10,
  },
  requirementRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  timelinePeriod: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  resourceList: {
    gap: 12,
  },
  resourceCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTextWrapper: {
    flex: 1,
    gap: 4,
  },
  resourceLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  resourceType: {
    fontSize: 12,
  },
  contactCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '600',
  },
  contactNotes: {
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});


