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
    background: '#F0F6FF',
    hero: ['#2563EB', '#1D4ED8'],
    card: '#FFFFFF',
    border: '#D6E4FF',
    text: '#0B1D3A',
    subtle: '#4E5E82',
    accent: '#2563EB',
  },
  dark: {
    background: '#091429',
    hero: ['#1E3A8A', '#1D4ED8'],
    card: '#0F1E36',
    border: '#1F3052',
    text: '#F8FBFF',
    subtle: '#AEC4F9',
    accent: '#60A5FA',
  },
};

const programOptions = ['KUR', 'UMi', 'Banpres Produktif', 'LPDB', 'Pelatihan & Pendampingan'];

type ProgramSubscriptionForm = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  city: string;
  interestedPrograms: string[];
  notes: string;
};

const defaultForm: ProgramSubscriptionForm = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  city: '',
  interestedPrograms: ['KUR'],
  notes: '',
};

export default function ProgramUpdatesScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<ProgramSubscriptionForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const toggleProgram = (program: string) => {
    setForm(prev => {
      const hasProgram = prev.interestedPrograms.includes(program);
      return {
        ...prev,
        interestedPrograms: hasProgram
          ? prev.interestedPrograms.filter(item => item !== program)
          : [...prev.interestedPrograms, program],
      };
    });
  };

  const handleChange = <K extends keyof ProgramSubscriptionForm>(key: K, value: ProgramSubscriptionForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof ProgramSubscriptionForm> = ['name', 'email', 'businessName', 'city'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return form.interestedPrograms.length > 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nama, email, nama usaha, kota, dan pilih minimal satu program.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Langganan berhasil',
        'Kami akan mengirim informasi terkini penyaluran program melalui email yang Anda daftarkan.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kendala saat menyimpan data. Silakan coba kembali.');
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
            <Text style={styles.heroKicker}>Informasi Penyaluran Program KemenKopUKM</Text>
            <Text style={styles.heroTitle}>Tetap Terhubung dengan Program Terbaru</Text>
            <Text style={styles.heroSubtitle}>
              Dapatkan notifikasi pembukaan program pembiayaan, pelatihan, dan pendampingan resmi Kementerian Koperasi
              & UKM sesuai kebutuhan usaha Anda.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="send" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Ringkasan Program</Text>
            </View>
            <View style={styles.sectionBody}>
              <InfoRow
                colors={colors}
                icon="credit-card"
                text="Penyaluran pembiayaan dari KUR, UMi, LPDB, hingga Banpres produktif."
              />
              <InfoRow
                colors={colors}
                icon="book"
                text="Undangan pelatihan dan pendampingan resmi yang membuka pendaftaran."
              />
              <InfoRow
                colors={colors}
                icon="bell"
                text="Pengumuman batas waktu pendaftaran serta syarat dokumen yang harus disiapkan."
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Langganan Informasi</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lengkap"
                placeholder="Nama pemilik / PIC usaha"
                value={form.name}
                onChangeText={value => handleChange('name', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email"
                placeholder="contoh: pemilik@umkm.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon / WhatsApp (opsional)"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama brand atau perusahaan"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Kota / Kabupaten"
                placeholder="Contoh: Kota Surabaya"
                value={form.city}
                onChangeText={value => handleChange('city', value)}
                colors={colors}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Program yang Diminati</Text>
              <View style={styles.pillGroup}>
                {programOptions.map(option => {
                  const active = form.interestedPrograms.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      onPress={() => toggleProgram(option)}
                      style={[
                        styles.pill,
                        {
                          borderColor: active ? colors.accent : colors.border,
                          backgroundColor: active ? `${colors.accent}1A` : colors.card,
                        },
                      ]}
                    >
                      <Feather
                        name={active ? 'check' : 'plus'}
                        size={14}
                        color={active ? colors.accent : colors.subtle}
                      />
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
                label="Catatan (opsional)"
                placeholder="Kebutuhan akses dana, jenis pendampingan, dukungan lainnya"
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
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Lihat Program'}</Text>
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
    backgroundColor: 'rgba(11, 29, 58, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(219, 234, 254, 0.92)',
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
    color: 'rgba(230, 241, 255, 0.9)',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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


