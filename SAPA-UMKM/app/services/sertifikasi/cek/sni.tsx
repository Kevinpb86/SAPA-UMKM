import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
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
import { Feather } from '@expo/vector-icons';

const palette = {
  light: {
    background: '#F5F8FF',
    card: '#FFFFFF',
    border: '#D8E3FF',
    text: '#0B1740',
    subtle: '#5A6A99',
    accent: '#1D4ED8',
  },
  dark: {
    background: '#0B1224',
    card: '#111C32',
    border: '#1E2A4A',
    text: '#F8FAFC',
    subtle: '#B4C5FF',
    accent: '#60A5FA',
  },
};

type FormState = {
  certificateNumber: string;
  companyName: string;
  productScope: string;
  certificationBody: string;
  notes: string;
};

const defaultForm: FormState = {
  certificateNumber: '',
  companyName: '',
  productScope: '',
  certificationBody: '',
  notes: '',
};

export default function SniCertificateFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    if (!form.certificateNumber.trim() || !form.companyName.trim() || !form.productScope.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon isi nomor sertifikat, nama perusahaan, dan ruang lingkup produk.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Permintaan terkirim',
        'Permintaan cek Sertifikat SNI telah kami catat. Kami akan mengirimkan hasil pengecekan segera.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kesalahan saat mengirim permintaan. Silakan coba kembali.');
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
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={[styles.backButton, { borderColor: colors.border }]}
            >
              <Feather name="arrow-left" size={18} color={colors.accent} />
              <Text style={[styles.backButtonText, { color: colors.accent }]}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={[styles.headerIcon, { backgroundColor: `${colors.accent}1A` }]}>
                <Feather name="award" size={22} color={colors.accent} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.text }]}>Form Cek Sertifikat SNI</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Pastikan produk Anda masih terdaftar dan memenuhi Standar Nasional Indonesia (SNI).
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nomor Sertifikat SNI"
                placeholder="Contoh: 12345/LSPro/BPPT/2024"
                value={form.certificateNumber}
                onChangeText={value => handleChange('certificateNumber', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Perusahaan Pemegang"
                placeholder="Nama perusahaan sesuai sertifikat"
                value={form.companyName}
                onChangeText={value => handleChange('companyName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Produk / Ruang Lingkup Standar"
                placeholder="Jenis produk atau layanan yang tersertifikasi"
                value={form.productScope}
                onChangeText={value => handleChange('productScope', value)}
                colors={colors}
              />
              <LabeledInput
                label="Lembaga Sertifikasi (opsional)"
                placeholder="Nama LSPro atau lembaga penerbit"
                value={form.certificationBody}
                onChangeText={value => handleChange('certificationBody', value)}
                colors={colors}
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Informasi tambahan seperti nomor batch atau lokasi pabrik"
                value={form.notes}
                onChangeText={value => handleChange('notes', value)}
                colors={colors}
                multiline
              />
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={submitting}
              style={[
                styles.submitButton,
                { backgroundColor: colors.accent, opacity: submitting ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Kirim Permintaan Cek'}</Text>
              <Feather name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LabeledInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
};

function LabeledInput({ label, placeholder, value, onChangeText, colors, multiline }: LabeledInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${colors.subtle}80`}
        multiline={multiline}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.text,
            minHeight: multiline ? 96 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
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
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  submitButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});


