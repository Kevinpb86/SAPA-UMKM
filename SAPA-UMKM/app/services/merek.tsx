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
    // Secondary pulse/mesh loop
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ).start();

    // Floating loop for business symbols
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

    // Subtle entry sequence
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 15,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
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
        {/* Animated Background Icons */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.floatingIcon, { top: '15%', right: '10%', transform: [{ translateY: floatY }] }]}>
            <Feather name="tag" size={100} color={colors.accent} style={{ opacity: 0.03 }} />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, { top: '45%', left: '5%', transform: [{ translateY: Animated.multiply(floatY, -1.2) }] }]}>
            <Feather name="award" size={120} color={colors.accent} style={{ opacity: 0.02 }} />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, { bottom: '20%', right: '15%', transform: [{ translateY: Animated.multiply(floatY, 0.8) }] }]}>
            <Feather name="globe" size={90} color={colors.accent} style={{ opacity: 0.02 }} />
          </Animated.View>
        </View>

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
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <Text style={[styles.heroKicker, { fontWeight: '500' }]}>Registrasi & Manajemen Merek Produk</Text>
          <Text style={[styles.heroTitle, { fontWeight: '700' }]}>Lindungi Identitas Brand Anda</Text>
          <Text style={[styles.heroSubtitle, { fontWeight: '400' }]}>
            Daftarkan merek dagang untuk melindungi reputasi usaha dan bangun kepercayaan pelanggan dengan bukti legalitas yang jelas.
          </Text>
        </LinearGradient>

        <Animated.View style={[styles.trustRow, { opacity: entryAnim, transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          <View style={styles.trustBadge}>
            <Feather name="shield" size={12} color={colors.accent} />
            <Text style={[styles.trustText, { color: colors.subtle }]}>DJKI Terintegrasi</Text>
          </View>
          <View style={styles.trustBadge}>
            <Feather name="lock" size={12} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Proteksi Hukum</Text>
          </View>
          <View style={styles.trustBadge}>
            <Feather name="eye" size={12} color="#6366F1" />
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

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setModalVisible(true)}
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
            <Text style={[styles.primaryButtonText, { fontWeight: '600' }]}>Kelola Merek Sekarang</Text>
            <Feather name="external-link" size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
                  style={[styles.secondaryButton, { backgroundColor: `${colors.subtle}08`, borderColor: 'transparent' }]}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.subtle, fontWeight: '600' }]}>Batal</Text>
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
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: -1,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginTop: -8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  pulseCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: -1,
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
    backgroundColor: 'rgba(30, 24, 54, 0.25)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(240, 235, 255, 0.9)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(244, 240, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  highlightList: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
