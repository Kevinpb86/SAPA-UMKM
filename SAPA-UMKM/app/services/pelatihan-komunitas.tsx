import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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
    background: '#FBF6FF',
    hero: ['#A855F7', '#8B5CF6'],
    card: '#FFFFFF',
    border: '#E6D4FF',
    text: '#27104B',
    subtle: '#5D4393',
    accent: '#A855F7',
  },
  dark: {
    background: '#190A33',
    hero: ['#7C3AED', '#6D28D9'],
    card: '#221040',
    border: '#35236B',
    text: '#F6F0FF',
    subtle: '#D8C4FF',
    accent: '#C084FC',
  },
};

const skillOptions = ['Pemasaran Digital', 'Keuangan UMKM', 'Branding Produk', 'Manajemen Operasional'];
const scheduleOptions = ['Akhir Pekan', 'Hari Kerja Pagi', 'Hari Kerja Malam'];

type TrainingForm = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  trainingInterest: string;
  reason: string;
  expectations: string;
};

const defaultForm: TrainingForm = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  trainingInterest: '',
  reason: '',
  expectations: '',
};

export default function CommunityTrainingScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<TrainingForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof TrainingForm>(key: K, value: TrainingForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof TrainingForm> = ['fullName', 'phone', 'businessName', 'trainingInterest'];
    for (const field of requiredFields) {
      if (!form[field].trim()) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nama peserta, komunitas, lokasi, dan kontak terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert('Pendaftaran diterima', 'Tim komunitas akan menghubungi Anda untuk konfirmasi jadwal pelatihan.');
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kesalahan saat mengirim formulir. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroWrapper}>
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
              <Text style={styles.heroTitle}>Pendaftaran Pelatihan Komunitas</Text>
              <Text style={styles.heroSubtitle}>
                Tingkatkan kompetensi dan perluas jejaring usaha Anda melalui rangkaian pelatihan eksklusif SAPA UMKM.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#05966933', 'transparent'] : ['#ECFDF5', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="calendar" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Format Pelatihan</Text>
            </View>
            <View style={styles.sectionBody}>
              <InfoRow
                colors={colors}
                icon="clock"
                text="Durasi 2 jam setiap sesi dengan praktek langsung dan studi kasus UMKM."
              />
              <InfoRow
                colors={colors}
                icon="map-pin"
                text="Lokasi bergilir di balai kota/koperasi setempat atau daring via Zoom."
              />
              <InfoRow
                colors={colors}
                icon="award"
                text="Sertifikat keikutsertaan dan materi pelatihan akan dibagikan setelah sesi."
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Pendaftaran Pelatihan</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lengkap Calon Peserta"
                icon="user"
                placeholder="Nama sesuai identitas"
                value={form.fullName}
                onChangeText={value => handleChange('fullName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: peserta@umkm.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon / WhatsApp"
                icon="phone"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha / Brand"
                icon="tag"
                placeholder="Nama brand atau usaha saat ini"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Pilih Pelatihan yang Diminati"
                icon="book-open"
                placeholder="Pemasaran Digital, Keuangan, Ekspor, dsb."
                value={form.trainingInterest}
                onChangeText={value => handleChange('trainingInterest', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alasan Mengikuti Pelatihan"
                icon="help-circle"
                placeholder="Apa yang ingin Anda pelajari atau perbaiki dari usaha Anda?"
                value={form.reason}
                onChangeText={value => handleChange('reason', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Ekspektasi Hasil Pelatihan"
                icon="target"
                placeholder="Apa target konkret Anda setelah mengikuti pelatihan ini?"
                value={form.expectations}
                onChangeText={value => handleChange('expectations', value)}
                colors={colors}
                multiline
              />
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={submitting}
              style={styles.submitWrapper}
            >
              <LinearGradient
                colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Daftar Sekarang'}</Text>
                <Feather name={submitting ? 'loader' : 'send'} size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  placeholder,
  value,
  onChangeText,
  colors,
  multiline,
  keyboardType = 'default',
}: LabeledInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <View style={[
        styles.inputInner,
        {
          backgroundColor: isFocused ? colors.card : `${colors.subtle}08`,
          borderColor: isFocused ? colors.accent : 'transparent',
          alignItems: multiline ? 'flex-start' : 'center',
          paddingTop: multiline ? 12 : 0,
        }
      ]}>
        <View style={multiline ? { marginTop: 4 } : null}>
          <Feather name={icon} size={18} color={isFocused ? colors.accent : colors.subtle} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}60`}
          multiline={multiline}
          keyboardType={keyboardType}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? 96 : 48,
            },
            multiline && { paddingTop: 0, paddingBottom: 12 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </View>
    </View>
  );
}

type InfoRowProps = {
  colors: typeof palette.light;
  icon: React.ComponentProps<typeof Feather>['name'];
  text: string;
};

function InfoRow({ colors, icon, text }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={16} color={colors.accent} />
      <Text style={[styles.infoText, { color: colors.subtle }]}>{text}</Text>
    </View>
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
    gap: 20,
  },
  heroWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  hero: {
    padding: 24,
    gap: 16,
    zIndex: 1,
  },
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(6, 78, 59, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(236, 253, 245, 0.9)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    borderRadius: 32,
    borderWidth: 0,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 20,
  },
  inputWrapper: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  submitWrapper: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});


