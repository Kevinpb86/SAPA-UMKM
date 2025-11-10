import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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
    background: '#F2FBFF',
    hero: ['#0EA5E9', '#14B8A6'],
    card: '#FFFFFF',
    border: '#CDEFF6',
    text: '#0F172A',
    subtle: '#4C5F7E',
    accent: '#0EA5E9',
  },
  dark: {
    background: '#061C26',
    hero: ['#0F766E', '#0EA5E9'],
    card: '#0F2430',
    border: '#1C3A45',
    text: '#F4FBFF',
    subtle: '#B2E4F2',
    accent: '#38BDF8',
  },
};

const moduleCatalog = [
  {
    id: 'fundamental',
    title: 'Dasar Pengelolaan UMKM',
    summary: 'Belajar legalitas, perizinan, dan administrasi usaha.',
  },
  {
    id: 'marketing',
    title: 'Pemasaran Digital',
    summary: 'Optimalkan media sosial dan marketplace untuk meningkatkan penjualan.',
  },
  {
    id: 'finance',
    title: 'Keuangan & Akuntansi Sederhana',
    summary: 'Kelola arus kas, pencatatan, dan laporan keuangan UMKM.',
  },
  {
    id: 'export',
    title: 'Persiapan Ekspor UMKM',
    summary: 'Pelajari standar produk, dokumen ekspor, dan strategi penetrasi pasar global.',
  },
];

type AccessForm = {
  participantName: string;
  email: string;
  businessName: string;
  focusArea: string;
  learningGoal: string;
};

const defaultForm: AccessForm = {
  participantName: '',
  email: '',
  businessName: '',
  focusArea: moduleCatalog[0].title,
  learningGoal: '',
};

export default function ElearningScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<AccessForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof AccessForm>(key: K, value: AccessForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof AccessForm> = ['participantName', 'email', 'businessName', 'learningGoal'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nama peserta, email, nama usaha, dan tujuan belajar.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Akses dikirim',
        'Tautan pembelajaran e-learning telah kami kirim ke email Anda. Selamat belajar!',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kendala saat memproses akses. Silakan coba kembali.');
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
            <Text style={styles.heroKicker}>Modul Pembelajaran E-Learning</Text>
            <Text style={styles.heroTitle}>Belajar Mandiri Kapan Saja dan Di Mana Saja</Text>
            <Text style={styles.heroSubtitle}>
              Akses modul interaktif yang disusun oleh KemenKopUKM. Tingkatkan kompetensi usaha Anda melalui video,
              studi kasus, dan kuis evaluasi.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="book-open" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Pilih Modul Sesuai Kebutuhan</Text>
            </View>
            <View style={styles.moduleList}>
              {moduleCatalog.map(module => (
                <View key={module.id} style={[styles.moduleCard, { borderColor: colors.border }]}>
                  <Text style={[styles.moduleTitle, { color: colors.text }]}>{module.title}</Text>
                  <Text style={[styles.moduleSummary, { color: colors.subtle }]}>{module.summary}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Permintaan Akses</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Peserta"
                placeholder="Nama lengkap"
                value={form.participantName}
                onChangeText={value => handleChange('participantName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email"
                placeholder="contoh: belajar@umkm.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama brand / organisasi"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Fokus Pembelajaran</Text>
              <View style={styles.pillGroup}>
                {moduleCatalog.map(module => {
                  const active = form.focusArea === module.title;
                  return (
                    <TouchableOpacity
                      key={module.id}
                      accessibilityRole="button"
                      onPress={() => handleChange('focusArea', module.title)}
                      style={[
                        styles.pill,
                        {
                          borderColor: active ? colors.accent : colors.border,
                          backgroundColor: active ? `${colors.accent}1A` : colors.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: active ? colors.accent : colors.subtle },
                        ]}
                      >
                        {module.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Tujuan Belajar"
                placeholder="Contoh: Memahami pencatatan keuangan, membuat strategi pemasaran"
                value={form.learningGoal}
                onChangeText={value => handleChange('learningGoal', value)}
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
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Mulai Belajar'}</Text>
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
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
  colors,
  multiline,
  keyboardType = 'default',
}: LabeledInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${colors.subtle}80`}
        multiline={multiline}
        keyboardType={keyboardType}
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
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(219, 239, 255, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(225, 245, 255, 0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 18,
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
  moduleList: {
    gap: 12,
  },
  moduleCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  moduleSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
  fieldGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
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


