import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
const LOGO_IMG = require('../../assets/images/logo.png');

import { useAuth } from '@/hooks/use-auth';
import { availableTags, forumTopics } from '../../constants/forumData';

const palette = {
  light: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    primary: '#1B5CC4',
    accent: '#15B79F',
    text: '#0F1B3A',
    subtle: '#66728F',
    border: '#E1E6F3',
    badge: 'rgba(27, 92, 196, 0.12)',
    success: '#16A34A',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',
    accent: '#34D399',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    border: '#273449',
    badge: 'rgba(59, 130, 246, 0.16)',
    success: '#22C55E',
  },
};

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type QuickLink = {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
  targetCategory: ServiceCategory['id'];
};

type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: FeatherIconName;
  items: string[];
  color: string;
};

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
};

const quickLinks: QuickLink[] = [
  {
    id: 'nib',
    title: 'Status Izin Usaha',
    subtitle: 'Pantau NIB & legalitas',
    icon: 'file-text',
    targetCategory: 'layanan',
  },
  {
    id: 'brand',
    title: 'Manajemen Merek',
    subtitle: 'Kelola sertifikat merek',
    icon: 'tag',
    targetCategory: 'layanan',
  },
  {
    id: 'program',
    title: 'Ajukan Program KUR',
    subtitle: 'Simulasi dan pengajuan',
    icon: 'credit-card',
    targetCategory: 'pemberdayaan',
  },
  {
    id: 'inkubasi',
    title: 'Program Inkubasi',
    subtitle: 'Mentor & bimbingan',
    icon: 'compass',
    targetCategory: 'pemberdayaan',
  },
  {
    id: 'report',
    title: 'Pelaporan Usaha',
    subtitle: 'Upload laporan perkembangan',
    icon: 'pie-chart',
    targetCategory: 'pelaporan',
  },
  {
    id: 'community',
    title: 'Forum Komunitas',
    subtitle: 'Diskusi antar UMKM',
    icon: 'users',
    targetCategory: 'komunitas',
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    id: 'layanan',
    title: 'A. Layanan Publik & Perizinan',
    description: 'Permohonan legalitas usaha Anda.',
    icon: 'shield',
    color: '#3B82F6',
    items: [
      'Pengajuan & pembaruan NIB.',
      'Registrasi dan manajemen merek produk.',
      'Pengajuan sertifikasi (Halal, SNI, dsb).',
    ],
  },
  {
    id: 'pemberdayaan',
    title: 'B. Program Pemberdayaan Pemerintah',
    description: 'Akses bantuan pembiayaan dan pendampingan.',
    icon: 'layers',
    color: '#10B981',
    items: [
      'Pendaftaran Program KUR, UMi, dan LPDB.',
      'Informasi program inkubasi & bimbingan.',
      'Panduan kelayakan dan dokumen persyaratan.',
    ],
  },
  {
    id: 'pelaporan',
    title: 'C. Pelaporan & Data Usaha',
    description: 'Kelola kewajiban pelaporan usaha.',
    icon: 'bar-chart-2',
    color: '#F59E0B',
    items: [
      'Pelaporan kegiatan dan perkembangan ke pemerintah.',
      'Pembaruan data profil UMKM (skala usaha, alamat, dsb).',
    ],
  },
  {
    id: 'komunitas',
    title: 'D. Komunitas & Jaringan',
    description: 'Bangun relasi dan kolaborasi.',
    icon: 'message-circle',
    color: '#8B5CF6',
    items: [
      'Forum komunikasi dan diskusi antar pelaku UMKM.',
      'Pendaftaran pelatihan anggota komunitas non-pemerintah.',
      'Informasi penyaluran program KemenKopUKM.',
    ],
  },
  {
    id: 'kompetensi',
    title: 'E. Peningkatan Kompetensi',
    description: 'Perluas pengetahuan dengan materi pelatihan.',
    icon: 'book-open',
    color: '#EC4899',
    items: [
      'Pendaftaran pelatihan teknis & manajemen dari KemenKopUKM.',
      'Modul pembelajaran mandiri E-Learning.',
    ],
  },
];

const timeline: TimelineItem[] = [
  {
    id: 'step-1',
    title: 'Lengkapi Profil UMKM',
    description: 'Isi data usaha dan unggah dokumen legalitas penting.',
    status: 'completed',
  },
  {
    id: 'step-2',
    title: 'Ajukan Program Bantuan',
    description: 'Pilih program (KUR/UMi/LPDB) yang sesuai kebutuhan modal.',
    status: 'in-progress',
  },
  {
    id: 'step-3',
    title: 'Ikuti Pelatihan Kompetensi',
    description: 'Tingkatkan skill dengan modul pelatihan terkini.',
    status: 'upcoming',
  },
];

import {
  fetchMyCertificates,
  fetchSubmissions,
  getCommunityPosts,
  likePost,
  updateUserProfile
} from '@/lib/api';

type PremiumInteractionButtonProps = {
  icon: FeatherIconName;
  count?: number;
  colors: typeof palette.light;
  onPress?: () => void;
};

function PremiumInteractionButton({ icon, count, colors, onPress }: PremiumInteractionButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: isPressed ? `${colors.primary}08` : 'transparent',
        }}
      >
        <Feather name={icon} size={18} color={isPressed ? colors.primary : colors.subtle} />
        {count !== undefined && (
          <Text
            style={{
              fontSize: 13,
              color: isPressed ? colors.primary : colors.subtle,
            }}
          >
            {count}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

type AnimatedPostCardProps = {
  post: any;
  index: number;
  colors: typeof palette.light;
  styles: any;
  onLike?: () => void;
  onComment?: () => void;
};

function AnimatedPostCard({ post, index, colors, styles, onLike, onComment }: AnimatedPostCardProps) {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
    Animated.spring(cardAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: cardAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Premium Card with Left Accent */}
        <View style={{ flexDirection: 'row' }}>
          {/* Left Accent Bar */}
          <Animated.View
            style={{
              width: shadowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 5],
              }),
              backgroundColor: colors.primary,
            }}
          />

          {/* Main Content Area */}
          <View style={{ flex: 1, padding: 20 }}>
            {/* Author Section */}
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                {/* Minimalist Avatar */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${colors.primary}10`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: `${colors.primary}20`,
                  }}
                >
                  <Feather name="user" size={18} color={colors.primary} />
                </View>

                {/* Author Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.text,
                        letterSpacing: -0.2,
                      }}
                    >
                      {post.author_name}
                    </Text>
                    {post.is_verified && (
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          backgroundColor: colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Feather name="check" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, color: colors.subtle, letterSpacing: 0.3 }}>
                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>

                {/* Category Pill */}
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: `${colors.primary}08`,
                    borderWidth: 1,
                    borderColor: `${colors.primary}15`,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.primary,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    {post.category || 'Umum'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Content Section */}
            <View style={{ marginBottom: 16 }}>
              {post.title && (
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    lineHeight: 24,
                    marginBottom: 8,
                    letterSpacing: -0.3,
                  }}
                >
                  {post.title}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  lineHeight: 22,
                  opacity: 0.85,
                  letterSpacing: -0.1,
                }}
                numberOfLines={3}
              >
                {post.content}
              </Text>
            </View>

            {/* Divider Line */}
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginBottom: 14,
                opacity: 0.5,
              }}
            />

            {/* Interaction Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <PremiumInteractionButton
                icon="heart"
                count={post.likes || 0}
                colors={colors}
                onPress={onLike}
              />
              <PremiumInteractionButton
                icon="message-circle"
                count={post.comments_count || 0}
                colors={colors}
                onPress={onComment}
              />
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  Share.share({
                    message: `[SAPA UMKM Komunitas]\n\n${post.author_name} berbagi: "${post.title || post.content.substring(0, 50)}..."\n\nBaca selengkapnya di aplikasi SAPA UMKM!`,
                  });
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: `${colors.primary}08`,
                }}
              >
                <Feather name="share-2" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Animated Shadow Overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: shadowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 3],
            }),
            backgroundColor: colors.primary,
            opacity: shadowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.05],
            }),
          }}
        />
      </TouchableOpacity>

      {/* External Shadow Effect */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
          backgroundColor: 'transparent',
          elevation: shadowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 12],
          }),
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: shadowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.25],
          }),
          shadowRadius: shadowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 16],
          }),
          zIndex: -1,
        }}
      />
    </Animated.View>
  );
}

export default function UserDashboardScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'community' | 'profile'>('overview');
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [certsCount, setCertsCount] = useState(0);

  // Community State
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Umum');
  const [posting, setPosting] = useState(false);

  // Ultra-Premium Animations
  const titleFocusAnim = useRef(new Animated.Value(0)).current;
  const contentFocusAnim = useRef(new Animated.Value(0)).current;
  const meshMotionAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const chipPopAnim = useRef(new Animated.Value(0)).current;
  const loaderRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(meshMotionAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(meshMotionAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (posting) {
      Animated.loop(
        Animated.timing(loaderRotateAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ).start();
    } else {
      loaderRotateAnim.setValue(0);
    }
  }, [posting]);

  const handleTitleFocus = () => {
    Animated.spring(titleFocusAnim, { toValue: 1, useNativeDriver: false, friction: 8 }).start();
  };
  const handleTitleBlur = () => {
    Animated.timing(titleFocusAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const handleContentFocus = () => {
    Animated.spring(contentFocusAnim, { toValue: 1, useNativeDriver: false, friction: 8 }).start();
  };
  const handleContentBlur = () => {
    Animated.timing(contentFocusAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const triggerChipPop = () => {
    chipPopAnim.setValue(0);
    Animated.spring(chipPopAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
  };

  const isPostValid = newPostTitle.length >= 5 && newPostContent.length >= 10;

  useEffect(() => {
    Animated.spring(buttonScaleAnim, {
      toValue: isPostValid ? 1 : 0.95,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, [isPostValid]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Edit Profile State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    ownerName: '',
    businessName: '',
    phone: '',
    businessAddress: ''
  });
  const [updating, setUpdating] = useState(false);

  const openEditModal = () => {
    if (!user) return;
    setEditForm({
      displayName: user.displayName || '',
      ownerName: user.profile?.ownerName || '',
      businessName: user.profile?.businessName || '',
      phone: user.profile?.phone || '',
      businessAddress: user.profile?.businessAddress || ''
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    if (!user?.token) return;
    setUpdating(true);
    try {
      const payload = {
        displayName: editForm.displayName,
        profile: {
          ownerName: editForm.ownerName,
          businessName: editForm.businessName,
          phone: editForm.phone,
          businessAddress: editForm.businessAddress
        }
      };

      const response = await updateUserProfile(user.token, payload);
      if (response.success) {
        Alert.alert('Sukses', 'Profil berhasil diperbarui. Silakan login ulang untuk melihat perubahan.', [
          {
            text: 'OK', onPress: () => {
              setEditModalVisible(false);
              logout(); // Logout to refresh data easily for now
              router.replace('/login');
            }
          }
        ]);
      } else {
        Alert.alert('Gagal', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui profil.');
    } finally {
      setUpdating(false);
    }
  };

  const loadSubmissions = async () => {
    if (!user?.token) return;
    const response = await fetchSubmissions(user.token);
    if (response.success) {
      setSubmissions(response.data);
    }
  };

  const loadCertificatesCount = async () => {
    if (!user?.token) return;
    try {
      const response = await fetchMyCertificates(user.token);
      if (response.success) {
        setCertsCount(response.data.length);
      }
    } catch (error) {
      console.error('Error loading certs count:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      // Start with static forum topics mapped to the dashboard's post structure
      const staticPosts = forumTopics.map(topic => ({
        id: topic.id,
        author_name: topic.author.name,
        category: topic.tags[0],
        created_at: topic.createdAt,
        title: topic.title,
        content: topic.summary,
        likes: topic.replies.reduce((acc, r) => acc + r.upvotes, 0),
        comments_count: topic.replies.length,
        is_verified: topic.author.role !== 'Pelaku UMKM',
      }));

      const data = await getCommunityPosts(user?.token, user?.id?.toString());
      if (data && Array.isArray(data)) {
        // Merge static posts with remote posts, avoid duplicates if any
        setPosts([...data, ...staticPosts.filter((sp: any) => !data.some((p: any) => p.id === sp.id))]);
      } else {
        setPosts(staticPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(forumTopics.map(topic => ({
        id: topic.id,
        author_name: topic.author.name,
        category: topic.tags[0],
        created_at: topic.createdAt,
        title: topic.title,
        content: topic.summary,
        likes: topic.replies.reduce((acc, r) => acc + r.upvotes, 0),
        comments_count: topic.replies.length,
        is_verified: topic.author.role !== 'Pelaku UMKM',
      })));
    }
  };

  const handleLikePost = async (postId: string | number) => {
    if (!user?.token) return;
    try {
      const response = await likePost(user.token, postId);
      if (response.success) {
        // Optimistic update or just refetch
        fetchPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setPosting(true);
    try {
      const response = await fetch('http://localhost:3000/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          author_name: user?.displayName || user?.profile?.ownerName || 'Anonim',
          content: newPostContent
        }),
      });

      if (response.ok) {
        setNewPostTitle('');
        setNewPostContent('');
        setSelectedCategory('Umum');
        setCreatePostModalVisible(false);
        fetchPosts();
        Alert.alert('Sukses', 'Postingan berhasil dibuat');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat postingan');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    } else if (user?.token) {
      loadSubmissions();
      fetchPosts();
      loadCertificatesCount();
    }
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  const approvedSubmissions = submissions.filter(s => s.status === 'approved');

  if (loading || !user || initialLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }



  const accountLabel =
    user.displayName ||
    user.profile?.ownerName ||
    user.profile?.businessName ||
    user.email;

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleComingSoon = (title: string) => {
    Alert.alert(title, 'Fitur lengkap segera tersedia.');
  };

  const handleNavigateToService = (categoryId: string) => {
    router.push({ pathname: '/services/[category]', params: { category: categoryId } });
  };

  const statBadges = [
    { label: 'Program Aktif', value: '4', icon: 'layers' as FeatherIconName, accent: '#38BDF8' },
    { label: 'Tugas Minggu Ini', value: '2', icon: 'check-square' as FeatherIconName, accent: '#FACC15' },
    { label: 'Diskusi Terbaru', value: '8', icon: 'message-circle' as FeatherIconName, accent: '#A855F7' },
  ];

  const profileDetails = [
    { label: 'Email Akun', value: user.email, icon: 'mail' as FeatherIconName },
    { label: 'Nama Pemilik', value: user.profile?.ownerName, icon: 'user' as FeatherIconName },
    { label: 'Nama Usaha', value: user.profile?.businessName, icon: 'briefcase' as FeatherIconName },
    { label: 'Sektor Usaha', value: user.profile?.sector, icon: 'grid' as FeatherIconName },
    { label: 'Kode KBLI', value: user.profile?.kbli, icon: 'hash' as FeatherIconName },
    {
      label: 'Alamat Usaha',
      value: [user.profile?.businessAddress, user.profile?.city].filter(Boolean).join(', '),
      icon: 'map-pin' as FeatherIconName,
    },
    { label: 'Kontak Telepon', value: user.profile?.phone, icon: 'phone' as FeatherIconName },
    { label: 'Kontak Email', value: user.profile?.contactEmail, icon: 'at-sign' as FeatherIconName },
    { label: 'Skala Usaha', value: user.profile?.scale, icon: 'bar-chart' as FeatherIconName },
    { label: 'Estimasi Modal', value: user.profile?.capital, icon: 'dollar-sign' as FeatherIconName },
    { label: 'Jumlah Tenaga Kerja', value: user.profile?.employees, icon: 'users' as FeatherIconName },
    { label: 'Deskripsi Usaha', value: user.profile?.businessDescription, icon: 'file-text' as FeatherIconName },
    { label: 'Kebutuhan Dukungan', value: user.profile?.supportNeeds, icon: 'help-circle' as FeatherIconName },
  ].filter(detail => detail.value && detail.value.toString().trim().length > 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={scheme === 'dark' ? ['#1E3A8A', '#1E1B4B'] : ['#1D4ED8', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Enhanced Decorative Elements */}
          <View
            style={{
              position: 'absolute',
              top: -100,
              right: -80,
              width: 280,
              height: 280,
              borderRadius: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -120,
              left: -60,
              width: 250,
              height: 250,
              borderRadius: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }}
          />

          {/* Premium Top Bar (Redesigned) */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            {/* Ultra-Premium Glass Account Card */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                paddingRight: 24,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.25)',
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Feather name="user" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    color: 'rgba(255, 255, 255, 0.7)',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 1,
                  }}
                >
                  Akun
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#FFFFFF',
                    letterSpacing: -0.2,
                  }}
                >
                  {user?.displayName || 'Budi Santoso'}
                </Text>
              </View>
            </View>

            {/* Clean Premium Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <Feather name="log-out" size={18} color="#2563EB" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#2563EB',
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hero Content with Premium Typography (Centered) */}
          <View style={{ marginBottom: 32, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 8,
                letterSpacing: 0.2,
                textAlign: 'center',
              }}
            >
              Selamat datang kembali 👋
            </Text>
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 16,
                letterSpacing: -1,
                lineHeight: 40,
                textAlign: 'center',
              }}
            >
              Dashboard UMKM Anda
            </Text>
            <Image
              source={LOGO_IMG}
              style={{ width: 120, height: 120, marginBottom: 20, borderRadius: 30 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 15,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 24,
                letterSpacing: 0.2,
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              Kelola dokumen legalitas usaha, akses berbagai program bantuan dan pembiayaan dari pemerintah, ikuti pelatihan dan sertifikasi profesional, serta terhubung dengan komunitas UMKM untuk menumbuhkan dan mengembangkan usaha Anda secara berkelanjutan.
            </Text>
          </View>

          {/* Ultra-Premium Glass Stat Cards (Horizontal Row) */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {statBadges.map((badge, index) => (
              <TouchableOpacity
                key={badge.label}
                activeOpacity={0.9}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.08)']}
                  style={{ padding: 12, alignItems: 'center', gap: 8 }}
                >
                  {/* Compact Icon with Layered effect */}
                  <View style={{ position: 'relative' }}>
                    <View
                      style={{
                        position: 'absolute',
                        top: -3,
                        left: -3,
                        right: -3,
                        bottom: -3,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    />
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <Feather name={badge.icon} size={18} color="#FFFFFF" />
                    </LinearGradient>
                  </View>

                  {/* Stats Content Stack */}
                  <View style={{ alignItems: 'center', gap: 2 }}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: '800',
                        color: '#FFFFFF',
                        letterSpacing: -0.5,
                        lineHeight: 30,
                      }}
                    >
                      {badge.value}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 0.2,
                      }}
                    >
                      {badge.label.split(' ')[0]}
                    </Text>
                  </View>

                  {/* Slim Progress Bar */}
                  <View
                    style={{
                      width: '100%',
                      height: 3,
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      borderRadius: 10,
                      overflow: 'hidden',
                      marginTop: 2,
                    }}
                  >
                    <Animated.View
                      style={{
                        width: `${parseInt(badge.value) * 15}%`,
                        height: '100%',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 10,
                        opacity: 0.9,
                      }}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.tabContainer}>
          {[
            { key: 'overview', label: 'Ringkasan', icon: 'grid' },
            { key: 'services', label: 'Layanan', icon: 'layers' },
            { key: 'community', label: 'Komunitas', icon: 'users' },
            { key: 'profile', label: 'Profil', icon: 'user' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
              style={[
                styles.tabButton,
                activeTab === tab.key && { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
              ]}>
              <Feather
                name={tab.icon as FeatherIconName}
                size={16}
                color={activeTab === tab.key ? '#2563EB' : '#94A3B8'}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  { color: activeTab === tab.key ? '#2563EB' : '#64748B' },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && (
          <View style={{ gap: 24 }}>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Legalitas & Sertifikasi Anda</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Dokumen yang telah diterbitkan dan aktif.
                </Text>
              </View>

              {submissions.filter(s => s.status === 'approved').length > 0 ? (
                <View style={{ gap: 12 }}>
                  {submissions.filter(s => s.status === 'approved').map(sub => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => router.push({ pathname: '/user/submission/[id]', params: { id: sub.id, type: sub.type } })}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        backgroundColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#BBF7D0'
                      }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: colors.surface,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Feather name={
                          sub.type.toLowerCase() === 'nib' ? 'shield' :
                            sub.type.toLowerCase() === 'merek' ? 'tag' : 'award'
                        } size={20} color={colors.success} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                          {sub.type.toUpperCase() === 'NIB' ? 'Nomor Induk Berusaha (NIB)' :
                            sub.type.toUpperCase() === 'MEREK' ? 'Sertifikat Merek' : sub.type.toUpperCase()}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.subtle }}>
                          Telah Terbit • {new Date(sub.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.surface, borderRadius: 99 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>AKTIF</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyState, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }]}>
                  <View style={{
                    width: 48, height: 48, borderRadius: 24,
                    backgroundColor: `${colors.primary}15`,
                    alignItems: 'center', justifyContent: 'center', marginBottom: 12
                  }}>
                    <Feather name="shield" size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyStateText, { color: colors.subtle }]}>
                    Belum ada legalitas atau sertifikasi yang terbit.
                  </Text>
                </View>
              )}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Langkah Perkembangan</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                Ikuti alur berikut untuk memastikan usaha Anda berkembang maksimal.
              </Text>
              <View style={styles.timeline}>
                {timeline.map(step => (
                  <View
                    key={step.id}
                    style={[
                      styles.timelineItem,
                      {
                        borderColor: colors.border,
                        backgroundColor: scheme === 'dark' ? '#1E293B' : '#F9FAFB',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.timelineIndicator,
                        step.status === 'completed' && styles.timelineIndicatorCompleted,
                        step.status === 'in-progress' && styles.timelineIndicatorProgress,
                        step.status === 'upcoming' && {
                          backgroundColor:
                            scheme === 'dark' ? 'rgba(148, 163, 184, 0.18)' : 'rgba(150, 163, 187, 0.18)',
                        },
                      ]}
                    >
                      <Feather
                        name={
                          step.status === 'completed'
                            ? 'check'
                            : step.status === 'in-progress'
                              ? 'activity'
                              : 'circle'
                        }
                        size={16}
                        color={step.status === 'upcoming' ? colors.subtle : '#FFFFFF'}
                      />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, { color: colors.text }]}>{step.title}</Text>
                      <Text style={[styles.timelineDescription, { color: colors.subtle }]}>
                        {step.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'services' && (
          <View style={{ gap: 28, paddingBottom: 40, position: 'relative' }}>
            {/* Decorative Background Elements */}
            <View style={{ position: 'absolute', top: -50, right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: `${colors.primary}08`, zIndex: 0 }} />
            <View style={{ position: 'absolute', bottom: 100, left: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: `${colors.accent}08`, zIndex: 0 }} />

            {/* Ultra-Premium Section Header */}
            <View style={{ alignItems: 'center', marginBottom: 8, zIndex: 1 }}>
              <LinearGradient
                colors={[`${colors.primary}15`, `${colors.primary}08`]}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderRadius: 24,
                  borderWidth: 1.5,
                  borderColor: `${colors.primary}25`,
                  marginBottom: 16,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 5
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 2, textTransform: 'uppercase' }}>
                  ✦ Layanan & Program ✦
                </Text>
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 34, fontWeight: '700', letterSpacing: -1.2, textAlign: 'center', marginBottom: 8 }]}>
                Ekosistem Terpadu
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle, textAlign: 'center', marginTop: 4, maxWidth: '90%', fontSize: 15, lineHeight: 22 }]}>
                Akses seluruh layanan publik dan pemberdayaan UMKM dalam satu platform yang elegan dan terintegrasi.
              </Text>
            </View>

            {/* Enhanced Glassmorphic Category Cards */}
            <View style={{ gap: 24, zIndex: 1 }}>
              {serviceCategories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.92}
                  onPress={() => handleNavigateToService(category.id)}
                  style={{
                    borderRadius: 32,
                    overflow: 'hidden',
                    backgroundColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                    borderWidth: 2,
                    borderColor: `${category.color}20`,
                    elevation: 12,
                    shadowColor: category.color,
                    shadowOffset: { width: 0, height: 16 },
                    shadowOpacity: 0.18,
                    shadowRadius: 28,
                  }}>
                  <LinearGradient
                    colors={scheme === 'dark'
                      ? [`${category.color}18`, `${category.color}08`, 'rgba(0,0,0,0.1)']
                      : ['rgba(255, 255, 255, 1)', `${category.color}05`, 'rgba(248, 250, 252, 0.98)']}
                    style={{ padding: 26, position: 'relative' }}
                  >
                    {/* Decorative Corner Blob */}
                    <View
                      style={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                        backgroundColor: `${category.color}10`,
                        zIndex: 0
                      }}
                    />

                    {/* Accent Line */}
                    <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: category.color,
                      opacity: 0.6
                    }} />

                    <View style={[styles.categoryHeader, { zIndex: 1, marginBottom: 20 }]}>
                      {/* Enhanced Icon Container */}
                      <View style={{ position: 'relative' }}>
                        {/* Outer glow ring */}
                        <View style={{
                          position: 'absolute',
                          top: -6, left: -6, right: -6, bottom: -6,
                          borderRadius: 24,
                          borderWidth: 2,
                          borderColor: `${category.color}15`,
                          backgroundColor: `${category.color}05`
                        }} />
                        {/* Middle ring */}
                        <View style={{
                          position: 'absolute',
                          top: -3, left: -3, right: -3, bottom: -3,
                          borderRadius: 22,
                          borderWidth: 1.5,
                          borderColor: `${category.color}25`
                        }} />
                        <LinearGradient
                          colors={[`${category.color}30`, `${category.color}15`]}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: `${category.color}40`,
                            shadowColor: category.color,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 8
                          }}>
                          <Feather name={category.icon as FeatherIconName} size={28} color={category.color} />
                        </LinearGradient>
                      </View>

                      <View style={[styles.categoryTexts, { flex: 1, marginLeft: 18 }]}>
                        <Text style={[styles.categoryTitle, { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 4 }]}>
                          {category.title.includes('. ') ? category.title.split('. ')[1] : category.title}
                        </Text>
                        <Text style={[styles.categoryDescription, { color: colors.subtle, fontSize: 14, marginTop: 2, lineHeight: 20 }]}>
                          {category.description}
                        </Text>
                      </View>

                      {/* Enhanced Arrow Button */}
                      <View style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: `${category.color}15`,
                        borderWidth: 1.5,
                        borderColor: `${category.color}30`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: category.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4
                      }}>
                        <Feather name="arrow-right" size={20} color={category.color} />
                      </View>
                    </View>

                    {/* Enhanced Items List */}
                    <View style={{
                      padding: 18,
                      backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.25)' : `${category.color}03`,
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: `${category.color}15`,
                      gap: 14,
                      zIndex: 1
                    }}>
                      {category.items.map((item, idx) => (
                        <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                          <View style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: `${category.color}20`,
                            borderWidth: 1.5,
                            borderColor: `${category.color}40`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 2
                          }}>
                            <Feather name="check" size={14} color={category.color} strokeWidth={3} />
                          </View>
                          <Text style={{
                            flex: 1,
                            fontSize: 14,
                            color: colors.text,
                            opacity: 0.92,
                            fontWeight: '500',
                            lineHeight: 21
                          }}>
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'community' && (
          <View style={{ gap: 24 }}>
            {/* Premium Gradient Header Card */}
            <View
              style={{
                borderRadius: 28,
                overflow: 'hidden',
                marginBottom: 8,
                elevation: 8,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
              }}
            >
              <View
                style={{
                  padding: 24,
                  paddingBottom: 28,
                  position: 'relative',
                  backgroundColor: scheme === 'dark' ? colors.surface : '#FFFFFF',
                }}
              >
                {/* Subtle Decorative Elements */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                  <View
                    style={{
                      position: 'absolute',
                      top: -60,
                      right: -40,
                      width: 180,
                      height: 180,
                      borderRadius: 999,
                      backgroundColor: `${colors.primary}03`,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -80,
                      left: -50,
                      width: 200,
                      height: 200,
                      borderRadius: 999,
                      backgroundColor: `${colors.primary}02`,
                    }}
                  />
                </View>

                {/* Header Content */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          backgroundColor: `${colors.primary}12`,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1.5,
                          borderColor: `${colors.primary}20`,
                        }}
                      >
                        <Feather name="users" size={22} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 24,
                            color: colors.text,
                            letterSpacing: -0.5,
                          }}
                        >
                          Komunitas UMKM
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.subtle,
                        lineHeight: 20,
                      }}
                    >
                      Diskusi dan berbagi pengalaman dengan sesama pelaku usaha.
                    </Text>
                  </View>

                  {/* Premium Create Post Button */}
                  <TouchableOpacity
                    onPress={() => setCreatePostModalVisible(true)}
                    activeOpacity={0.8}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 6,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      marginLeft: 12,
                    }}
                  >
                    <Feather name="plus" size={26} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Stats Bar */}
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginTop: 20,
                    paddingTop: 20,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.text }}>
                      {posts.length}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.subtle }}>Diskusi</Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.text }}>24</Text>
                    <Text style={{ fontSize: 12, color: colors.subtle }}>Anggota</Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.text }}>48</Text>
                    <Text style={{ fontSize: 12, color: colors.subtle }}>Aktif</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Posts Container */}
            <View>
              {posts.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: 24,
                      borderWidth: 1.5,
                      padding: 40,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 999,
                      backgroundColor: `${colors.primary}08`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Feather name="message-square" size={40} color={colors.primary} style={{ opacity: 0.6 }} />
                  </View>
                  <Text style={[styles.emptyStateText, { color: colors.text, fontSize: 16, marginBottom: 8 }]}>
                    Belum ada diskusi
                  </Text>
                  <Text style={{ color: colors.subtle, fontSize: 14, textAlign: 'center' }}>
                    Mulailah percakapan dan bagikan pengalaman Anda!
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  {posts.map((post, index) => (
                    <AnimatedPostCard
                      key={post.id}
                      post={post}
                      index={index}
                      colors={colors}
                      styles={styles}
                      onLike={() => handleLikePost(post.id)}
                      onComment={() => router.push({ pathname: '/user/community/[id]', params: { id: post.id } })}
                    />
                  ))}
                </View>
              )}
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={createPostModalVisible}
              onRequestClose={() => setCreatePostModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.modalKeyboardAvoid}
                >
                  <View style={[styles.createPostContainer, { backgroundColor: colors.background }]}>
                    {/* Ultra-Premium Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: colors.surface,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setCreatePostModalVisible(false)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 4,
                        }}
                      >
                        <Text style={{ fontSize: 15, color: colors.subtle }}>Batal</Text>
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.text,
                          letterSpacing: -0.2,
                        }}
                      >
                        Buat Postingan
                      </Text>

                      <TouchableOpacity
                        onPress={handleCreatePost}
                        disabled={posting || !isPostValid}
                        activeOpacity={0.7}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 10,
                          backgroundColor: !isPostValid ? `${colors.primary}10` : colors.primary,
                        }}
                      >
                        {posting ? (
                          <Animated.View
                            style={{
                              transform: [
                                {
                                  rotate: loaderRotateAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                  }),
                                },
                              ],
                            }}
                          >
                            <Feather name="loader" size={14} color={colors.surface} />
                          </Animated.View>
                        ) : (
                          <Text
                            style={{
                              fontSize: 14,
                              color: !isPostValid ? `${colors.primary}50` : '#FFFFFF',
                              letterSpacing: -0.1,
                            }}
                          >
                            Unggah
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                      <View style={{ padding: 20, gap: 16 }}>
                        {/* User Info Card */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            padding: 16,
                            backgroundColor: colors.surface,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 14,
                              backgroundColor: `${colors.primary}10`,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 1,
                              borderColor: `${colors.primary}20`,
                            }}
                          >
                            <Feather name="user" size={22} color={colors.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 15,
                                color: colors.text,
                                marginBottom: 4,
                                letterSpacing: -0.2,
                              }}
                            >
                              {user?.displayName || 'Budi Santoso'}
                            </Text>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                alignSelf: 'flex-start',
                                paddingVertical: 2,
                              }}
                            >
                              <Text style={{ fontSize: 13, color: colors.primary }}>{selectedCategory}</Text>
                              <Feather name="chevron-down" size={14} color={colors.primary} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Title Input Card */}
                        <View
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: `${colors.border}40`,
                            paddingVertical: 16,
                            paddingHorizontal: 4,
                          }}
                        >
                          <TextInput
                            placeholder="Judul Diskusi"
                            placeholderTextColor={`${colors.subtle}50`}
                            maxLength={100}
                            style={[
                              {
                                fontSize: 18,
                                color: colors.text,
                                letterSpacing: -0.3,
                                padding: 0,
                              },
                              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            value={newPostTitle}
                            onChangeText={setNewPostTitle}
                          />
                        </View>

                        {/* Content Input Card */}
                        <View
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: colors.border,
                            padding: 16,
                            minHeight: 200,
                          }}
                        >
                          <TextInput
                            multiline
                            placeholder="Apa yang ingin Anda bagikan atau tanyakan hari ini?"
                            placeholderTextColor={`${colors.subtle}50`}
                            maxLength={2000}
                            style={[
                              {
                                fontSize: 15,
                                color: colors.text,
                                lineHeight: 24,
                                letterSpacing: -0.1,
                                padding: 0,
                                textAlignVertical: 'top',
                              },
                              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                          />
                        </View>

                        {/* Character Count */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              color: newPostContent.length >= 1900 ? '#EF4444' : colors.subtle,
                            }}
                          >
                            {newPostContent.length}/2000 karakter
                          </Text>
                          {newPostContent.length > 0 && (
                            <TouchableOpacity onPress={() => setNewPostContent('')}>
                              <Text style={{ fontSize: 13, color: colors.primary }}>Hapus Semua</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Premium Media Toolbar */}
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            paddingVertical: 8,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              backgroundColor: `${colors.primary}08`,
                              borderWidth: 1,
                              borderColor: `${colors.primary}15`,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Feather name="image" size={20} color={colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              backgroundColor: '#F0FDF408',
                              borderWidth: 1,
                              borderColor: '#16A34A15',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Feather name="bar-chart-2" size={20} color="#16A34A" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              backgroundColor: '#FEF2F208',
                              borderWidth: 1,
                              borderColor: '#DC262615',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Feather name="link" size={20} color="#DC2626" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              backgroundColor: '#F5F3FF08',
                              borderWidth: 1,
                              borderColor: '#7C3AED15',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Feather name="map-pin" size={20} color="#7C3AED" />
                          </TouchableOpacity>
                        </View>

                        {/* Category Selector */}
                        <View style={{ marginTop: 8, paddingBottom: 40 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.subtle,
                              letterSpacing: 1,
                              textTransform: 'uppercase',
                              marginBottom: 12,
                            }}
                          >
                            Pilih Kategori
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              gap: 10,
                            }}
                          >
                            {['Umum', ...availableTags].map((cat) => {
                              const isSelected = selectedCategory === cat;
                              return (
                                <TouchableOpacity
                                  key={cat}
                                  onPress={() => {
                                    setSelectedCategory(cat);
                                    triggerChipPop();
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <View
                                    style={{
                                      paddingHorizontal: 16,
                                      paddingVertical: 10,
                                      borderRadius: 12,
                                      backgroundColor: isSelected ? `${colors.primary}12` : colors.surface,
                                      borderWidth: 1.5,
                                      borderColor: isSelected ? `${colors.primary}30` : colors.border,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        color: isSelected ? colors.primary : colors.subtle,
                                        letterSpacing: -0.1,
                                      }}
                                    >
                                      {cat}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </Modal>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={{ gap: 24 }}>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu Profil</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Kelola akun dan aktivitas Anda.
                </Text>
              </View>

              <View style={{ gap: 8 }}>
                {/* Stats Section */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                  {[
                    { label: 'Dokumen', value: submissions.filter(s => s.status === 'approved').length, icon: 'shield', color: colors.success },
                    { label: 'Postingan', value: posts.filter(p => String(p.user_id) === String(user.id)).length, icon: 'edit', color: colors.primary },
                    { label: 'Sertifikat', value: certsCount, icon: 'award', color: '#8B5CF6' },
                  ].map((stat, i) => (
                    <View key={stat.label} style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 20,
                      backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      borderWidth: 1,
                      borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Feather name={stat.icon as any} size={20} color={stat.color} />
                      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{stat.value}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '500', color: colors.subtle, textTransform: 'uppercase' }}>{stat.label}</Text>
                    </View>
                  ))}
                </View>

                {[
                  { label: 'Edit Profil', icon: 'edit-3', action: openEditModal, color: colors.primary },
                  { label: 'Riwayat Pengajuan', icon: 'clock', action: () => router.push('/user/history'), color: '#F59E0B' },
                  { label: 'Sertifikat Pelatihan', icon: 'award', action: () => router.push('/user/certificates'), color: '#8B5CF6' },
                  { label: 'Pengaturan', icon: 'sliders', action: () => router.push('/user/settings'), color: '#64748B' },
                ].map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={item.action}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      borderWidth: 1,
                      borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    }}
                  >
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: `${item.color}15`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16
                    }}>
                      <Feather name={item.icon as FeatherIconName} size={20} color={item.color} />
                    </View>
                    <Text style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: '500',
                      color: colors.text
                    }}>
                      {item.label}
                    </Text>
                    <Feather name="chevron-right" size={20} color={colors.subtle} />
                  </TouchableOpacity>
                ))}

                {/* Prominent Logout Button */}
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 18,
                    borderRadius: 20,
                    backgroundColor: scheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                    borderWidth: 1.5,
                    borderColor: scheme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
                    marginTop: 12,
                    gap: 12
                  }}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Feather name="log-out" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#EF4444',
                    letterSpacing: -0.2
                  }}>
                    Keluar dari Sistem
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={editModalVisible}
              onRequestClose={() => setEditModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 24, gap: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Edit Profil</Text>
                      <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                        <Feather name="x" size={20} color={colors.subtle} />
                      </TouchableOpacity>
                    </View>

                    <View style={{ gap: 12 }}>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Nama Tampilan (Akun)</Text>
                        <TextInput
                          value={editForm.displayName}
                          onChangeText={t => setEditForm(prev => ({ ...prev, displayName: t }))}
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }}
                        />
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Nama Pemilik</Text>
                        <TextInput
                          value={editForm.ownerName}
                          onChangeText={t => setEditForm(prev => ({ ...prev, ownerName: t }))}
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }}
                        />
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Nama Usaha</Text>
                        <TextInput
                          value={editForm.businessName}
                          onChangeText={t => setEditForm(prev => ({ ...prev, businessName: t }))}
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }}
                        />
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Nomor Telepon</Text>
                        <TextInput
                          value={editForm.phone}
                          onChangeText={t => setEditForm(prev => ({ ...prev, phone: t }))}
                          keyboardType="phone-pad"
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }}
                        />
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Alamat Usaha</Text>
                        <TextInput
                          value={editForm.businessAddress}
                          onChangeText={t => setEditForm(prev => ({ ...prev, businessAddress: t }))}
                          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleUpdateProfile}
                      disabled={updating}
                      style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 }}>
                      <Text style={{ color: '#FFF', fontWeight: '700' }}>{updating ? 'Menyimpan...' : 'Simpan Perubahan'}</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </Modal>
          </View>
        )}
      </ScrollView >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroDecorationOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -80,
    right: -60,
  },
  heroDecorationTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -70,
    left: -40,
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroUserLabel: {
    color: '#E2EBFF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#0F1B3A',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  logoutButtonText: {
    color: '#0F1B3A',
    fontSize: 13,
    fontWeight: '700',
  },
  heroHeader: {
    gap: 12,
  },
  heroHeadline: {
    gap: 4,
  },
  heroGreeting: {
    color: '#CFE5FF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexBasis: '48%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
    backgroundColor: 'rgba(27,92,196,0.04)',
  },
  detailLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  detailEmpty: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(27,92,196,0.04)',
  },
  detailEmptyText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    backgroundColor: '#F7F9FD',
  },
  quickIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  quickSubtitle: {
    fontSize: 13,
    color: '#5E6B85',
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  timelineIndicator: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 163, 187, 0.18)',
  },
  timelineIndicatorCompleted: {
    backgroundColor: '#22C55E',
  },
  timelineIndicatorProgress: {
    backgroundColor: '#F97316',
  },
  timelineContent: {
    flex: 1,
    gap: 6,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  timelineDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 0,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(27,92,196,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTexts: {
    flex: 1,
    gap: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryDescription: {
    fontSize: 13,
  },
  categoryItems: {
    gap: 10,
  },
  categoryItemRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  categoryItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 24,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 27, 58, 0.4)',
    justifyContent: 'flex-end',
  },
  modalKeyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  createPostContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modalPostButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalPostButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalScrollContent: {
    padding: 24,
    gap: 24,
  },
  modalSection: {
    gap: 12,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1B3A',
  },
  categoryScroll: {
    gap: 10,
    paddingRight: 20,
  },
  categoryTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 0,
  },
  categoryTagText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalInput: {
    borderRadius: 16,
    borderWidth: 0,
    padding: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  modalInputContent: {
    height: 180,
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    alignSelf: 'flex-end',
    fontWeight: '600',
    marginTop: -8,
  },
  tipsBox: {
    borderRadius: 20,
    borderWidth: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 20,
    gap: 12,
    marginBottom: 40,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  tipsList: {
    gap: 6,
  },
  tipsItem: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 18,
  },
  // New Modern Social Styles
  postCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 20,
    gap: 14,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  postCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthorGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  postAuthorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postAuthorName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  postCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  postCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  postTime: {
    fontSize: 12,
    marginTop: 1,
    opacity: 0.8,
  },
  postContentArea: {
    gap: 8,
  },
  postDisplayTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  postBodyText: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
  postInteractionBar: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalHeaderPremium: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
  },
  headerActionBtn: {
    padding: 4,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitleSimple: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  modalPostButtonPremium: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 100,
  },
  modalPostButtonTextPremium: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  modalComposeArea: {
    padding: 24,
    zIndex: 2,
  },
  composerMeshDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  meshBlobOne: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  meshBlobTwo: {
    position: 'absolute',
    bottom: 50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  composerUserInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  postAvatarSquare: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  composerUserNameBold: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  composerCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  composerCategoryTextBlue: {
    fontSize: 14,
    fontWeight: '700',
  },
  composerTitleInputLarge: {
    fontSize: 32,
    fontWeight: '600',
    paddingVertical: 12,
    letterSpacing: -1,
  },
  composerBodyInputFluid: {
    fontSize: 18,
    lineHeight: 28,
    minHeight: 180,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  composerBodyWrapper: {
    marginVertical: 12,
  },
  characterCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
  },
  mediaToolBar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingVertical: 8,
  },
  mediaToolBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerCategoryLabel: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 20,
    opacity: 0.5,
  },
  composerCategoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  composerPillChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  composerPillChipText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
