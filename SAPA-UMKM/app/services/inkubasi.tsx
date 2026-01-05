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
              <Text style={styles.heroKicker}>Program Inkubasi & Bimbingan</Text>
              <Text style={styles.heroTitle}>Skala Usaha Anda Bersama Mentor Terbaik</Text>
              <Text style={styles.heroSubtitle}>
                Dapatkan pendampingan terstruktur, konsultasi bisnis, serta akses jaringan pemasaran dan pendanaan
                melalui cohort terbaru SAPA UMKM.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#1D4ED833', 'transparent'] : ['#F5F8FF', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

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
                icon="user"
                placeholder="Nama lengkap"
                value={form.founderName}
                onChangeText={value => handleChange('founderName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: founder@usaha.id"
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
                label="Nama Usaha"
                icon="tag"
                placeholder="Nama brand atau usaha yang berjalan"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Tahap Usaha Saat Ini</Text>
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
                            backgroundColor: `${colors.subtle}08`,
                            borderColor: 'transparent',
                          },
                          active && {
                            borderColor: colors.accent,
                            backgroundColor: `${colors.accent}15`,
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
                icon="layers"
                placeholder="Contoh: Kopi siap seduh, aplikasi edukasi UMKM"
                value={form.focusArea}
                onChangeText={value => handleChange('focusArea', value)}
                colors={colors}
              />
              <LabeledInput
                label="Tujuan Mengikuti Program"
                icon="target"
                placeholder="Jelaskan target yang ingin dicapai selama program"
                value={form.programGoal}
                onChangeText={value => handleChange('programGoal', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Bantuan yang Dibutuhkan (opsional)"
                icon="help-circle"
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
              style={styles.submitWrapper}
            >
              <LinearGradient
                colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Daftar Program Inkubasi'}</Text>
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
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}50`}
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
    backgroundColor: 'rgba(17, 24, 39, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(219, 234, 254, 0.9)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(235, 245, 255, 0.92)',
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
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
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
    fontWeight: '500',
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  scheduleHeading: {
    fontSize: 15,
    fontWeight: '800',
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
    borderWidth: 1.5,
    padding: 14,
    gap: 6,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.7,
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
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
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


