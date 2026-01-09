import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { fetchSubmissions } from '@/lib/api';
import type { StoredAccount } from '@/lib/auth-store';

const palette = {
  light: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    border: '#E1E6F3',
    primary: '#1B5CC4',
    accent: '#F97316',
    success: '#16A34A',
    warning: '#FACC15',
    text: '#0F1B3A',
    subtle: '#66728F',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#273449',
    primary: '#3B82F6',
    accent: '#FB923C',
    success: '#22C55E',
    warning: '#FBBF24',
    text: '#F8FAFC',
    subtle: '#94A3B8',
  },
};

type Submission = {
  id: number;
  user_id: number;
  type: string;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  email: string;
  display_name: string;
};



export default function AdminDashboardScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const {
    user,
    loading,
    logout,
    accounts,
    refreshAccounts,
    createUserAccount,
    updateUserAccount,
    deleteUserAccount,
  } = useAuth();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userFormMode, setUserFormMode] = useState<'create' | 'edit'>('create');
  const [userForm, setUserForm] = useState<{ id?: string; displayName: string; email: string; password: string }>({
    id: undefined,
    displayName: '',
    email: '',
    password: '',
  });
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [userFormSubmitting, setUserFormSubmitting] = useState(false);

  const managedUsers = useMemo(
    () => accounts.filter(account => account.role === 'user'),
    [accounts],
  );

  const adminName = user?.displayName || 'Administrator';
  const adminInitial = adminName.charAt(0).toUpperCase();

  const analyticsCards = useMemo(
    () => [
      {
        label: 'Pengguna Terdaftar',
        value: '1.240',
        icon: 'users' as const,
        color: colors.primary,
      },
      {
        label: 'Pengajuan Aktif',
        value: '86',
        icon: 'inbox' as const,
        color: colors.accent,
      },
      {
        label: 'Laporan Minggu Ini',
        value: '32',
        icon: 'clipboard' as const,
        color: colors.success,
      },
    ],
    [colors.accent, colors.primary, colors.success],
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
        return;
      }
      if (user.role !== 'admin') {
        router.replace('/user/dashboard');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      refreshAccounts();
      loadSubmissions();
    }
  }, [loading, user, refreshAccounts]);

  const loadSubmissions = async () => {
    if (user?.token) {
      const response = await fetchSubmissions(user.token);
      if (response.success) {
        setSubmissions(response.data);
      }
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  const resetUserForm = () => {
    setUserForm({ id: undefined, displayName: '', email: '', password: '' });
    setUserFormError(null);
  };

  const openCreateUserModal = () => {
    setUserFormMode('create');
    resetUserForm();
    setUserModalVisible(true);
  };

  const openEditUserModal = (account: StoredAccount) => {
    setUserFormMode('edit');
    setUserForm({
      id: account.id,
      displayName: account.displayName || account.profile?.ownerName || account.email,
      email: account.email,
      password: '',
    });
    setUserFormError(null);
    setUserModalVisible(true);
  };

  const handleUserFormChange = (key: 'displayName' | 'email' | 'password', value: string) => {
    setUserForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmitUserForm = async () => {
    setUserFormError(null);
    const trimmedEmail = userForm.email.trim().toLowerCase();

    if (!trimmedEmail) {
      setUserFormError('Email wajib diisi.');
      return;
    }

    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(trimmedEmail)) {
      setUserFormError('Format email tidak valid.');
      return;
    }

    if (userFormMode === 'create' && userForm.password.length < 6) {
      setUserFormError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (userFormMode === 'edit' && userForm.password.length > 0 && userForm.password.length < 6) {
      setUserFormError('Kata sandi minimal 6 karakter.');
      return;
    }

    setUserFormSubmitting(true);

    try {
      if (userFormMode === 'create') {
        await createUserAccount({
          email: trimmedEmail,
          password: userForm.password,
          displayName: userForm.displayName.trim() || trimmedEmail,
        });
      } else if (userForm.id) {
        await updateUserAccount({
          id: userForm.id,
          email: trimmedEmail,
          password: userForm.password ? userForm.password : undefined,
          displayName: userForm.displayName.trim() || trimmedEmail,
        });
      }

      setUserModalVisible(false);
      resetUserForm();
    } catch (error) {
      let message = 'Terjadi kesalahan saat menyimpan akun.';
      if (error instanceof Error) {
        switch (error.message) {
          case 'EMAIL_RESERVED_FOR_ADMIN':
            message = 'Email ini khusus untuk akun admin.';
            break;
          case 'PASSWORD_REQUIRED':
            message = 'Kata sandi wajib diisi (minimal 6 karakter).';
            break;
          case 'ACCOUNT_NOT_FOUND':
            message = 'Akun tidak ditemukan.';
            break;
          case 'ACCOUNT_ID_REQUIRED':
            message = 'ID akun diperlukan untuk memperbarui data.';
            break;
          case 'CANNOT_MUTATE_ADMIN':
            message = 'Akun admin tidak dapat diubah dari menu ini.';
            break;
          default:
            message = error.message || message;
        }
      }
      setUserFormError(message);
    } finally {
      setUserFormSubmitting(false);
    }
  };

  const handleDeleteUser = (account: StoredAccount) => {
    Alert.alert(
      'Hapus Akun',
      `Apakah Anda yakin ingin menghapus akun ${account.displayName || account.email}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount(account.id);
            } catch (error) {
              let message = 'Gagal menghapus akun.';
              if (error instanceof Error) {
                switch (error.message) {
                  case 'ACCOUNT_NOT_FOUND':
                    message = 'Akun tidak ditemukan.';
                    break;
                  case 'CANNOT_REMOVE_ADMIN':
                    message = 'Akun admin tidak dapat dihapus.';
                    break;
                  default:
                    message = error.message || message;
                }
              }
              Alert.alert('Penghapusan gagal', message);
            }
          },
        },
      ],
    );
  };

  const userModalTitle = userFormMode === 'create' ? 'Tambah Akun Pengguna' : 'Edit Akun Pengguna';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleSync = () => {
    Alert.alert('Sinkronisasi data', 'Data sistem sedang diperbarui.');
    loadSubmissions();
  };

  const handleAction = (submission: Submission) => {
    router.push({
      pathname: '/admin/submission/[id]',
      params: { id: submission.id }
    });
  };

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

          <View style={styles.heroTopRow}>
            <View style={styles.heroIdentity}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>{adminInitial}</Text>
              </View>
              <View>
                <Text style={styles.heroRole}>Akun Admin</Text>
                <Text style={styles.heroName}>{adminName}</Text>
              </View>
            </View>
            <View style={styles.heroActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSync}
                style={styles.heroActionButton}
              >
                <Feather name="refresh-cw" size={16} color={colors.primary} />
                <Text style={[styles.heroActionText, { color: colors.primary }]}>Sinkronisasi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleLogout}
                style={styles.heroActionButton}
              >
                <Feather name="log-out" size={16} color={colors.primary} />
                <Text style={[styles.heroActionText, { color: colors.primary }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.heroTitle}>Panel Kontrol SAPA UMKM</Text>
          <Text style={styles.heroSubtitle}>
            Pantau aktivitas pengguna, kelola fitur, dan pastikan layanan berjalan optimal.
          </Text>

          <View style={styles.analyticsRow}>
            {analyticsCards.map(card => (
              <View key={card.label} style={[styles.analyticsCard, { backgroundColor: `${card.color}22` }]}>
                <View style={[styles.analyticsIcon, { backgroundColor: `${card.color}33` }]}>
                  <Feather name={card.icon} size={18} color={colors.surface} />
                </View>
                <Text style={styles.analyticsValue}>{card.value}</Text>
                <Text style={styles.analyticsLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Manajemen Akun Pengguna</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>Pantau dan kelola akun pelaku UMKM yang telah registrasi.</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={openCreateUserModal}
              style={[styles.sectionPrimaryButton, { backgroundColor: colors.primary }]}
            >
              <Feather name="user-plus" size={16} color="#FFFFFF" />
              <Text style={styles.sectionPrimaryButtonText}>Tambah Akun</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.accountList}>
            {managedUsers.length === 0 ? (
              <View style={[styles.emptyState, { borderColor: colors.border, backgroundColor: scheme === 'dark' ? '#141C2F' : '#F8FAFF' }]}>
                <Feather name="users" size={20} color={colors.subtle} />
                <Text style={[styles.emptyStateText, { color: colors.subtle }]}>Belum ada akun pengguna terdaftar selain admin.</Text>
              </View>
            ) : (
              managedUsers.map(account => (
                <View
                  key={account.id}
                  style={[
                    styles.accountRow,
                    {
                      borderColor: colors.border,
                      backgroundColor: scheme === 'dark' ? '#1E293B' : '#F8FAFF',
                    },
                  ]}
                >
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: colors.text }]}>
                      {account.displayName || account.profile?.ownerName || account.email}
                    </Text>
                    <Text style={[styles.accountEmail, { color: colors.subtle }]}>{account.email}</Text>
                    {account.profile?.businessName ? (
                      <Text style={[styles.accountMeta, { color: colors.subtle }]}>
                        {account.profile.businessName}
                        {account.profile?.sector ? ` • ${account.profile.sector}` : ''}
                      </Text>
                    ) : null}
                    <View style={styles.accountChipRow}>
                      {account.profile?.nik ? (
                        <View style={[styles.accountChip, { backgroundColor: scheme === 'dark' ? 'rgba(59,130,246,0.18)' : 'rgba(37,99,235,0.12)' }]}
                        >
                          <Feather name="hash" size={12} color={colors.primary} />
                          <Text style={[styles.accountChipText, { color: colors.primary }]}>{account.profile.nik}</Text>
                        </View>
                      ) : null}
                      {account.profile?.kbli ? (
                        <View style={[styles.accountChip, { backgroundColor: scheme === 'dark' ? 'rgba(16,185,129,0.18)' : 'rgba(34,197,94,0.12)' }]}
                        >
                          <Feather name="briefcase" size={12} color={colors.success} />
                          <Text style={[styles.accountChipText, { color: colors.success }]}>{account.profile.kbli}</Text>
                        </View>
                      ) : null}
                      {account.profile?.scale ? (
                        <View style={[styles.accountChip, { backgroundColor: scheme === 'dark' ? 'rgba(248,196,48,0.18)' : 'rgba(251,191,36,0.12)' }]}
                        >
                          <Feather name="layers" size={12} color={colors.accent} />
                          <Text style={[styles.accountChipText, { color: colors.accent }]}>{account.profile.scale}</Text>
                        </View>
                      ) : null}
                    </View>
                    {account.profile?.ownerAddress || account.profile?.businessAddress ? (
                      <View style={styles.accountAddressBlock}>
                        {account.profile?.ownerAddress ? (
                          <Text style={[styles.accountAddress, { color: colors.subtle }]}>
                            Pemilik: {account.profile.ownerAddress}
                          </Text>
                        ) : null}
                        {account.profile?.businessAddress ? (
                          <Text style={[styles.accountAddress, { color: colors.subtle }]}>
                            Usaha: {account.profile.businessAddress}
                          </Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.accountActions}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => openEditUserModal(account)}
                      style={[
                        styles.accountActionButton,
                        {
                          borderColor: colors.border,
                          backgroundColor: scheme === 'dark' ? 'rgba(148,163,184,0.12)' : '#FFFFFF',
                        },
                      ]}
                    >
                      <Feather name="edit-3" size={16} color={colors.primary} />
                      <Text style={[styles.accountActionText, { color: colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => handleDeleteUser(account)}
                      style={[
                        styles.accountActionButton,
                        {
                          borderColor: '#DC2626',
                          backgroundColor: scheme === 'dark' ? 'rgba(220,38,38,0.18)' : '#FEF2F2',
                        },
                      ]}
                    >
                      <Feather name="trash-2" size={16} color="#DC2626" />
                      <Text style={[styles.accountActionText, { color: '#DC2626' }]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pengajuan Formulir</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Prioritaskan item di bawah untuk menjaga kualitas layanan.
          </Text>

          <View style={styles.actionsList}>
            {submissions.filter(s => s.status === 'pending').length === 0 ? (
              <Text style={{ color: colors.subtle, padding: 16 }}>Tidak ada pengajuan formulir.</Text>
            ) : (
              submissions.filter(s => s.status === 'pending').map(submission => {
                const getSubmissionIcon = (type: string) => {
                  switch (type.toLowerCase()) {
                    case 'nib': return 'shield';
                    case 'merek': return 'tag';
                    case 'halal': return 'check-circle';
                    case 'sni': return 'award';
                    case 'bpom': return 'package';
                    case 'kur': return 'dollar-sign';
                    case 'umi': return 'briefcase';
                    case 'lpdb': return 'home';
                    case 'inkubasi': return 'trending-up';
                    case 'laporan': return 'file-text';
                    default: return 'file';
                  }
                };

                const getSubmissionTitle = (type: string) => {
                  switch (type.toLowerCase()) {
                    case 'nib': return 'Permohonan NIB';
                    case 'merek': return 'Pendaftaran Merek';
                    case 'halal': return 'Sertifikasi Halal';
                    case 'sni': return 'Sertifikasi SNI';
                    case 'bpom': return 'Izin Edar BPOM';
                    case 'kur': return 'Pengajuan KUR';
                    case 'umi': return 'Pembiayaan UMi';
                    case 'lpdb': return 'Dana Bergulir LPDB';
                    case 'inkubasi': return 'Inkubasi Bisnis';
                    case 'laporan': return 'Laporan Bulanan';
                    default: return type.toUpperCase();
                  }
                };

                return (
                  <TouchableOpacity
                    key={submission.id}
                    accessibilityRole="button"
                    onPress={() => handleAction(submission)}
                    style={[styles.actionItem, { borderColor: colors.border }]}
                  >
                    <View
                      style={[
                        styles.actionBadge,
                        { backgroundColor: `${colors.accent}20` },
                      ]}
                    >
                      <Feather name={getSubmissionIcon(submission.type)} size={20} color={colors.accent} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={[styles.actionTitle, { color: colors.text }]}>
                        {getSubmissionTitle(submission.type)}
                      </Text>
                      <Text style={[styles.actionDescription, { color: colors.subtle }]}>
                        Oleh: {submission.display_name} • {new Date(submission.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={colors.subtle} />
                  </TouchableOpacity>
                )
              })
            )}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ringkasan Sistem</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
            Pantau status modul utama untuk memastikan ketersediaan layanan.
          </Text>

          <View style={styles.systemStatusGrid}>
            {[
              {
                label: 'Service Registry',
                status: 'Normal',
                icon: 'server' as const,
                color: colors.success,
              },
              {
                label: 'Gateway API',
                status: 'Warning',
                icon: 'zap' as const,
                color: colors.warning,
              },
              {
                label: 'Pelaporan',
                status: 'Aktif',
                icon: 'pie-chart' as const,
                color: colors.success,
              },
              {
                label: 'Forum',
                status: 'Aktif',
                icon: 'message-circle' as const,
                color: colors.success,
              },
            ].map(status => (
              <View key={status.label} style={[styles.systemStatusCard, { borderColor: colors.border }]}>
                <View style={[styles.systemIconWrapper, { backgroundColor: `${status.color}22` }]}>
                  <Feather name={status.icon} size={18} color={status.color} />
                </View>
                <Text style={[styles.systemLabel, { color: colors.text }]}>{status.label}</Text>
                <Text style={[styles.systemStatusText, { color: status.color }]}>{status.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutSectionButton,
            {
              backgroundColor: scheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
              borderColor: '#EF4444',
            }
          ]}
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutSectionButtonText}>Keluar dari Sistem</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={userModalVisible}
        onRequestClose={() => {
          setUserModalVisible(false);
          resetUserForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{userModalTitle}</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  setUserModalVisible(false);
                  resetUserForm();
                }}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={18} color={colors.subtle} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.subtle }]}>Nama Tampilan</Text>
                <TextInput
                  placeholder="Nama lengkap atau nama usaha"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={userForm.displayName}
                  onChangeText={value => handleUserFormChange('displayName', value)}
                  style={[styles.modalInput, { borderColor: colors.border, color: colors.text, backgroundColor: scheme === 'dark' ? '#0F172A' : '#FFFFFF' }]}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.subtle }]}>Email</Text>
                <TextInput
                  placeholder="contoh: pelaku@umkm.id"
                  placeholderTextColor={`${colors.subtle}80`}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={userForm.email}
                  onChangeText={value => handleUserFormChange('email', value)}
                  style={[styles.modalInput, { borderColor: colors.border, color: colors.text, backgroundColor: scheme === 'dark' ? '#0F172A' : '#FFFFFF' }]}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: colors.subtle }]}>
                  Kata Sandi {userFormMode === 'edit' ? '(opsional, isi jika ingin diganti)' : ''}
                </Text>
                <TextInput
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor={`${colors.subtle}80`}
                  secureTextEntry
                  value={userForm.password}
                  onChangeText={value => handleUserFormChange('password', value)}
                  style={[styles.modalInput, { borderColor: colors.border, color: colors.text, backgroundColor: scheme === 'dark' ? '#0F172A' : '#FFFFFF' }]}
                />
              </View>

              {userFormError ? (
                <Text style={styles.modalErrorText}>{userFormError}</Text>
              ) : null}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  setUserModalVisible(false);
                  resetUserForm();
                }}
                style={styles.modalSecondaryButton}
              >
                <Text style={[styles.modalSecondaryButtonText, { color: colors.subtle }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSubmitUserForm}
                disabled={userFormSubmitting}
                style={[
                  styles.modalPrimaryButton,
                  { backgroundColor: colors.primary, opacity: userFormSubmitting ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {userFormSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    gap: 18,
    overflow: 'hidden',
  },
  heroDecorationOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    top: -80,
    right: -60,
  },
  heroDecorationTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -70,
    left: -40,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroRole: {
    color: 'rgba(233,244,255,0.78)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  heroActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  heroActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(225, 237, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  analyticsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  analyticsCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  analyticsIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  analyticsLabel: {
    color: 'rgba(225, 237, 255, 0.85)',
    fontSize: 12,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  sectionHeaderText: {
    flex: 1,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionsList: {
    gap: 16,
  },
  actionItem: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1B3A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  actionContent: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  systemStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  systemStatusCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  systemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  systemStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  accountList: {
    gap: 16,
  },
  accountRow: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  accountInfo: {
    flex: 1,
    gap: 6,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '700',
  },
  accountEmail: {
    fontSize: 13,
  },
  accountMeta: {
    fontSize: 13,
  },
  accountChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  accountChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  accountAddressBlock: {
    marginTop: 10,
    gap: 4,
  },
  accountAddress: {
    fontSize: 12,
    lineHeight: 18,
  },
  accountActions: {
    flexDirection: 'row',
    gap: 10,
  },
  accountActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  accountActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 18, 35, 0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 6,
  },
  modalBody: {
    gap: 16,
  },
  modalField: {
    gap: 8,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  modalErrorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalSecondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  modalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalPrimaryButton: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutSectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  logoutSectionButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});


