import { useAuth } from '@/hooks/use-auth';
import { createSubmission } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
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
    background: '#FFF7ED',
    card: '#FFFFFF',
    border: '#FDEAD7',
    text: '#54260F',
    subtle: '#8A5C3B',
    accent: '#F97316',
  },
  dark: {
    background: '#2C1608',
    card: '#3B1E0A',
    border: '#5C3411',
    text: '#FCEFE6',
    subtle: '#F5CBA7',
    accent: '#FB923C',
  },
};

type FormState = {
  registrationNumber: string;
  productName: string;
  producerName: string;
  productType: string;
  notes: string;
};

const defaultForm: FormState = {
  registrationNumber: '',
  productName: '',
  producerName: '',
  productType: '',
  notes: '',
};

export default function BpomCertificateFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    if (!form.registrationNumber.trim() || !form.productName.trim() || !form.producerName.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nomor registrasi BPOM, nama produk, dan produsen.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'bpom',
        data: form
      });
      Alert.alert(
        'Permintaan terkirim',
        'Permintaan cek registrasi BPOM telah diterima. Kami akan menindaklanjuti data Anda segera.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim permintaan.');
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
                <Feather name="shield" size={22} color={colors.accent} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.text }]}>Form Cek Registrasi BPOM</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Lengkapi data utama registrasi BPOM untuk memastikan izin edar masih berlaku.
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nomor Registrasi BPOM"
                placeholder="Contoh: MD 123456789012"
                value={form.registrationNumber}
                onChangeText={value => handleChange('registrationNumber', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Produk"
                placeholder="Nama produk sesuai label"
                value={form.productName}
                onChangeText={value => handleChange('productName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Produsen"
                placeholder="Perusahaan atau UMKM penghasil produk"
                value={form.producerName}
                onChangeText={value => handleChange('producerName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Jenis Produk (opsional)"
                placeholder="Obat tradisional, pangan olahan, kosmetik, dll."
                value={form.productType}
                onChangeText={value => handleChange('productType', value)}
                colors={colors}
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Informasi batch, tanggal kedaluwarsa, atau detail lainnya"
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


