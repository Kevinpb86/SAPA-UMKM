import { useAuth } from '@/hooks/use-auth';
import { createSubmission } from '@/lib/api';
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
    background: '#F5F8FF',
    hero: ['#2563EB', '#4F46E5'],
    card: '#FFFFFF',
    border: '#DDE5FF',
    text: '#111827',
    subtle: '#4B5563',
    accent: '#2563EB',
  },
  dark: {
    background: '#0B1224',
    hero: ['#1D4ED8', '#4338CA'],
    card: '#111C32',
    border: '#1F2A4A',
    text: '#F9FAFB',
    subtle: '#CBD5F5',
    accent: '#60A5FA',
  },
};

const highlightPoints = [
  'Pendampingan intensif selama 3 bulan bersama mentor berpengalaman.',
  'Workshop mingguan seputar pemasaran digital, keuangan, dan manajemen tim.',
  'Kesempatan pitching di depan investor dan jaringan kemitraan pemerintah.',
];

const cohortSchedule = [
  { title: 'Batch Seleksi', value: '1 – 15 Desember 2025' },
  { title: 'Kick-off Program', value: '6 Januari 2026' },
  { title: 'Demo Day', value: '26 Maret 2026' },
];

const stageOptions = ['Ide / Prototype', 'Sudah Berjualan', 'Siap Ekspansi'];

type IncubationForm = {
  founderName: string;
  email: string;
  phone: string;
  businessName: string;
  businessStage: string;
  focusArea: string;
  programGoal: string;
  supportNeeded: string;
};

const defaultForm: IncubationForm = {
  founderName: '',
  email: '',
  phone: '',
  businessName: '',
  businessStage: stageOptions[0],
  focusArea: '',
  programGoal: '',
  supportNeeded: '',
};

export default function IncubationProgramScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<IncubationForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof IncubationForm>(key: K, value: IncubationForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof IncubationForm> = [
      'founderName',
      'email',
      'phone',
      'businessName',
      'focusArea',
      'programGoal',
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon lengkapi identitas founder, usaha, dan tujuan program.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'inkubasi',
        data: form
      });
      Alert.alert(
        'Pendaftaran terkirim',
        'Pengajuan program inkubasi telah kami terima. Tim kurator akan menghubungi Anda untuk proses selanjutnya.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim formulir.');
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
            <Text style={styles.heroKicker}>Program Inkubasi & Bimbingan</Text>
            <Text style={styles.heroTitle}>Skala Usaha Anda Bersama Mentor Terbaik</Text>
            <Text style={styles.heroSubtitle}>
              Dapatkan pendampingan terstruktur, konsultasi bisnis, serta akses jaringan pemasaran dan pendanaan
              melalui cohort terbaru SAPA UMKM.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="info" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tentang Program</Text>
            </View>
            <View style={styles.sectionBody}>
              {highlightPoints.map(point => (
                <View key={point} style={styles.highlightRow}>
                  <Feather name="check-circle" size={16} color={colors.accent} />
                  <Text style={[styles.highlightText, { color: colors.subtle }]}>{point}</Text>
                </View>
              ))}
            </View>
            <View style={styles.divider} />
            <Text style={[styles.scheduleHeading, { color: colors.text }]}>Timeline Cohort</Text>
            <View style={styles.scheduleList}>
              {cohortSchedule.map(item => (
                <View key={item.title} style={[styles.scheduleCard, { borderColor: colors.border }]}>
                  <Text style={[styles.scheduleTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.scheduleValue, { color: colors.subtle }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Pendaftaran</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Founder / Penanggung Jawab"
                placeholder="Nama lengkap"
                value={form.founderName}
                onChangeText={value => handleChange('founderName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                placeholder="contoh: founder@usaha.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon / WhatsApp"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama brand atau usaha yang berjalan"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.subtle }]}>Tahap Usaha Saat Ini</Text>
                <View style={styles.pillGroup}>
                  {stageOptions.map(option => {
                    const active = option === form.businessStage;
                    return (
                      <TouchableOpacity
                        key={option}
                        accessibilityRole="button"
                        onPress={() => handleChange('businessStage', option)}
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
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <LabeledInput
                label="Fokus Produk / Layanan"
                placeholder="Contoh: Kopi siap seduh, aplikasi edukasi UMKM"
                value={form.focusArea}
                onChangeText={value => handleChange('focusArea', value)}
                colors={colors}
              />
              <LabeledInput
                label="Tujuan Mengikuti Program"
                placeholder="Jelaskan target yang ingin dicapai selama program"
                value={form.programGoal}
                onChangeText={value => handleChange('programGoal', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Bantuan yang Dibutuhkan (opsional)"
                placeholder="Mentor pemasaran, pengelolaan keuangan, akses investor, dll."
                value={form.supportNeeded}
                onChangeText={value => handleChange('supportNeeded', value)}
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
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Daftar Program Inkubasi'}</Text>
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
            minHeight: multiline ? 96 : 50,
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
    backgroundColor: 'rgba(17, 24, 39, 0.24)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(219, 234, 254, 0.9)',
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
    color: 'rgba(235, 245, 255, 0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  highlightRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  scheduleHeading: {
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scheduleCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  scheduleValue: {
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


