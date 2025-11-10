import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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

import { useAuth } from '@/hooks/use-auth';

const palette = {
  light: {
    background: '#F5F7FB',
    card: '#FFFFFF',
    text: '#0F1B3A',
    subtle: '#66728F',
    primary: '#1B5CC4',
    border: '#DEE4F2',
    input: '#FFFFFF',
    accent: '#2563EB',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    primary: '#3B82F6',
    border: '#273449',
    input: '#0F172A',
    accent: '#60A5FA',
  },
};

const sectorOptions = [
  'Makanan & Minuman',
  'Kerajinan & Kreatif',
  'Jasa & Layanan',
  'Perdagangan Umum',
  'Pertanian & Kelautan',
];

const scaleOptions = ['Mikro', 'Kecil', 'Menengah'];

const kbliOptions = [
  '10792 - Perdagangan kebutuhan pokok',
  '56101 - Rumah makan/restoran',
  '56301 - Kedai kopi/kafe',
  '14111 - Industri pakaian jadi',
  '47213 - Perdagangan eceran makanan minuman',
  '46206 - Perdagangan besar hasil pertanian',
  '46411 - Perdagangan besar tekstil',
  '47111 - Supermarket/minimarket',
  '62010 - Aktivitas pemrograman komputer',
  '85500 - Pendidikan dan pelatihan',
  '96022 - Layanan salon dan kecantikan',
];

type RegisterForm = {
  nik: string;
  ownerName: string;
  email: string;
  password: string;
  npwp: string;
  ownerAddress: string;
  businessName: string;
  businessAddress: string;
  kbli: string;
  sector: string;
  scale: string;
  capital: string;
};

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function SelectField({ label, placeholder, options, value, onChange, required }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.formField}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={styles.selectButton}>
        <Text style={value ? styles.selectValue : styles.placeholder}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#5E6B85" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => setVisible(false)}>
                <Feather name="x" size={20} color="#5E6B85" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option);
                    setVisible(false);
                  }}
                  style={styles.optionItem}>
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    nik: '',
    ownerName: '',
    email: '',
    password: '',
    npwp: '',
    ownerAddress: '',
    businessName: '',
    businessAddress: '',
    kbli: '',
    sector: '',
    scale: '',
    capital: '',
  });
  const [documents, setDocuments] = useState<{
    idCard: DocumentPicker.DocumentPickerAsset | null;
    domicileLetter: DocumentPicker.DocumentPickerAsset | null;
  }>({
    idCard: null,
    domicileLetter: null,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const formatDocumentLabel = (
    asset: DocumentPicker.DocumentPickerAsset | null,
    defaultLabel: string
  ) => {
    if (!asset) {
      return defaultLabel;
    }
    const sizeInKb = asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : undefined;
    return sizeInKb ? `${asset.name ?? 'Dokumen'} • ${sizeInKb}` : asset.name ?? 'Dokumen';
  };

  const handleDocumentPick = async (key: 'idCard' | 'domicileLetter') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if ('canceled' in result && result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        Alert.alert('Unggah Dokumen', 'Tidak ada berkas yang dipilih.');
        return;
      }

      setDocuments(prev => ({ ...prev, [key]: asset }));
    } catch (error) {
      Alert.alert('Unggah Dokumen', 'Terjadi kesalahan saat memilih dokumen. Coba lagi.');
    }
  };

  const handleSubmit = async () => {
    if (!form.email) {
      Alert.alert('Data belum lengkap', 'Mohon isi email aktif untuk akun SAPA UMKM.');
      return;
    }
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(form.email)) {
      Alert.alert('Email tidak valid', 'Pastikan email ditulis dengan format yang benar.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      Alert.alert('Data belum lengkap', 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (!documents.idCard) {
      Alert.alert('Data belum lengkap', 'Mohon unggah foto e-KTP sebelum melanjutkan.');
      return;
    }

    try {
      await registerUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ownerName: form.ownerName,
        nik: form.nik,
        businessName: form.businessName,
        profile: {
          ownerAddress: form.ownerAddress,
          businessAddress: form.businessAddress,
          kbli: form.kbli,
          sector: form.sector,
          scale: form.scale,
          capital: form.capital,
          npwp: form.npwp,
        },
      });

      Alert.alert(
        'Registrasi berhasil',
        'Silakan masuk menggunakan email dan kata sandi Anda.'
      );

      router.replace('/login');
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_RESERVED_FOR_ADMIN') {
        Alert.alert('Registrasi gagal', 'Email ini khusus untuk akun admin. Mohon gunakan email lain.');
        return;
      }
      Alert.alert('Registrasi gagal', 'Terjadi kesalahan saat menyimpan data. Coba lagi.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#1D4ED8', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroOverlayOne} />
            <View style={styles.heroOverlayTwo} />

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.heroBackButton}
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.heroBackText}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.heroHeader}>
              <View style={styles.heroTag}>
                <Feather name="shield" size={16} color={colors.accent} />
                <Text style={styles.heroTagText}>Portal Registrasi UMKM</Text>
              </View>
              <Text style={styles.heroTitle}>Registrasi Pelaku UMKM</Text>
              <Text style={styles.heroSubtitle}>
                Lengkapi data pemilik, identitas usaha, dan dokumen pendukung untuk mengakses layanan SAPA UMKM secara terpadu.
              </Text>
            </View>

            <View style={styles.heroChecklist}>
              <View style={styles.heroChecklistItem}>
                <Feather name="user-check" size={16} color="#FFFFFF" />
                <Text style={styles.heroChecklistText}>NIK & NPWP pemilik tersedia.</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <Feather name="briefcase" size={16} color="#FFFFFF" />
                <Text style={styles.heroChecklistText}>Detail usaha lengkap beserta kode KBLI.</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <Feather name="file-text" size={16} color="#FFFFFF" />
                <Text style={styles.heroChecklistText}>E-KTP wajib, SKD opsional sesuai daerah.</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(37,99,235,0.12)' }]}
              >
                <Feather name="user" size={18} color={colors.primary} />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Informasi identitas pribadi sesuai dokumen resmi.
                </Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              {/* owner fields remain unchanged */}
              <View style={styles.formField}>
                <Text style={styles.label}>NIK (Nomor Induk Kependudukan) *</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Masukkan 16 digit NIK"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.nik}
                  onChangeText={value => handleChange('nik', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Nama Lengkap Pemilik *</Text>
                <TextInput
                  placeholder="Sesuai e-KTP"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.ownerName}
                  onChangeText={value => handleChange('ownerName', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Email Aktif *</Text>
                <TextInput
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="contoh: pelaku@umkm.id"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.email}
                  onChangeText={value => handleChange('email', value.trim())}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Kata Sandi *</Text>
                <View style={[styles.passwordField, { borderColor: colors.border, backgroundColor: colors.input }]}> 
                  <TextInput
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                    secureTextEntry={!passwordVisible}
                    value={form.password}
                    onChangeText={value => handleChange('password', value)}
                    style={[styles.passwordInput, { color: colors.text }]}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.passwordToggle}>
                    <Feather
                      name={passwordVisible ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.subtle}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>NPWP Pribadi *</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Nomor Pokok Wajib Pajak"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.npwp}
                  onChangeText={value => handleChange('npwp', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Alamat Pemilik *</Text>
                <TextInput
                  placeholder="Sesuai domisili pribadi"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  multiline
                  value={form.ownerAddress}
                  onChangeText={value => handleChange('ownerAddress', value)}
                  style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(16,185,129,0.12)' }]}
              >
                <Feather name="briefcase" size={18} color={colors.primary} />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usaha</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Detail usaha yang akan didaftarkan dalam SAPA UMKM.
                </Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              {/* business fields unchanged */}
              <View style={styles.formField}>
                <Text style={styles.label}>Nama Usaha *</Text>
                <TextInput
                  placeholder="Nama brand atau toko"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.businessName}
                  onChangeText={value => handleChange('businessName', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Alamat Lokasi Usaha *</Text>
                <TextInput
                  placeholder="Alamat tempat usaha beroperasi"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  multiline
                  value={form.businessAddress}
                  onChangeText={value => handleChange('businessAddress', value)}
                  style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
              <SelectField
                label="Kode KBLI"
                placeholder="Pilih kode KBLI"
                options={kbliOptions}
                value={form.kbli}
                onChange={value => handleChange('kbli', value)}
                required
              />
              <SelectField
                label="Sektor Usaha"
                placeholder="Pilih sektor usaha"
                options={sectorOptions}
                value={form.sector}
                onChange={value => handleChange('sector', value)}
                required
              />
              <SelectField
                label="Skala Usaha"
                placeholder="Pilih skala usaha"
                options={scaleOptions}
                value={form.scale}
                onChange={value => handleChange('scale', value)}
                required
              />
              <View style={styles.formField}>
                <Text style={styles.label}>Estimasi Modal Usaha *</Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Nominal investasi yang dikeluarkan"
                  placeholderTextColor={scheme === 'dark' ? '#64748B' : '#9DA8C3'}
                  value={form.capital}
                  onChangeText={value => handleChange('capital', value)}
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
                />
              </View>
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(59,130,246,0.12)' }]}
              >
                <Feather name="file" size={18} color={colors.primary} />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Dokumen Pendukung</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Unggah dokumen untuk mempercepat verifikasi legalitas.
                </Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              <View style={styles.formField}>
                <Text style={styles.label}>Foto E-KTP *</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handleDocumentPick('idCard')}
                  style={styles.uploadField}>
                  <Feather name="upload" size={18} color={colors.primary} />
                  <Text
                    style={[
                      styles.uploadText,
                      documents.idCard ? styles.uploadTextSelected : undefined,
                    ]}
                  >
                    {formatDocumentLabel(
                      documents.idCard,
                      'Unggah foto e-KTP (PDF/JPG/PNG/DOCX)'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Surat Keterangan Domisili (SKD)</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handleDocumentPick('domicileLetter')}
                  style={styles.uploadField}>
                  <Feather name="upload" size={18} color={colors.primary} />
                  <Text
                    style={[
                      styles.uploadText,
                      documents.domicileLetter ? styles.uploadTextSelected : undefined,
                    ]}
                  >
                    {formatDocumentLabel(
                      documents.domicileLetter,
                      'Unggah dokumen (opsional)'
                    )}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.optionalNote}>
                  Opsional, tergantung persyaratan daerah. Format didukung: PDF, JPG, PNG, DOC, DOCX.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleSubmit}
            style={[styles.submitButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.submitButtonText}>Daftar Sekarang</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flexOne: {
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
    position: 'relative',
  },
  heroOverlayOne: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlayTwo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  heroBackButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  heroBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroHeader: {
    gap: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroChecklist: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroChecklistItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroChecklistText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  formGroup: {
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#42506B',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  passwordField: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  passwordToggle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    minHeight: 96,
    textAlignVertical: 'top',
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  selectButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionList: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectValue: {
    fontSize: 15,
    color: '#0F1B3A',
  },
  placeholder: {
    fontSize: 15,
    color: '#9DA8C3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,18,35,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1B3A',
  },
  modalList: {
    gap: 8,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 15,
    color: '#0F1B3A',
  },
  uploadField: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B7C3DE',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F7F9FD',
  },
  uploadText: {
    fontSize: 14,
    color: '#1B5CC4',
    fontWeight: '600',
  },
  uploadTextSelected: {
    color: '#0F1B3A',
  },
  optionalNote: {
    fontSize: 12,
    color: '#5E6B85',
  },
  submitButton: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 26,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1B5CC4',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
