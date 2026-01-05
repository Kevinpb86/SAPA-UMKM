import { useAuth } from '@/hooks/use-auth';
import { createSubmission, uploadFile } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
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

const palette = {
  light: {
    background: '#F7F5FF',
    hero: ['#6D28D9', '#7C3AED'],
    surface: '#FFFFFF',
    border: '#E6E1FF',
    text: '#1B1039',
    subtle: '#5E4B8B',
    accent: '#7C3AED',
    success: '#16A34A',
  },
  dark: {
    background: '#120F24',
    hero: ['#4C1D95', '#6D28D9'],
    surface: '#19142E',
    border: '#2A2350',
    text: '#F8FAFC',
    subtle: '#C4B5FD',
    accent: '#A855F7',
    success: '#22C55E',
  },
};

const highlights = [
  'Manfaatkan perlindungan hukum untuk brand dan logo usaha Anda.',
  'Kelola sertifikat merek dan pantau masa berlaku secara daring.',
  'Terima notifikasi saat masa pembaruan mendekati tenggat.',
];

type BrandForm = {
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  businessEntity: 'Perorangan' | 'CV' | 'PT' | 'Koperasi' | 'Badan Usaha Lain';
  brandName: string;
  brandSummary: string;
  productPhoto: string;
  logoReference: string;
  docsIdOwner: string;
  termsAccepted: boolean;
};

const defaultForm: BrandForm = {
  ownerName: '',
  contactEmail: '',
  contactPhone: '',
  businessEntity: 'Perorangan',
  brandName: '',
  brandSummary: '',
  productPhoto: '',
  logoReference: '',
  docsIdOwner: '',
  termsAccepted: false,
};

export default function MerekServiceScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<BrandForm>(defaultForm);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ultra-Premium Animation Logic
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hero mesh loop
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating icons loop
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

    // Master entry
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
    outputRange: [0, -25],
  });

  const handleChange = <K extends keyof BrandForm>(key: K, value: BrandForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
  };

  const validateForm = (): { valid: boolean; message?: string } => {
    const requiredFields: Array<keyof BrandForm> = [
      'ownerName',
      'contactEmail',
      'contactPhone',
      'brandName',
      'brandSummary',
      'productPhoto',
      'logoReference',
      'docsIdOwner',
    ];

    const fieldNames: Record<keyof BrandForm, string> = {
      ownerName: 'Nama Pemohon',
      contactEmail: 'Email',
      contactPhone: 'No. Telepon',
      businessEntity: 'Bentuk Usaha',
      brandName: 'Nama Merek',
      brandSummary: 'Deskripsi Merek',
      productPhoto: 'Foto Barang',
      logoReference: 'Referensi Logo',
      docsIdOwner: 'KTP Pemilik',
      termsAccepted: 'Syarat & Ketentuan'
    };

    const missing = requiredFields.filter(field => !form[field]);
    if (missing.length > 0) {
      return {
        valid: false,
        message: `Mohon lengkapi: ${missing.map(f => fieldNames[f]).join(', ')}`
      };
    }

    if (!form.termsAccepted) {
      return { valid: false, message: 'Anda harus menyetujui syarat & ketentuan.' };
    }

    return { valid: true };
  };

  const handleSubmit = async () => {
    /* ... existing handleSubmit logic ... */
    const validation = validateForm();
    if (!validation.valid) {
      Alert.alert('Data Belum Lengkap', validation.message);
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login untuk mengirim permohonan.');
      return;
    }

    setSubmitting(true);

    try {
      await createSubmission(user.token, {
        type: 'merek',
        data: form
      });
      Alert.alert('Permohonan terkirim', 'Tim kami akan meninjau permohonan pendaftaran merek Anda.');
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim permohonan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            {/* Animated Mesh Overlay */}
            <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.4 }] }]}>
              <View style={[styles.meshCircle, { top: -60, left: -60, width: 220, height: 220, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
              <View style={[styles.meshCircle, { bottom: -100, right: -20, width: 280, height: 280, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
            </Animated.View>

            {/* Business Floating Icons */}
            <Animated.View style={[styles.floatingIcon, { top: '15%', right: '8%', transform: [{ translateY: floatY }] }]}>
              <Feather name="tag" size={80} color="#FFFFFF" style={{ opacity: 0.05 }} />
            </Animated.View>
            <Animated.View style={[styles.floatingIcon, { bottom: '10%', left: '4%', transform: [{ translateY: Animated.multiply(floatY, -0.7) }] }]}>
              <Feather name="award" size={100} color="#FFFFFF" style={{ opacity: 0.04 }} />
            </Animated.View>

            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>Registrasi & Manajemen Merek Produk</Text>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroTitleIcon}>
                  <Feather name="award" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Lindungi Identitas Brand Anda</Text>
              </View>
              <Text style={styles.heroSubtitle}>
                Daftarkan merek dagang untuk melindungi reputasi usaha dan bangun kepercayaan pelanggan dengan bukti legalitas yang jelas.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.trustBanner,
            {
              opacity: entryAnim,
              transform: [{ scale: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }]
            }
          ]}
        >
          <View style={styles.trustItem}>
            <Feather name="shield" size={14} color="#6D28D9" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>DJKI Terintegrasi</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="lock" size={14} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Proteksi Hukum</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="eye" size={14} color="#6366F1" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Pantau 24/7</Text>
          </View>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: 'rgba(255,255,255,0.1)' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}1A` }]}>
              <Feather name="award" size={24} color={colors.accent} />
              <Animated.View style={[styles.pulseCircle, { backgroundColor: colors.accent, opacity: meshAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.3, 0.1] }) }]} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={[styles.cardTitle, { color: colors.text, fontWeight: '600' }]}>Keunggulan Manajemen Merek</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subtle, fontWeight: '400' }]}>
                Sistem terpusat untuk mengelola seluruh sertifikat merek Anda.
              </Text>
            </View>
          </View>

          <View style={styles.highlightList}>
            {highlights.map(item => (
              <View key={item} style={styles.highlightItem}>
                <Feather name="star" size={16} color={colors.accent} />
                <Text style={[styles.highlightText, { color: colors.subtle }]}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={[styles.secondaryButton, { borderColor: colors.border }]}
            >
              <Feather name="chevron-left" size={18} color={colors.subtle} />
              <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Kembali</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setModalVisible(true)}
              activeOpacity={0.85}
              style={[styles.primaryButton, { backgroundColor: colors.accent, flex: 2 }]}
            >
              <Text style={styles.primaryButtonText}>Kelola Merek</Text>
              <Feather name="external-link" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <ScrollView
              contentContainerStyle={[styles.modalCard, { backgroundColor: colors.surface }]}
              keyboardShouldPersistTaps="handled"
            >
              <LinearGradient
                colors={scheme === 'dark' ? ['#2D1B69', '#1A1438'] : ['#F0E7FF', '#FFFFFF']}
                style={styles.modalMesh}
              />

              <View style={styles.modalHeader}>
                <View style={[styles.headerIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                  <Feather name="award" size={28} color={colors.accent} />
                  <Animated.View style={[styles.pulseCircle, { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, opacity: meshAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.2, 0.1] }) }]} />
                </View>
                <View style={styles.modalHeaderInfo}>
                  <Text style={[styles.modalTitle, { color: colors.text, fontWeight: '700' }]}>Form Pengelolaan Merek</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.subtle, fontWeight: '400' }]}>Lengkapi data berikut untuk mendaftarkan merek UMKM Anda.</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  style={[styles.modalCloseButton, { backgroundColor: `${colors.subtle}10` }]}
                >
                  <Feather name="x" size={20} color={colors.subtle} />
                </TouchableOpacity>
              </View>

              <View style={styles.sectionGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Feather name="user" size={18} color={colors.accent} />
                  <Text style={[styles.sectionHeading, { color: colors.text, fontWeight: '600' }]}>Informasi Pemohon</Text>
                </View>

                <LabeledInput
                  label="Nama Pemohon"
                  icon="user"
                  placeholder="Nama lengkap pemohon"
                  value={form.ownerName}
                  onChangeText={value => handleChange('ownerName', value)}
                  colors={colors}
                />

                <LabeledInput
                  label="Email Pemohon"
                  icon="mail"
                  placeholder="Email aktif"
                  keyboardType="email-address"
                  value={form.contactEmail}
                  onChangeText={value => handleChange('contactEmail', value)}
                  colors={colors}
                />

                <LabeledInput
                  label="Nomer Telepon"
                  icon="phone"
                  placeholder="Nomor telepon / WhatsApp"
                  keyboardType="phone-pad"
                  value={form.contactPhone}
                  onChangeText={value => handleChange('contactPhone', value)}
                  colors={colors}
                />

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.text, fontWeight: '500' }]}>Bentuk Badan Usaha</Text>
                  <View style={styles.selectGroup}>
                    {(['Perorangan', 'CV', 'PT', 'Koperasi', 'Badan Usaha Lain'] as BrandForm['businessEntity'][]).map(option => (
                      <TouchableOpacity
                        key={option}
                        accessibilityRole="button"
                        onPress={() => handleChange('businessEntity', option)}
                        style={[
                          styles.selectPill,
                          { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.05)' },
                          option === form.businessEntity && { backgroundColor: `${colors.accent}15`, borderColor: colors.accent },
                        ]}
                      >
                        <Text
                          style={[
                            styles.selectPillText,
                            { color: option === form.businessEntity ? colors.accent : colors.subtle, fontWeight: option === form.businessEntity ? '600' : '400' },
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.sectionGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Feather name="briefcase" size={18} color={colors.accent} />
                  <Text style={[styles.sectionHeading, { color: colors.text, fontWeight: '600' }]}>Detail Merek</Text>
                </View>

                <LabeledInput
                  label="Nama Merek"
                  icon="tag"
                  placeholder="Nama merek dagang"
                  value={form.brandName}
                  onChangeText={value => handleChange('brandName', value)}
                  colors={colors}
                />

                <LabeledInput
                  label="Deskripsi Merek"
                  icon="file-text"
                  placeholder="Deskripsi singkat merek & produk/jasa"
                  multiline
                  value={form.brandSummary}
                  onChangeText={value => handleChange('brandSummary', value)}
                  colors={colors}
                />
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 13, color: colors.subtle, fontWeight: '600' }}>Foto Barang / Produk</Text>
                  {form.productPhoto ? (
                    <View style={{ gap: 8 }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        padding: 12,
                        backgroundColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#BBF7D0'
                      }}>
                        <Feather name="check" size={16} color={colors.success} />
                        <Text style={{ flex: 1, fontSize: 13, color: colors.text }} numberOfLines={1}>
                          {form.productPhoto.split('/').pop()}
                        </Text>
                        <TouchableOpacity onPress={() => handleChange('productPhoto', '')}>
                          <Feather name="x" size={16} color={colors.subtle} />
                        </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 11, color: colors.success }}>File berhasil diunggah.</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          const result = await DocumentPicker.getDocumentAsync({
                            type: ['image/*', 'application/pdf'],
                            copyToCacheDirectory: true
                          });
                          if (result.canceled) return;
                          const asset = result.assets[0];
                          if (!asset) return;
                          if (user?.token) {
                            const uploadRes = await uploadFile(user.token, asset.uri, asset.mimeType ?? 'image/jpeg', asset.name);
                            if (uploadRes.success) {
                              handleChange('productPhoto', uploadRes.url);
                            } else {
                              Alert.alert('Gagal Upload', uploadRes.message);
                            }
                          } else {
                            Alert.alert('Error', 'Anda harus login untuk mengunggah file.');
                          }
                        } catch (err) {
                          Alert.alert('Error', 'Gagal memilih file.');
                        }
                      }}
                      style={[styles.uploadBox, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }]}
                    >
                      <View style={[styles.uploadIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                        <Feather name="upload-cloud" size={20} color={colors.accent} />
                      </View>
                      <Text style={[styles.uploadTitle, { color: colors.text, fontWeight: '600' }]}>
                        Klik untuk unggah foto
                      </Text>
                      <Text style={[styles.uploadSubtitle, { color: colors.subtle, fontWeight: '400' }]}>
                        Format JPG, PNG, atau PDF (Max 5MB)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <LabeledInput
                  label="Referensi Logo"
                  icon="link"
                  placeholder="Tautan referensi/logo (drive, URL)"
                  value={form.logoReference}
                  onChangeText={value => handleChange('logoReference', value)}
                  colors={colors}
                />
              </View>

              <View style={styles.sectionGroup}>
                <Text style={[styles.sectionHeading, { color: colors.text, fontWeight: '600' }]}>Upload & Referensi Dokumen</Text>
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 13, color: colors.subtle, fontWeight: '600' }}>KTP / Identitas Pemilik</Text>
                  {form.docsIdOwner ? (
                    <View style={{ gap: 8 }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        padding: 12,
                        backgroundColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: scheme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#BBF7D0'
                      }}>
                        <Feather name="check" size={16} color={colors.success} />
                        <Text style={{ flex: 1, fontSize: 13, color: colors.text }} numberOfLines={1}>
                          {form.docsIdOwner.split('/').pop()}
                        </Text>
                        <TouchableOpacity onPress={() => handleChange('docsIdOwner', '')}>
                          <Feather name="x" size={16} color={colors.subtle} />
                        </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 11, color: colors.success }}>File berhasil diunggah.</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          const result = await DocumentPicker.getDocumentAsync({
                            type: ['image/*', 'application/pdf'],
                            copyToCacheDirectory: true
                          });
                          if (result.canceled) return;
                          const asset = result.assets[0];
                          if (!asset) return;
                          if (user?.token) {
                            const uploadRes = await uploadFile(user.token, asset.uri, asset.mimeType ?? 'image/jpeg', asset.name);
                            if (uploadRes.success) {
                              handleChange('docsIdOwner', uploadRes.url);
                            } else {
                              Alert.alert('Gagal Upload', uploadRes.message);
                            }
                          } else {
                            Alert.alert('Error', 'Anda harus login untuk mengunggah file.');
                          }
                        } catch (err) {
                          Alert.alert('Error', 'Gagal memilih file.');
                        }
                      }}
                      style={[styles.uploadBox, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }]}
                    >
                      <View style={[styles.uploadIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                        <Feather name="upload-cloud" size={20} color={colors.accent} />
                      </View>
                      <Text style={[styles.uploadTitle, { color: colors.text, fontWeight: '600' }]}>
                        Klik untuk unggah KTP
                      </Text>
                      <Text style={[styles.uploadSubtitle, { color: colors.subtle, fontWeight: '400' }]}>
                        Format JPG, PNG, atau PDF (Max 5MB)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => handleChange('termsAccepted', !form.termsAccepted)}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    form.termsAccepted && { borderColor: colors.accent, backgroundColor: colors.accent },
                  ]}
                >
                  {form.termsAccepted ? <Feather name="check" size={14} color="#FFFFFF" /> : null}
                </View>
                <Text style={[styles.checkboxText, { color: colors.subtle, fontWeight: '400' }]}>
                  Saya menyatakan seluruh data benar dan menyetujui persyaratan pendaftaran merek.
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                  style={[
                    styles.secondaryButton,
                    {
                      backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                      borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                      borderWidth: 1,
                    }
                  ]}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.text, opacity: 0.7 }]}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={styles.modalSubmitWrapper}
                >
                  <LinearGradient
                    colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalSubmitBtn}
                  >
                    <Text style={[styles.primaryButtonText, { fontWeight: '600' }]}>{submitting ? 'Mengirim...' : 'Kirim Permohonan'}</Text>
                    <Feather name={submitting ? 'loader' : 'send'} size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type LabeledInputProps = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
  colors,
  multiline,
  keyboardType = 'default',
}: LabeledInputProps) {
  const scheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // Color and shadow don't support native driver well for this
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', colors.accent],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', `${colors.accent}04`],
  });

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.text, opacity: isFocused ? 1 : 0.8, fontWeight: '500' }]}>{label}</Text>
      <Animated.View style={[
        styles.inputInner,
        {
          backgroundColor,
          borderColor,
          alignItems: multiline ? 'flex-start' : 'center',
          paddingTop: multiline ? 12 : 0,
          transform: [{ scale: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) }],
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }),
          shadowRadius: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
          elevation: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }),
        }
      ]}>
        <View style={multiline ? { marginTop: 4 } : null}>
          <Feather name={icon} size={18} color={isFocused ? colors.accent : colors.subtle} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}50`}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: colors.text, minHeight: multiline ? 96 : 48, fontWeight: '400' },
            multiline && { paddingTop: 0, paddingBottom: 12 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  heroContainer: {
    marginTop: 8,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  hero: {
    padding: 20,
    minHeight: 240,
    justifyContent: 'center',
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
    zIndex: -1,
  },
  heroContent: {
    gap: 8,
    marginTop: 0,
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroTitleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  trustBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    marginHorizontal: 4,
    marginTop: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  card: {
    borderRadius: 36,
    borderWidth: 1,
    padding: 30,
    gap: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    marginVertical: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    opacity: 0.8,
  },
  pulseCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: -1,
  },
  highlightList: {
    gap: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  highlightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 10, 35, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    gap: 24,
    flexGrow: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  modalMesh: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    opacity: 0.4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  headerIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionGroup: {
    gap: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.02)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.05)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: 48,
  },
  selectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 14,
  },
  uploadSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalSubmitWrapper: {
    flex: 2,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 16,
  },
});
