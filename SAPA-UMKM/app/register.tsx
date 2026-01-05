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

import { useAuth } from '@/hooks/use-auth';

const palette = {
  light: {
    background: '#F5F7FB',
    card: '#FFFFFF',
    text: '#0F172A',
    subtle: '#64748B',
    primary: '#2563EB',
    border: '#E2E8F0',
    input: '#FFFFFF',
    accent: '#3B82F6',
    focus: '#2563EB',
    success: '#10B981',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    primary: '#3B82F6',
    border: '#334155',
    input: '#0F172A',
    accent: '#60A5FA',
    focus: '#3B82F6',
    success: '#34D399',
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

type FormInputProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
  onIconPress?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function FormInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  required,
  keyboardType = 'default',
  secureTextEntry,
  multiline,
  onIconPress,
  rightIcon,
  autoCapitalize,
}: FormInputProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: isFocused ? colors.focus : colors.border,
            backgroundColor: colors.input,
            minHeight: multiline ? 100 : 54,
            alignItems: multiline ? 'flex-start' : 'center',
            paddingTop: multiline ? 12 : 0,
          },
        ]}>
        <Feather
          name={icon}
          size={18}
          color={isFocused ? colors.focus : colors.subtle}
          style={[styles.inputIcon, multiline && { marginTop: 4 }]}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}80`}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: colors.text },
            multiline && { textAlignVertical: 'top', paddingTop: 0 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
          ]}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onIconPress} style={styles.passwordToggle}>
            <Feather name={rightIcon} size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function SelectField({ label, icon, placeholder, options, value, onChange, required }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;

  return (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={[styles.selectButton, { borderColor: colors.border, backgroundColor: colors.input }]}>
        <View style={styles.selectContent}>
          <Feather name={icon} size={18} color={colors.subtle} style={styles.inputIcon} />
          <Text style={value ? [styles.selectValue, { color: colors.text }] : [styles.placeholder, { color: `${colors.subtle}80` }]}>
            {value || placeholder}
          </Text>
        </View>
        <Feather name="chevron-down" size={18} color={colors.subtle} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{label}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => setVisible(false)}>
                <Feather name="x" size={20} color={colors.subtle} />
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
                  style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>{option}</Text>
                  {value === option && <Feather name="check" size={16} color={colors.primary} />}
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#1E3A8A', '#2563EB', '#3B82F6']}
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
                <Feather name="shield" size={16} color="#FFFFFF" />
                <Text style={styles.heroTagText}>Portal Registrasi UMKM</Text>
              </View>
              <Text style={styles.heroTitle}>Registrasi Pelaku UMKM</Text>
              <Text style={styles.heroSubtitle}>
                Lengkapi data pemilik, identitas usaha, dan dokumen pendukung untuk mengakses layanan SAPA UMKM secara terpadu.
              </Text>
            </View>

            <View style={styles.heroChecklist}>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="user-check" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>NIK & NPWP pemilik</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="briefcase" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>Detail usaha & KBLI</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="file-text" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>E-KTP & Dokumen</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}15` }]}
              >
                <Feather name="user" size={20} color={colors.primary} />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Informasi identitas pribadi sesuai dokumen resmi.
                </Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              <FormInput
                label="NIK (Nomor Induk Kependudukan)"
                icon="credit-card"
                placeholder="Masukkan 16 digit NIK"
                value={form.nik}
                onChangeText={value => handleChange('nik', value)}
                keyboardType="number-pad"
                required
              />
              <FormInput
                label="Nama Lengkap Pemilik"
                icon="user"
                placeholder="Sesuai e-KTP"
                value={form.ownerName}
                onChangeText={value => handleChange('ownerName', value)}
                required
              />
              <FormInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: pelaku@umkm.id"
                value={form.email}
                onChangeText={value => handleChange('email', value.trim())}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />
              <FormInput
                label="Kata Sandi"
                icon="lock"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChangeText={value => handleChange('password', value)}
                secureTextEntry={!passwordVisible}
                rightIcon={passwordVisible ? 'eye-off' : 'eye'}
                onIconPress={() => setPasswordVisible(!passwordVisible)}
                required
              />
              <FormInput
                label="NPWP Pribadi"
                icon="file-text"
                placeholder="Nomor Pokok Wajib Pajak"
                value={form.npwp}
                onChangeText={value => handleChange('npwp', value)}
                keyboardType="number-pad"
                required
              />
              <FormInput
                label="Alamat Pemilik"
                icon="map-pin"
                placeholder="Sesuai domisili pribadi"
                value={form.ownerAddress}
                onChangeText={value => handleChange('ownerAddress', value)}
                multiline
                required
              />
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIcon, { backgroundColor: `${colors.success}15` }]}
              >
                <Feather name="briefcase" size={20} color={colors.success} />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usaha</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                  Detail usaha yang akan didaftarkan dalam SAPA UMKM.
                </Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              <FormInput
                label="Nama Usaha"
                icon="shopping-bag"
                placeholder="Nama brand atau toko"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                required
              />
              <FormInput
                label="Alamat Lokasi Usaha"
                icon="map"
                placeholder="Alamat tempat usaha beroperasi"
                value={form.businessAddress}
                onChangeText={value => handleChange('businessAddress', value)}
                multiline
                required
              />
              <SelectField
                label="Kode KBLI"
                icon="hash"
                placeholder="Pilih kode KBLI"
                options={kbliOptions}
                value={form.kbli}
                onChange={value => handleChange('kbli', value)}
                required
              />
              <SelectField
                label="Sektor Usaha"
                icon="grid"
                placeholder="Pilih sektor usaha"
                options={sectorOptions}
                value={form.sector}
                onChange={value => handleChange('sector', value)}
                required
              />
              <SelectField
                label="Skala Usaha"
                icon="trending-up"
                placeholder="Pilih skala usaha"
                options={scaleOptions}
                value={form.scale}
                onChange={value => handleChange('scale', value)}
                required
              />
              <FormInput
                label="Estimasi Modal Usaha"
                icon="dollar-sign"
                placeholder="Nominal investasi"
                value={form.capital}
                onChangeText={value => handleChange('capital', value)}
                keyboardType="number-pad"
                required
              />
            </View>
          </View>


          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleSubmit}
            style={[styles.submitButton, { backgroundColor: colors.focus, shadowColor: colors.focus }]}>
            <Text style={styles.submitButtonText}>Daftar Sekarang</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            style={styles.footerLink}>
            <Text style={[styles.footerText, { color: colors.subtle }]}>
              Sudah memiliki akun? <Text style={{ color: colors.primary, fontWeight: '700' }}>Masuk di sini</Text>
            </Text>
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
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 32,
    padding: 28,
    gap: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroOverlayOne: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroOverlayTwo: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroBackButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  heroBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroHeader: {
    gap: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  checkInnerIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroChecklistText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 28,
    borderWidth: 0,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  formGroup: {
    gap: 20,
  },
  formField: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    height: '100%',
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 4,
  },
  selectButton: {
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectValue: {
    fontSize: 15,
    fontWeight: '400',
  },
  placeholder: {
    fontSize: 15,
    fontWeight: '400',
  },
  uploadField: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  uploadTextSelected: {
    fontWeight: '600',
  },
  optionalNote: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    marginTop: 2,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 30,
    padding: 24,
    maxHeight: '75%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalList: {
    marginBottom: 8,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
    marginRight: 12,
  },
  footerLink: {
    alignItems: 'center',
    marginVertical: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
