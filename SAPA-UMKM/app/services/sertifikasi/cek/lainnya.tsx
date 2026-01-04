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
    background: '#F9F5FF',
    card: '#FFFFFF',
    border: '#E7DAFF',
    text: '#2D0F54',
    subtle: '#6F4C9A',
    accent: '#7C3AED',
  },
  dark: {
    background: '#1A0D33',
    card: '#221144',
    border: '#382066',
    text: '#F8F5FF',
    subtle: '#D7B9FF',
    accent: '#A855F7',
  },
};

type FormState = {
  standardType: string;
  certificateNumber: string;
  holderName: string;
  productOrProcess: string;
  issuingBody: string;
  notes: string;
};

const defaultForm: FormState = {
  standardType: '',
  certificateNumber: '',
  holderName: '',
  productOrProcess: '',
  issuingBody: '',
  notes: '',
};

export default function OtherCertificateFormScreen() {
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
    if (!form.certificateNumber.trim() || !form.holderName.trim() || !form.productOrProcess.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Masukkan nomor sertifikat, nama pemegang, dan produk/proses terkait.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'lainnya',
        data: form
      });
      Alert.alert(
        'Permintaan terkirim',
        'Data sertifikasi telah kami terima. Tim akan membantu verifikasi untuk standar khusus yang Anda pilih.',
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
                <Feather name="file-text" size={22} color={colors.accent} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.text }]}>Form Cek Standar Lainnya</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Gunakan formulir ini untuk standar seperti ISO, HACCP, organik, atau sertifikasi ekspor lainnya.
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Jenis Sertifikasi"
                placeholder="Contoh: ISO 22000, HACCP, Fair Trade"
                value={form.standardType}
                onChangeText={value => handleChange('standardType', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Sertifikat"
                placeholder="Nomor atau kode sertifikat resmi"
                value={form.certificateNumber}
                onChangeText={value => handleChange('certificateNumber', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Pemegang Sertifikat"
                placeholder="Perusahaan, koperasi, atau individu"
                value={form.holderName}
                onChangeText={value => handleChange('holderName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Produk / Proses yang Disertifikasi"
                placeholder="Produk, lini produksi, atau layanan tertentu"
                value={form.productOrProcess}
                onChangeText={value => handleChange('productOrProcess', value)}
                colors={colors}
              />
              <LabeledInput
                label="Lembaga Penerbit (opsional)"
                placeholder="Nama lembaga, auditor, atau negara penerbit"
                value={form.issuingBody}
                onChangeText={value => handleChange('issuingBody', value)}
                colors={colors}
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Masukkan keterangan lain yang perlu diverifikasi"
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


