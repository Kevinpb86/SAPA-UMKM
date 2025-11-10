import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
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
  View,
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
  },
  dark: {
    background: '#120F24',
    hero: ['#4C1D95', '#6D28D9'],
    surface: '#19142E',
    border: '#2A2350',
    text: '#F8FAFC',
    subtle: '#C4B5FD',
    accent: '#A855F7',
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
  logoReference: string;
  docsIdOwner: string;
  docsBusinessPermit: string;
  termsAccepted: boolean;
};

const defaultForm: BrandForm = {
  ownerName: '',
  contactEmail: '',
  contactPhone: '',
  businessEntity: 'Perorangan',
  brandName: '',
  brandSummary: '',
  logoReference: '',
  docsIdOwner: '',
  docsBusinessPermit: '',
  termsAccepted: false,
};

export default function MerekServiceScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const [form, setForm] = useState<BrandForm>(defaultForm);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof BrandForm>(key: K, value: BrandForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
  };

  const validateForm = () => {
    const requiredFields: Array<keyof BrandForm> = [
      'ownerName',
      'contactEmail',
      'contactPhone',
      'brandName',
      'brandSummary',
      'logoReference',
      'docsIdOwner',
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        return false;
      }
    }

    if (!form.termsAccepted) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Form belum lengkap', 'Mohon lengkapi seluruh kolom wajib dan setujui syarat ketentuan.');
      return;
    }

    setSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      Alert.alert('Permohonan terkirim', 'Tim kami akan meninjau permohonan pendaftaran merek Anda.');
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <Text style={styles.heroKicker}>Registrasi & Manajemen Merek Produk</Text>
          <Text style={styles.heroTitle}>Lindungi Identitas Brand Anda</Text>
          <Text style={styles.heroSubtitle}>
            Daftarkan merek dagang untuk melindungi reputasi usaha dan bangun kepercayaan pelanggan dengan bukti legalitas yang jelas.
          </Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}1A` }]}
            >
              <Feather name="tag" size={20} color={colors.accent} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Keunggulan Manajemen Merek</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
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
            <Text style={styles.primaryButtonText}>Kelola Merek Sekarang</Text>
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
            <ScrollView contentContainerStyle={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderInfo}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Form Pengelolaan Merek</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.subtle }]}>Lengkapi data berikut untuk mendaftarkan merek UMKM Anda.</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  style={styles.modalCloseButton}
                >
                  <Feather name="x" size={20} color={colors.subtle} />
                </TouchableOpacity>
              </View>

              <View style={styles.sectionGroup}>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Informasi Pemohon</Text>
                <TextInput
                  placeholder="Nama lengkap pemohon"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={form.ownerName}
                  onChangeText={value => handleChange('ownerName', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                <TextInput
                  placeholder="Email aktif"
                  placeholderTextColor={`${colors.subtle}80`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.contactEmail}
                  onChangeText={value => handleChange('contactEmail', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                <TextInput
                  placeholder="Nomor telepon / WhatsApp"
                  placeholderTextColor={`${colors.subtle}80`}
                  keyboardType="phone-pad"
                  value={form.contactPhone}
                  onChangeText={value => handleChange('contactPhone', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />

                <View style={styles.selectGroup}>
                  {(['Perorangan', 'CV', 'PT', 'Koperasi', 'Badan Usaha Lain'] as BrandForm['businessEntity'][]).map(option => (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      onPress={() => handleChange('businessEntity', option)}
                      style={[
                        styles.selectPill,
                        option === form.businessEntity && { backgroundColor: `${colors.accent}15`, borderColor: colors.accent },
                      ]}
                    >
                      <Text
                        style={[
                          styles.selectPillText,
                          { color: option === form.businessEntity ? colors.accent : colors.subtle },
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.sectionGroup}>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Detail Merek</Text>
                <TextInput
                  placeholder="Nama merek dagang"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={form.brandName}
                  onChangeText={value => handleChange('brandName', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                <TextInput
                  placeholder="Deskripsi singkat merek & produk/jasa"
                  placeholderTextColor={`${colors.subtle}80`}
                  multiline
                  value={form.brandSummary}
                  onChangeText={value => handleChange('brandSummary', value)}
                  style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                <TextInput
                  placeholder="Tautan referensi/logo (drive, URL)"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={form.logoReference}
                  onChangeText={value => handleChange('logoReference', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
              </View>

              <View style={styles.sectionGroup}>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Upload & Referensi Dokumen</Text>
                <TextInput
                  placeholder="Tautan KTP / Identitas pemilik"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={form.docsIdOwner}
                  onChangeText={value => handleChange('docsIdOwner', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
                <TextInput
                  placeholder="Tautan izin usaha / NIB / IUMK (opsional)"
                  placeholderTextColor={`${colors.subtle}80`}
                  value={form.docsBusinessPermit}
                  onChangeText={value => handleChange('docsBusinessPermit', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                />
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
                <Text style={[styles.checkboxText, { color: colors.subtle }]}>
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
                  style={[styles.secondaryButton, { borderColor: colors.border }]}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: submitting ? 0.6 : 1 }]}
                >
                  <Text style={styles.primaryButtonText}>{submitting ? 'Mengirim...' : 'Kirim Permohonan'}</Text>
                  <Feather name="send" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    gap: 20,
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
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
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
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  modalHeaderInfo: {
    flex: 1,
    gap: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 999,
  },
  sectionGroup: {
    gap: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 100,
    fontSize: 15,
    textAlignVertical: 'top',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  selectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
