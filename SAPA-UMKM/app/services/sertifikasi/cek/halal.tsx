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
    background: '#F3FBF8',
    card: '#FFFFFF',
    border: '#CFF0E7',
    text: '#083B36',
    subtle: '#4A6F6A',
    accent: '#0F766E',
  },
  dark: {
    background: '#082420',
    card: '#102D28',
    border: '#1F433B',
    text: '#F8FAFC',
    subtle: '#A7F3D0',
    accent: '#34D399',
  },
};

type FormState = {
  certificateNumber: string;
  holderName: string;
  productName: string;
  issuedBy: string;
  notes: string;
};

const defaultForm: FormState = {
  certificateNumber: '',
  holderName: '',
  productName: '',
  issuedBy: '',
  notes: '',
};

export default function HalalCertificateFormScreen() {
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
    if (!form.certificateNumber.trim() || !form.holderName.trim() || !form.productName.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon masukkan nomor sertifikat, nama pemegang, dan nama produk.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Permintaan terkirim',
        'Permintaan cek Sertifikat Halal Anda telah kami terima. Hasil pengecekan akan diinformasikan segera.',
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
                <Feather name="check-circle" size={22} color={colors.accent} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.text }]}>Form Cek Sertifikat Halal</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Isi data pokok sertifikat Halal sesuai dokumen resmi agar status keabsahan dapat diverifikasi.
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nomor Sertifikat Halal"
                placeholder="Contoh: ID1234567890"
                value={form.certificateNumber}
                onChangeText={value => handleChange('certificateNumber', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Pemegang Sertifikat"
                placeholder="Nama pemilik atau perusahaan"
                value={form.holderName}
                onChangeText={value => handleChange('holderName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Produk / Merek"
                placeholder="Produk yang tersertifikasi"
                value={form.productName}
                onChangeText={value => handleChange('productName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Lembaga Penerbit (opsional)"
                placeholder="BPJPH, MUI, atau lembaga resmi lainnya"
                value={form.issuedBy}
                onChangeText={value => handleChange('issuedBy', value)}
                colors={colors}
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Informasi batch, pabrik, atau keterangan lain"
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


