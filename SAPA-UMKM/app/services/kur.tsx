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
    background: '#FDF5ED',
    hero: ['#F97316', '#F59E0B'],
    card: '#FFFFFF',
    border: '#F4E0CA',
    text: '#431407',
    subtle: '#8A4B16',
    accent: '#EA580C',
  },
  dark: {
    background: '#1C1006',
    hero: ['#EA580C', '#C2410C'],
    card: '#26160B',
    border: '#3F2714',
    text: '#FDEDE3',
    subtle: '#F3B98A',
    accent: '#FB923C',
  },
};

type KurForm = {
  ownerName: string;
  nik: string;
  email: string;
  phone: string;
  businessName: string;
  businessSector: string;
  businessDuration: string;
  monthlyRevenue: string;
  loanAmount: string;
  loanPurpose: string;
  tenor: string;
  collateral: string;
};

const defaultForm: KurForm = {
  ownerName: '',
  nik: '',
  email: '',
  phone: '',
  businessName: '',
  businessSector: '',
  businessDuration: '',
  monthlyRevenue: '',
  loanAmount: '',
  loanPurpose: '',
  tenor: '12 bulan',
  collateral: '',
};

const tenorOptions = ['12 bulan', '18 bulan', '24 bulan', '36 bulan'];

export default function KurServiceFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<KurForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof KurForm>(key: K, value: KurForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof KurForm> = [
      'ownerName',
      'nik',
      'phone',
      'businessName',
      'businessSector',
      'loanAmount',
      'loanPurpose',
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
      Alert.alert('Data belum lengkap', 'Pastikan data pemohon, data usaha, dan detail pembiayaan terisi.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'kur',
        data: form
      });
      Alert.alert(
        'Pengajuan tersimpan',
        'Permohonan KUR Anda telah dicatat. Petugas akan menghubungi Anda untuk tahap verifikasi berikutnya.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data.');
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
              <Text style={styles.heroTitle}>Form Pengajuan Program KUR</Text>
              <Text style={styles.heroSubtitle}>
                Siapkan data pemohon dan usaha untuk mengajukan Kredit Usaha Rakyat dengan bunga rendah dan tenor fleksibel.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#C2410C33', 'transparent'] : ['#FFF7ED', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Data Pemohon"
              subtitle="Lengkapi identitas dan kontak pemohon KUR."
              icon="user"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lengkap Pemohon"
                icon="user"
                placeholder="Sesuai e-KTP"
                value={form.ownerName}
                onChangeText={value => handleChange('ownerName', value)}
                colors={colors}
              />
              <LabeledInput
                label="NIK (Nomor Induk Kependudukan)"
                icon="credit-card"
                placeholder="16 digit NIK"
                keyboardType="number-pad"
                value={form.nik}
                onChangeText={value => handleChange('nik', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: pemohon@usaha.id"
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
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Profil Usaha"
              subtitle="Informasi singkat mengenai usaha yang akan dibiayai."
              icon="briefcase"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Usaha / Brand"
                icon="tag"
                placeholder="Nama usaha yang berjalan"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Sektor Usaha"
                icon="layers"
                placeholder="Contoh: Makanan & Minuman, Perdagangan"
                value={form.businessSector}
                onChangeText={value => handleChange('businessSector', value)}
                colors={colors}
              />
              <LabeledInput
                label="Lama Usaha Berjalan"
                icon="clock"
                placeholder="Contoh: 3 tahun"
                value={form.businessDuration}
                onChangeText={value => handleChange('businessDuration', value)}
                colors={colors}
              />
              <LabeledInput
                label="Omzet Rata-rata per Bulan"
                icon="trending-up"
                placeholder="Contoh: Rp 25.000.000"
                value={form.monthlyRevenue}
                onChangeText={value => handleChange('monthlyRevenue', value)}
                colors={colors}
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Detail Pembiayaan"
              subtitle="Jelaskan kebutuhan pendanaan yang diajukan."
              icon="credit-card"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Jumlah Pembiayaan yang Diajukan"
                icon="dollar-sign"
                placeholder="Contoh: Rp 75.000.000"
                value={form.loanAmount}
                onChangeText={value => handleChange('loanAmount', value)}
                colors={colors}
              />
              <LabeledInput
                label="Tujuan Penggunaan Dana"
                icon="file-text"
                placeholder="Contoh: Tambahan modal bahan baku, renovasi, beli mesin"
                value={form.loanPurpose}
                onChangeText={value => handleChange('loanPurpose', value)}
                colors={colors}
                multiline
              />
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Tenor yang Diinginkan</Text>
                <View style={styles.pillGroup}>
                  {tenorOptions.map(option => {
                    const active = option === form.tenor;
                    return (
                      <TouchableOpacity
                        key={option}
                        accessibilityRole="button"
                        onPress={() => handleChange('tenor', option)}
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
                label="Jaminan / Agunan (opsional)"
                icon="shield"
                placeholder="Contoh: BPKB motor, sertifikat rumah"
                value={form.collateral}
                onChangeText={value => handleChange('collateral', value)}
                colors={colors}
              />
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={submitting}
              style={styles.submitWrapper}
            >
              <LinearGradient
                colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Kirim Pengajuan KUR'}</Text>
                <Feather name={submitting ? 'loader' : 'send'} size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type SectionHeaderProps = {
  colors: typeof palette.light;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

function SectionHeader({ colors, title, subtitle, icon }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: `${colors.accent}12` }]}>
        <Feather name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.sectionCopy}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>{subtitle}</Text>
      </View>
    </View>
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
          placeholderTextColor={`${colors.subtle}60`}
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
    backgroundColor: 'rgba(67, 20, 7, 0.2)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 249, 240, 0.9)',
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
    gap: 14,
    alignItems: 'center',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
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


