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

import { useAuth } from '@/hooks/use-auth';
import { getCommunityPosts } from '@/lib/api';
import {
  availableTags,
  ForumTag,
  ForumTopic,
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
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Animations
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTopics();

    // Mesh rotation
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 20000,
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

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await getCommunityPosts(user?.token, user?.id?.toString());

      const mappedTopics: ForumTopic[] = data.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        author: {
          id: post.user_id.toString(),
          name: post.author_name,
          role: post.author_role || 'Pelaku UMKM',
          avatarInitials: post.author_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        },
        createdAt: post.created_at,
        tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []),
        summary: post.content,
        replies: [], // Will be fetched when expanded if needed, or we can update this
        likes: post.likes || 0,
        isLiked: !!post.is_liked,
        status: post.status
      }));

      setTopics(mappedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForTopic = async (topicId: string) => {
    try {
      const { fetchComments } = require('@/lib/api');
      const data = await fetchComments(topicId, user?.id?.toString());

      const mappedReplies = (data || []).map((comment: any) => ({
        id: comment.id.toString(),
        author: {
          id: comment.user_id.toString(),
          name: comment.author_name,
          role: 'Pelaku UMKM',
          avatarInitials: comment.author_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        },
        message: comment.content,
        createdAt: comment.created_at,
        upvotes: comment.likes || 0,
        isLiked: !!comment.is_liked
      }));

      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, replies: mappedReplies } : t
      ));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const meshRotate = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const filteredTopics = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const topicFilter = topics.filter(topic => {
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
        const aVotes = (a.replies?.reduce((acc, reply) => acc + reply.upvotes, 0) || 0) + (a.likes || 0);
        const bVotes = (b.replies?.reduce((acc, reply) => acc + reply.upvotes, 0) || 0) + (b.likes || 0);
        return bVotes - aVotes;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [topics, activeTag, searchQuery, sortBy]);

  const handleSelectTopic = (topicId: string) => {
    const isExpanding = expandedTopicId !== topicId;
    setExpandedTopicId(prev => (prev === topicId ? null : topicId));

    if (isExpanding) {
      fetchCommentsForTopic(topicId);
    }
  };

  const renderTopicCard = ({ item }: { item: ForumTopic }) => {
    const isExpanded = expandedTopicId === item.id;
    const totalLikes = item.likes || 0;
    const commentsCount = item.replies?.length || (item as any).comments_count || 0;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => handleSelectTopic(item.id)}
        activeOpacity={0.9}
        style={[
          styles.topicCard,
          {
            backgroundColor: isExpanded ? `${colors.accent}05` : colors.card,
            borderColor: item.status === 'pinned' ? colors.accent : colors.border,
            borderWidth: item.status === 'pinned' ? 2 : 1,
          },
        ]}
      >
        <View style={styles.topicHeader}>
          <View style={[styles.authorAvatar, { backgroundColor: `${colors.accent}15` }]}>
            <Feather name="user" size={20} color={colors.accent} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.text }]}>{item.author.name}</Text>
            <Text style={[styles.topicTime, { color: colors.subtle }]}>
              {item.author.role} • {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          {item.status === 'pinned' && (
            <View style={styles.pinnedBadge}>
              <Feather name="bookmark" size={12} color={colors.accent} />
            </View>
          )}
          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.subtle}
            style={{ marginLeft: 8 }}
          />
        </View>

        <View style={styles.topicContent}>
          <Text style={[styles.topicTitle, { color: colors.text }]}>{item.title}</Text>
          <Text
            style={[styles.topicSummary, { color: colors.subtle }]}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {item.summary}
          </Text>
        </View>

        <View style={styles.tagRow}>
          {item.tags.map(tag => (
            <View key={tag} style={[styles.topicTag, { backgroundColor: `${colors.accent}08` }]}>
              <Text style={[styles.topicTagText, { color: colors.accent }]}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.topicFooter}>
          <View style={styles.topicStats}>
            <View style={styles.statLabel}>
              <Feather name="message-circle" size={14} color={colors.subtle} />
              <Text style={[styles.statText, { color: colors.subtle }]}>{commentsCount}</Text>
            </View>
            <View style={styles.statLabel}>
              <Feather name="thumbs-up" size={14} color={item.isLiked ? colors.accent : colors.subtle} />
              <Text style={[styles.statText, { color: item.isLiked ? colors.accent : colors.subtle }]}>{totalLikes}</Text>
            </View>
          </View>

          <View style={styles.expandBtn}>
            <Text style={[styles.expandText, { color: colors.accent }]}>
              {isExpanded ? 'Tutup' : 'Lihat Detail'}
            </Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.repliesContainer}>
            <Text style={[styles.replyTitle, { color: colors.text, fontSize: 14, fontWeight: '800', marginBottom: 8 }]}>
              Balasan Populer
            </Text>
            {item.replies.map(reply => (
              <View key={reply.id} style={[styles.replyCard, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                <View style={styles.replyHeader}>
                  <Text style={[styles.replyAuthor, { color: colors.text }]}>{reply.author.name}</Text>
                  <View style={styles.replyVotes}>
                    <Feather name="thumbs-up" size={12} color={colors.accent} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent, marginLeft: 4 }}>{reply.upvotes}</Text>
                  </View>
                </View>
                <Text style={[styles.replyContent, { color: colors.subtle }]}>{reply.message}</Text>
              </View>
            ))}
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
                  <Feather name="message-square" size={90} color="#FFFFFF" style={{ opacity: 0.1 }} />
                </Animated.View>

                <View style={styles.heroContent}>
                  <Text style={styles.heroKicker}>KOMUNITAS & DISKUSI</Text>
                  <Text style={styles.heroTitle}>Forum SAPA UMKM</Text>
                  <Text style={styles.heroSubtitle}>
                    Ruang kolaborasi untuk berbagi wawasan, bertanya seputar regulasi, dan terhubung dengan sesama pelaku usaha di seluruh Indonesia.
                  </Text>

                  <View style={styles.heroStats}>
                    <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>{topics.length}</Text>
                      <Text style={styles.heroStatLabel}>Topik</Text>
                    </View>
                    <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>
                        {topics.reduce((acc, topic) => acc + (topic.replies?.length || 0), 0)}
                      </Text>
                      <Text style={styles.heroStatLabel}>Balasan</Text>
                    </View>
                    <View style={styles.heroStatItem}>
                      <Text style={styles.heroStatValue}>{availableTags.length}</Text>
                      <Text style={styles.heroStatLabel}>Kategori</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.searchHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Cari Diskusi</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Jelajahi pertanyaan atau bagikan pengalaman Anda.
                </Text>
              </View>
              <View style={[styles.searchBar, { backgroundColor: `${colors.subtle}08`, borderColor: 'transparent' }]}>
                <Feather name="search" size={16} color={colors.accent} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Cari topik, kata kunci, atau kategori..."
                  placeholderTextColor={`${colors.subtle}50`}
                  style={[
                    styles.searchInput,
                    { color: colors.text },
                    Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                  ]}
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
    padding: 20,
    gap: 20,
    paddingBottom: 48,
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
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 4,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    gap: 2,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.7,
  },
  searchHeader: {
    gap: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
  },
  filterRow: {
    gap: 16,
  },
  tagScroll: {
    flexDirection: 'row',
    gap: 10,
  },
  tagFilter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  tagFilterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sortMenu: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700',
  },
  topicCard: {
    borderRadius: 32,
    padding: 20,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
  },
  topicTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  pinnedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  topicContent: {
    gap: 8,
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  topicSummary: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expandText: {
    fontSize: 13,
    fontWeight: '700',
  },
  repliesContainer: {
    marginTop: 8,
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  replyTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  replyCard: {
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyAuthor: {
    fontSize: 13,
    fontWeight: '700',
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