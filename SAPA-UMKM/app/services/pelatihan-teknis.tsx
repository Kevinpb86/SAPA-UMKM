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
    background: '#F1F7FF',
    hero: ['#0EA5E9', '#3B82F6'],
    card: '#FFFFFF',
    border: '#CFE3FF',
    text: '#0B1D3A',
    subtle: '#4E648A',
    accent: '#0EA5E9',
  },
  dark: {
    background: '#071426',
    hero: ['#1E40AF', '#0EA5E9'],
    card: '#0F2037',
    border: '#1D3454',
    text: '#F8FBFF',
    subtle: '#B4C9F7',
    accent: '#60A5FA',
  },
};

const moduleOptions = ['Manajemen Keuangan', 'Pemasaran Digital', 'Kualitas Produk', 'Pengembangan SDM'];

type TrainingRequestForm = {
  applicantName: string;
  businessName: string;
  email: string;
  phone: string;
  module: string;
  participants: string;
  preferredDate: string;
  objectives: string;
  notes: string;
};

const defaultForm: TrainingRequestForm = {
  applicantName: '',
  businessName: '',
  email: '',
  phone: '',
  module: moduleOptions[0],
  participants: '',
  preferredDate: '',
  objectives: '',
  notes: '',
};

export default function TechnicalTrainingScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<TrainingRequestForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof TrainingRequestForm>(key: K, value: TrainingRequestForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof TrainingRequestForm> = [
      'applicantName',
      'businessName',
      'phone',
      'participants',
      'preferredDate',
      'objectives',
    ];
    for (const field of requiredFields) {
      if (!form[field].trim()) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nama pengaju, usaha, kontak, jumlah peserta, tanggal, dan tujuan pelatihan.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Permintaan diterima',
        'Tim pelatihan akan menghubungi Anda untuk konfirmasi jadwal dan kebutuhan teknis lainnya.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kendala saat mengirim formulir. Silakan coba kembali.');
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
            <Text style={styles.heroKicker}>Pelatihan Teknis & Manajemen KemenKopUKM</Text>
            <Text style={styles.heroTitle}>Sesuaikan Jadwal Pelatihan untuk Tim UMKM Anda</Text>
            <Text style={styles.heroSubtitle}>
              Ajukan kebutuhan materi pelatihan teknis ataupun manajerial. Tim fasilitator resmi siap membantu UMKM
              meningkatkan kapasitas dan kesiapan ekspansi.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="layers" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skema Pelatihan</Text>
            </View>
            <View style={styles.sectionBody}>
              <InfoRow
                colors={colors}
                icon="clock"
                text="Tersedia sesi intensif 1 hari atau paket in-house 2–3 hari."
              />
              <InfoRow
                colors={colors}
                icon="users"
                text="Minimal 10 peserta atau gabungan UMKM dalam satu wilayah."
              />
              <InfoRow
                colors={colors}
                icon="tv"
                text="Format tatap muka atau daring sesuai kebutuhan peserta."
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Permohonan Pelatihan</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Pengaju"
                placeholder="Nama lengkap PIC"
                value={form.applicantName}
                onChangeText={value => handleChange('applicantName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha / Organisasi"
                placeholder="Nama UMKM atau asosiasi"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email (opsional)"
                placeholder="contoh: pelatihan@umkm.id"
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
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Pilih Modul Pelatihan</Text>
              <View style={styles.pillGroup}>
                {moduleOptions.map(option => {
                  const active = option === form.module;
                  return (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      onPress={() => handleChange('module', option)}
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

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Jumlah Peserta"
                placeholder="Contoh: 25 orang"
                value={form.participants}
                onChangeText={value => handleChange('participants', value)}
                colors={colors}
              />
              <LabeledInput
                label="Tanggal yang Diinginkan"
                placeholder="Contoh: 15 Februari 2026"
                value={form.preferredDate}
                onChangeText={value => handleChange('preferredDate', value)}
                colors={colors}
              />
              <LabeledInput
                label="Tujuan Pelatihan"
                placeholder="Contoh: Menyusun SOP produksi, optimasi pemasaran digital"
                value={form.objectives}
                onChangeText={value => handleChange('objectives', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Kebutuhan alat, lokasi, atau kolaborasi dengan daerah lain"
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
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Jadwalkan Pelatihan'}</Text>
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
    backgroundColor: 'rgba(11, 29, 58, 0.22)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(213, 233, 255, 0.9)',
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
    color: 'rgba(228, 241, 255, 0.9)',
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


