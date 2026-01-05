import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

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

import { fetchSubmissions, updateUserProfile } from '@/lib/api';

export default function UserDashboardScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'community' | 'profile'>('overview');
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);

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

      const response = await fetch('http://localhost:3000/api/community');
      if (response.ok) {
        const data = await response.json();
        // Merge static posts with remote posts, avoid duplicates if any
        setPosts([...staticPosts, ...data.filter((p: any) => !staticPosts.some(sp => sp.id === p.id))]);
      } else {
        setPosts(staticPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // Fallback to static topics if fetch fails
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
      setPosts(staticPosts);
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
          <View style={styles.heroDecorationOne} />
          <View style={styles.heroDecorationTwo} />

          <View style={styles.heroTopBar}>
            <View style={styles.heroUserInfo}>
              <View style={styles.heroAvatar}>
                <Feather name="user" size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.heroUserLabel}>Akun</Text>
                <Text style={styles.heroUserName}>{accountLabel}</Text>
              </View>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Feather name="log-out" size={16} color={colors.primary} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroHeader}>
            <View style={styles.heroHeadline}>
              <Text style={styles.heroGreeting}>Selamat datang kembali 👋</Text>
              <Text style={styles.heroTitle}>Dashboard UMKM Anda</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Kelola legalitas, akses bantuan pemerintah, dan ikuti pelatihan untuk menumbuhkan usaha secara berkelanjutan.
            </Text>
          </View>

          <View style={styles.heroStatsRow}>
            {statBadges.map((badge, index) => (
              <View
                key={badge.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                  }
                ]}
              >
                <View
                  style={[styles.statIconWrapper, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                >
                  <Feather name={badge.icon} size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.statValue}>{badge.value}</Text>
                  <Text style={styles.statLabel}>{badge.label}</Text>
                </View>
              </View>
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
          <View>
            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 24 }]}>Layanan & Program</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                Jelajahi dukungan komprehensif SAPA UMKM berdasarkan kategori.
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              {serviceCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.88}
                  onPress={() => handleNavigateToService(category.id)}
                  style={[
                    styles.categoryCard,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      padding: 24,
                    }
                  ]}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryIconWrapper, {
                      backgroundColor: `${colors.primary}15`,
                      width: 48,
                      height: 48,
                      borderRadius: 16
                    }]}>
                      <Feather name={category.icon as FeatherIconName} size={20} color={colors.primary} />
                    </View>
                    <View style={styles.categoryTexts}>
                      <Text style={[styles.categoryTitle, { color: colors.text, fontSize: 17 }]}>{category.title}</Text>
                      <Text style={[styles.categoryDescription, { color: colors.subtle }]}>
                        {category.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.categoryItems, { marginTop: 16, gap: 10 }]}>
                    {category.items.map(item => (
                      <View key={item} style={styles.categoryItemRow}>
                        <Feather name="check-circle" size={16} color={colors.accent} />
                        <Text style={[styles.categoryItemText, { color: colors.text }]}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'community' && (
          <View style={{ gap: 24 }}>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Komunitas UMKM</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                    Diskusi dan berbagi pengalaman dengan sesama pelaku usaha.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setCreatePostModalVisible(true)}
                  style={{
                    backgroundColor: colors.primary,
                    width: 44, height: 44, borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Feather name="plus" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {posts.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }]}>
                  <Feather name="message-square" size={48} color={colors.subtle} style={{ opacity: 0.5, marginBottom: 16 }} />
                  <Text style={[styles.emptyStateText, { color: colors.subtle }]}>
                    Belum ada diskusi. Mulailah percakapan!
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  {posts.map((post) => (
                    <View
                      key={post.id}
                      style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <View style={styles.postCardHeader}>
                        <View style={styles.postAuthorGroup}>
                          <View style={[styles.postAvatar, { backgroundColor: `${colors.primary}12` }]}>
                            <Feather name="user" size={18} color={colors.primary} />
                          </View>
                          <View>
                            <View style={styles.postAuthorNameRow}>
                              <Text style={[styles.postAuthorName, { color: colors.text }]}>{post.author_name}</Text>
                              {post.is_verified && <Feather name="check-circle" size={13} color={colors.primary} />}
                              <View style={[styles.postCategoryBadge, { backgroundColor: `${colors.primary}08` }]}>
                                <Text style={[styles.postCategoryText, { color: colors.primary }]}>{post.category || 'Umum'}</Text>
                              </View>
                            </View>
                            <Text style={[styles.postTime, { color: colors.subtle }]}>
                              {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.postContentArea}>
                        {post.title && <Text style={[styles.postDisplayTitle, { color: colors.text }]}>{post.title}</Text>}
                        <Text style={[styles.postBodyText, { color: colors.text }]}>
                          {post.content}
                        </Text>
                      </View>

                      <View style={styles.postInteractionBar}>
                        <TouchableOpacity style={styles.interactionButton}>
                          <Feather name="heart" size={18} color={colors.subtle} />
                          <Text style={[styles.interactionText, { color: colors.subtle }]}>{post.likes || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.interactionButton}>
                          <Feather name="message-circle" size={18} color={colors.subtle} />
                          <Text style={[styles.interactionText, { color: colors.subtle }]}>{post.comments_count || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.interactionButton}>
                          <Feather name="share-2" size={18} color={colors.subtle} />
                        </TouchableOpacity>
                      </View>
                    </View>
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
                  <View style={[styles.createPostContainer, { backgroundColor: colors.surface }]}>
                    {/* Premium Mesh Gradient Background Decoration */}
                    <View style={styles.composerMeshDecor}>
                      <Animated.View style={[
                        styles.meshBlobOne,
                        {
                          opacity: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }),
                          transform: [
                            { translateY: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
                            { scale: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }
                          ]
                        }
                      ]}>
                        <LinearGradient
                          colors={[scheme === 'dark' ? '#1E3A8A' : '#EFF6FF', 'transparent']}
                          style={StyleSheet.absoluteFill}
                        />
                      </Animated.View>
                      <Animated.View style={[
                        styles.meshBlobTwo,
                        {
                          opacity: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.4] }),
                          transform: [
                            { translateY: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
                            { scale: meshMotionAnim.interpolate({ inputRange: [0, 1], outputRange: [1.2, 1.1] }) }
                          ]
                        }
                      ]}>
                        <LinearGradient
                          colors={[scheme === 'dark' ? '#4F46E5' : '#FDF4FF', 'transparent']}
                          style={StyleSheet.absoluteFill}
                        />
                      </Animated.View>
                    </View>

                    {/* Image-Matched Header with Glassmorphism */}
                    <View style={[styles.modalHeaderPremium, { borderBottomColor: `${colors.primary}10` }]}>
                      <TouchableOpacity onPress={() => setCreatePostModalVisible(false)} style={styles.headerActionBtn}>
                        <Text style={[styles.modalCancelText, { color: colors.subtle }]}>Batal</Text>
                      </TouchableOpacity>
                      <Text style={[styles.modalTitleSimple, { color: colors.text }]}>Buat Postingan</Text>
                      <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                        <TouchableOpacity
                          onPress={handleCreatePost}
                          disabled={posting || !isPostValid}
                          activeOpacity={0.7}
                          style={[
                            styles.modalPostButtonPremium,
                            {
                              backgroundColor: !isPostValid
                                ? `${colors.primary}15`
                                : `${colors.primary}`
                            }
                          ]}
                        >
                          {posting ? (
                            <Animated.View style={{
                              transform: [{
                                rotate: loaderRotateAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0deg', '360deg']
                                })
                              }]
                            }}>
                              <Feather name="loader" size={16} color={colors.surface} />
                            </Animated.View>
                          ) : (
                            <Text style={[
                              styles.modalPostButtonTextPremium,
                              { color: !isPostValid ? `${colors.primary}40` : '#FFFFFF' }
                            ]}>Unggah</Text>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                      <View style={styles.modalComposeArea}>
                        {/* User Identity Row - Rounded Square Avatar */}
                        <View style={styles.composerUserInfo}>
                          <View style={[styles.postAvatarSquare, { backgroundColor: `${colors.primary}12` }]}>
                            <LinearGradient
                              colors={[`${colors.primary}20`, `${colors.primary}05`]}
                              style={StyleSheet.absoluteFill}
                            />
                            <Feather name="user" size={24} color={colors.primary} />
                          </View>
                          <View>
                            <Text style={[styles.composerUserNameBold, { color: colors.text }]}>
                              {user?.displayName || 'Budi Santoso'}
                            </Text>
                            <TouchableOpacity style={styles.composerCategoryRow}>
                              <Text style={[styles.composerCategoryTextBlue, { color: colors.primary }]}>{selectedCategory}</Text>
                              <Feather name="chevron-down" size={14} color={colors.primary} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Large Premium Title Input with Focus Animation */}
                        <Animated.View style={{
                          transform: [{
                            translateY: titleFocusAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -4]
                            })
                          }]
                        }}>
                          <TextInput
                            placeholder="Judul Diskusi"
                            placeholderTextColor={`${colors.subtle}35`}
                            maxLength={100}
                            style={[styles.composerTitleInputLarge, { color: colors.text }]}
                            value={newPostTitle}
                            onFocus={handleTitleFocus}
                            onBlur={handleTitleBlur}
                            onChangeText={setNewPostTitle}
                          />
                        </Animated.View>

                        {/* Fluid Content Input */}
                        <Animated.View style={[
                          styles.composerBodyWrapper,
                          {
                            backgroundColor: contentFocusAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['rgba(0,0,0,0)', `${colors.primary}05`]
                            }),
                            borderRadius: 16,
                            padding: 4
                          }
                        ]}>
                          <TextInput
                            multiline
                            placeholder="Apa yang ingin Anda bagikan atau tanyakan hari ini?"
                            placeholderTextColor={`${colors.subtle}35`}
                            maxLength={2000}
                            style={[styles.composerBodyInputFluid, { color: colors.text }]}
                            onFocus={handleContentFocus}
                            onBlur={handleContentBlur}
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                          />
                        </Animated.View>

                        <View style={styles.characterCountRow}>
                          <Text style={[styles.characterCountText, { color: newPostContent.length >= 1900 ? '#EF4444' : colors.subtle }]}>
                            {newPostContent.length}/2000 karakter
                          </Text>
                          {newPostContent.length > 0 && (
                            <TouchableOpacity onPress={() => setNewPostContent('')}>
                              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Hapus Semua</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Premium Media Tool Bar */}
                        <View style={styles.mediaToolBar}>
                          <TouchableOpacity style={[styles.mediaToolBtn, { backgroundColor: `${colors.primary}08` }]}>
                            <Feather name="image" size={18} color={colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.mediaToolBtn, { backgroundColor: '#F0FDF4' }]}>
                            <Feather name="bar-chart-2" size={18} color="#16A34A" />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.mediaToolBtn, { backgroundColor: '#FEF2F2' }]}>
                            <Feather name="link" size={18} color="#DC2626" />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.mediaToolBtn, { backgroundColor: '#F5F3FF' }]}>
                            <Feather name="map-pin" size={18} color="#7C3AED" />
                          </TouchableOpacity>
                        </View>

                        {/* PILH KATEGORI Section */}
                        <View style={{ marginTop: 24, paddingBottom: 60 }}>
                          <Text style={[styles.composerCategoryLabel, { color: colors.subtle }]}>PILIH KATEGORI</Text>
                          <View style={styles.composerCategoryChipsGrid}>
                            {['Umum', ...availableTags].map((cat) => {
                              const isSelected = selectedCategory === cat;
                              return (
                                <TouchableOpacity
                                  key={cat}
                                  onPress={() => {
                                    setSelectedCategory(cat);
                                    triggerChipPop();
                                  }}
                                  activeOpacity={0.6}
                                >
                                  <Animated.View
                                    style={[
                                      styles.composerPillChip,
                                      {
                                        backgroundColor: isSelected ? `${colors.primary}12` : 'rgba(0,0,0,0.02)',
                                        transform: isSelected ? [{ scale: chipPopAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] : [{ scale: 1 }]
                                      }
                                    ]}
                                  >
                                    <Text style={[
                                      styles.composerPillChipText,
                                      { color: isSelected ? colors.primary : colors.subtle }
                                    ]}>
                                      {cat}
                                    </Text>
                                  </Animated.View>
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
                {[
                  { label: 'Edit Profil', icon: 'edit-3', action: openEditModal, color: colors.primary },
                  { label: 'Sertifikat Pelatihan', icon: 'book', action: () => { }, color: '#8B5CF6' },
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
                      fontWeight: '600',
                      color: item.label === 'Keluar' ? '#EF4444' : colors.text
                    }}>
                      {item.label}
                    </Text>
                    <Feather name="chevron-right" size={20} color={colors.subtle} />
                  </TouchableOpacity>
                ))}
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
    fontWeight: '700',
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
