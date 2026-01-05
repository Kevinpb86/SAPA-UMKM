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
    background: '#F4F9FF',
    hero: ['#0EA5E9', '#2563EB'],
    card: '#FFFFFF',
    border: '#CFE4FF',
    text: '#0F172A',
    subtle: '#4B5563',
    accent: '#0EA5E9',
  },
  dark: {
    background: '#06111F',
    hero: ['#1D4ED8', '#0EA5E9'],
    card: '#0F1C2E',
    border: '#1F2F44',
    text: '#F8FAFC',
    subtle: '#A5C8F5',
    accent: '#38BDF8',
  },
};

const monthOptions = [
  'Januari 2026',
  'Februari 2026',
  'Maret 2026',
  'April 2026',
  'Mei 2026',
  'Juni 2026',
];

type ReportForm = {
  period: string;
  revenue: string;
  expenses: string;
  keyActivities: string;
  achievements: string;
  challenges: string;
  supportRequested: string;
};

const defaultForm: ReportForm = {
  period: monthOptions[0],
  revenue: '',
  expenses: '',
  keyActivities: '',
  achievements: '',
  challenges: '',
  supportRequested: '',
};

export default function BusinessReportScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<ReportForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof ReportForm>(key: K, value: ReportForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof ReportForm> = ['period', 'revenue', 'keyActivities'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi periode laporan, omzet, dan aktivitas utama terlebih dahulu.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'laporan',
        data: form
      });
      Alert.alert(
        'Laporan tersimpan',
        'Laporan perkembangan usaha Anda telah tercatat. Terima kasih atas partisipasinya.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kendala saat menyimpan laporan.');
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
              <Text style={styles.heroKicker}>Pelaporan Kegiatan Usaha</Text>
              <Text style={styles.heroTitle}>Pantau Perkembangan Usaha Setiap Bulan</Text>
              <Text style={styles.heroSubtitle}>
                Kirim ringkasan kinerja usaha, aktivitas utama, serta kebutuhan dukungan agar pemerintah dapat
                memberikan pendampingan yang tepat.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#0EA5E933', 'transparent'] : ['#F0F9FF', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="bar-chart-2" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Ringkasan Laporan</Text>
            </View>
            <Text style={[styles.sectionBody, { color: colors.subtle }]}>
              Laporan ini membantu pemerintah memetakan perkembangan UMKM dan menilai kebutuhan dukungan lanjutan.
              Isi data finansial secara ringkas dan tuliskan aktivitas kunci setiap bulan.
            </Text>
            <View style={styles.highlights}>
              <InfoBadge
                colors={colors}
                icon="calendar"
                title="Jatuh tempo"
                description="Kirim maksimal setiap tanggal 5 bulan berikutnya."
              />
              <InfoBadge
                colors={colors}
                icon="activity"
                title="Data utama"
                description="Omzet, biaya utama, aktivitas, dan rencana bulan depan."
              />
              <InfoBadge
                colors={colors}
                icon="help-circle"
                title="Bantuan"
                description="Sampaikan kebutuhan asistensi agar tim dapat menindaklanjuti."
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Laporan Bulanan</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Periode Pelaporan</Text>
              <View style={styles.pillGroup}>
                {monthOptions.map(option => {
                  const active = option === form.period;
                  return (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      onPress={() => handleChange('period', option)}
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

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Omzet/Bulan"
                icon="dollar-sign"
                placeholder="Contoh: Rp 35.000.000"
                value={form.revenue}
                onChangeText={value => handleChange('revenue', value)}
                colors={colors}
              />
              <LabeledInput
                label="Pengeluaran Utama"
                icon="shopping-cart"
                placeholder="Contoh: Rp 18.000.000"
                value={form.expenses}
                onChangeText={value => handleChange('expenses', value)}
                colors={colors}
              />
              <LabeledInput
                label="Aktivitas Kunci Bulan Ini"
                icon="activity"
                placeholder="Tuliskan promosi, produksi, kemitraan, dsb."
                value={form.keyActivities}
                onChangeText={value => handleChange('keyActivities', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Pencapaian Penting"
                icon="award"
                placeholder="Contoh: Tambah 5 reseller baru, produk baru diluncurkan"
                value={form.achievements}
                onChangeText={value => handleChange('achievements', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kendala yang Dihadapi"
                icon="alert-octagon"
                placeholder="Contoh: Terbatasnya bahan baku, peralatan rusak"
                value={form.challenges}
                onChangeText={value => handleChange('challenges', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kebutuhan Dukungan (opsional)"
                icon="help-circle"
                placeholder="Pendampingan pemasaran, akses pembiayaan, pelatihan, dll."
                value={form.supportRequested}
                onChangeText={value => handleChange('supportRequested', value)}
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
                <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Upload Laporan Bulanan'}</Text>
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
};

function LabeledInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  colors,
  multiline,
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

type InfoBadgeProps = {
  colors: typeof palette.light;
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
};

function InfoBadge({ colors, icon, title, description }: InfoBadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: colors.border }]}>
      <View style={[styles.badgeIcon, { backgroundColor: `${colors.accent}15` }]}>
        <Feather name={icon} size={16} color={colors.accent} />
      </View>
      <Text style={[styles.badgeTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.badgeDescription, { color: colors.subtle }]}>{description}</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(224, 242, 254, 0.9)',
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
    color: 'rgba(235, 248, 255, 0.9)',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.7,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flex: 1,
    minWidth: 150,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  badgeDescription: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.7,
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
  fieldGroup: {
    gap: 20,
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


