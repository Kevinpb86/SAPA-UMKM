import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  availableTags,
  ForumTag,
  ForumTopic,
  forumTopics,
} from '../../constants/forumData';

const palette = {
  light: {
    background: '#F6F3FF',
    hero: ['#7C3AED', '#6366F1'],
    card: '#FFFFFF',
    border: '#DED6FF',
    text: '#1F1033',
    subtle: '#55497A',
    accent: '#7C3AED',
    highlight: '#EEF2FF',
  },
  dark: {
    background: '#130B26',
    hero: ['#5B21B6', '#4338CA'],
    card: '#1B1235',
    border: '#2E1F54',
    text: '#F5F3FF',
    subtle: '#D1C4FF',
    accent: '#A855F7',
    highlight: '#1F1640',
  },
};

type SortOption = 'recent' | 'popular' | 'pinned';

export default function CommunityForumScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<ForumTag | 'Semua'>('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const topicFilter = forumTopics.filter(topic => {
      const matchTag = activeTag === 'Semua' || topic.tags.includes(activeTag);
      const matchQuery =
        normalizedQuery.length === 0 ||
        topic.title.toLowerCase().includes(normalizedQuery) ||
        topic.summary.toLowerCase().includes(normalizedQuery) ||
        topic.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));

      return matchTag && matchQuery;
    });

    const sorted = [...topicFilter].sort((a, b) => {
      if (sortBy === 'pinned') {
        if (a.status === 'pinned' && b.status !== 'pinned') return -1;
        if (a.status !== 'pinned' && b.status === 'pinned') return 1;
      }

      if (sortBy === 'popular') {
        const aVotes = a.replies.reduce((acc, reply) => acc + reply.upvotes, 0);
        const bVotes = b.replies.reduce((acc, reply) => acc + reply.upvotes, 0);
        return bVotes - aVotes;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [activeTag, searchQuery, sortBy]);

  const handleSelectTopic = (topicId: string) => {
    setExpandedTopicId(prev => (prev === topicId ? null : topicId));
  };

  const renderTopicCard = ({ item }: { item: ForumTopic }) => {
    const isExpanded = expandedTopicId === item.id;
    const totalVotes = item.replies.reduce((acc, reply) => acc + reply.upvotes, 0);

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => handleSelectTopic(item.id)}
        style={[
          styles.topicCard,
          {
            borderColor:
              item.status === 'pinned' ? colors.accent : colors.border,
            backgroundColor: isExpanded ? colors.highlight : colors.card,
          },
        ]}
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicAuthor}>
            <View style={[styles.avatar, { backgroundColor: `${colors.accent}1F` }]}>
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {item.author.avatarInitials}
              </Text>
            </View>
            <View>
              <Text style={[styles.topicTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.topicMeta, { color: colors.subtle }]}>
                {item.author.name} • {item.author.role} • {new Date(item.createdAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.subtle}
          />
        </View>

        <Text style={[styles.topicSummary, { color: colors.text }]} numberOfLines={isExpanded ? undefined : 3}>
          {item.summary}
        </Text>

        <View style={styles.topicFooter}>
          <View style={styles.tagGroup}>
            {item.tags.map(tag => (
              <View key={tag} style={[styles.tagPill, { borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.topicStats}>
            {item.status === 'pinned' && (
              <View style={[styles.statusPill, { backgroundColor: `${colors.accent}20` }]}>
                <Feather name="bookmark" size={12} color={colors.accent} />
                <Text style={[styles.statusText, { color: colors.accent }]}>Pinned</Text>
              </View>
            )}
            {item.status === 'closed' && (
              <View style={[styles.statusPill, { backgroundColor: 'rgba(209, 213, 219, 0.16)' }]}>
                <Feather name="lock" size={12} color={colors.subtle} />
                <Text style={[styles.statusText, { color: colors.subtle }]}>Closed</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Feather name="message-circle" size={14} color={colors.subtle} />
              <Text style={[styles.statText, { color: colors.subtle }]}>{item.replies.length} balasan</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="thumbs-up" size={14} color={colors.subtle} />
              <Text style={[styles.statText, { color: colors.subtle }]}>{totalVotes} apresiasi</Text>
            </View>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.replySection}>
            <Text style={[styles.replyTitle, { color: colors.text }]}>Ringkasan Balasan</Text>
            {item.replies.map(reply => (
              <View key={reply.id} style={[styles.replyCard, { borderColor: colors.border }]}>
                <View style={styles.replyHeader}>
                  <View style={[styles.avatarSmall, { backgroundColor: `${colors.accent}1A` }]}>
                    <Text style={[styles.avatarSmallText, { color: colors.accent }]}>
                      {reply.author.avatarInitials}
                    </Text>
                  </View>
                  <View style={styles.replyAuthorInfo}>
                    <Text style={[styles.replyAuthorName, { color: colors.text }]}>{reply.author.name}</Text>
                    <Text style={[styles.replyMeta, { color: colors.subtle }]}>
                      {reply.author.role} • {new Date(reply.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.replyVotes}>
                    <Feather name="thumbs-up" size={14} color={colors.accent} />
                    <Text style={[styles.replyVotesText, { color: colors.accent }]}>{reply.upvotes}</Text>
                  </View>
                </View>
                <Text style={[styles.replyContent, { color: colors.text }]}>{reply.message}</Text>
              </View>
            ))}

            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.joinDiscussionButton, { borderColor: colors.accent }]}
              onPress={() => router.push('/services/forum/discussion')}
            >
              <Feather name="edit-3" size={14} color={colors.accent} />
              <Text style={[styles.joinDiscussionText, { color: colors.accent }]}>Ikut berdiskusi</Text>
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
        ListHeaderComponent={
          <>
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
              <Text style={styles.heroKicker}>Forum Komunikasi & Diskusi</Text>
              <Text style={styles.heroTitle}>Temukan Solusi Bersama Komunitas UMKM</Text>
              <Text style={styles.heroSubtitle}>
                Berdiskusi, berbagi strategi, dan kolaborasi secara langsung antar pelaku UMKM serta mentor.
              </Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{forumTopics.length}</Text>
                  <Text style={styles.heroStatLabel}>Topik aktif</Text>
                </View>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>
                    {forumTopics.reduce((acc, topic) => acc + topic.replies.length, 0)}
                  </Text>
                  <Text style={styles.heroStatLabel}>Balasan</Text>
                </View>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{availableTags.length}</Text>
                  <Text style={styles.heroStatLabel}>Kategori diskusi</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.searchHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Cari Diskusi</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Jelajahi pertanyaan atau bagikan pengalaman Anda.
                </Text>
              </View>
              <View style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.highlight }]}>
                <Feather name="search" size={16} color={colors.subtle} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Cari topik, kata kunci, atau kategori..."
                  placeholderTextColor={`${colors.subtle}88`}
                  style={[styles.searchInput, { color: colors.text }]}
                />
              </View>
              <View style={styles.filterRow}>
                <ScrollTagList
                  colors={colors}
                  activeTag={activeTag}
                  onSelectTag={setActiveTag}
                />
                <SortMenu colors={colors} sortBy={sortBy} onChangeSort={setSortBy} />
              </View>
            </View>
          </>
        }
        data={filteredTopics}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderTopicCard}
        ListEmptyComponent={
          <View style={[styles.emptyState, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Feather name="inbox" size={20} color={colors.subtle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada diskusi</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
              Coba ubah kata kunci atau pilih kategori lain untuk menemukan diskusi yang relevan.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type ScrollTagListProps = {
  colors: typeof palette.light;
  activeTag: ForumTag | 'Semua';
  onSelectTag: (tag: ForumTag | 'Semua') => void;
};

function ScrollTagList({ colors, activeTag, onSelectTag }: ScrollTagListProps) {
  return (
    <View style={styles.tagScroll}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => onSelectTag('Semua')}
        style={[
          styles.tagFilter,
          {
            borderColor: activeTag === 'Semua' ? colors.accent : colors.border,
            backgroundColor: activeTag === 'Semua' ? `${colors.accent}16` : colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.tagFilterText,
            { color: activeTag === 'Semua' ? colors.accent : colors.subtle },
          ]}
        >
          Semua
        </Text>
      </TouchableOpacity>
      {availableTags.map(tag => {
        const active = tag === activeTag;
        return (
          <TouchableOpacity
            key={tag}
            accessibilityRole="button"
            onPress={() => onSelectTag(tag)}
            style={[
              styles.tagFilter,
              {
                borderColor: active ? colors.accent : colors.border,
                backgroundColor: active ? `${colors.accent}16` : colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.tagFilterText,
                { color: active ? colors.accent : colors.subtle },
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

type SortMenuProps = {
  colors: typeof palette.light;
  sortBy: SortOption;
  onChangeSort: (value: SortOption) => void;
};

function SortMenu({ colors, sortBy, onChangeSort }: SortMenuProps) {
  const options: { value: SortOption; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
    { value: 'recent', label: 'Terbaru', icon: 'clock' },
    { value: 'popular', label: 'Terpopuler', icon: 'trending-up' },
    { value: 'pinned', label: 'Dipin', icon: 'bookmark' },
  ];

  return (
    <View style={[styles.sortMenu, { borderColor: colors.border, backgroundColor: colors.card }]}>
      {options.map(option => {
        const active = option.value === sortBy;
        return (
          <TouchableOpacity
            key={option.value}
            accessibilityRole="button"
            onPress={() => onChangeSort(option.value)}
            style={[
              styles.sortOption,
              active && { backgroundColor: `${colors.accent}14` },
            ]}
          >
            <Feather name={option.icon} size={14} color={active ? colors.accent : colors.subtle} />
            <Text
              style={[
                styles.sortText,
                { color: active ? colors.accent : colors.subtle },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
    marginBottom: 16,
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
    backgroundColor: 'rgba(31, 15, 51, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(237, 233, 254, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(240, 240, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 16,
  },
  heroStatItem: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    gap: 4,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroStatLabel: {
    color: 'rgba(240, 240, 255, 0.85)',
    fontSize: 12,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  searchHeader: {
    gap: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  tagScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  tagFilter: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagFilterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sortMenu: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  topicSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  topicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  replySection: {
    gap: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(124, 58, 237, 0.2)',
  },
  replyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  replyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontSize: 12,
    fontWeight: '700',
  },
  replyAuthorInfo: {
    flex: 1,
  },
  replyAuthorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  replyMeta: {
    fontSize: 11,
  },
  replyVotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyVotesText: {
    fontSize: 12,
    fontWeight: '700',
  },
  replyContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  joinDiscussionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  joinDiscussionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
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