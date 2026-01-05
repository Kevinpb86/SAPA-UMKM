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
    background: '#F5F3FF',
    hero: ['#6D28D9', '#7C3AED'],
    card: '#FFFFFF',
    border: '#DED3FF',
    text: '#1E0B47',
    subtle: '#584985',
    accent: '#6D28D9',
  },
  dark: {
    background: '#130B26',
    hero: ['#5B21B6', '#7C3AED'],
    card: '#1C0F3D',
    border: '#2F1C58',
    text: '#F3E8FF',
    subtle: '#C4B5FD',
    accent: '#A855F7',
  },
};

const legalEntityOptions = ['Koperasi', 'PT', 'CV', 'Yayasan', 'Badan Usaha Lain'];

type LpdbForm = {
  institutionName: string;
  legalEntity: string;
  establishedSince: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessFocus: string;
  requestedFund: string;
  fundUsagePlan: string;
  collateralSummary: string;
  financialStatementLink: string;
};

const defaultForm: LpdbForm = {
  institutionName: '',
  legalEntity: 'Koperasi',
  establishedSince: '',
  address: '',
  contactPerson: '',
  phone: '',
  email: '',
  businessFocus: '',
  requestedFund: '',
  fundUsagePlan: '',
  collateralSummary: '',
  financialStatementLink: '',
};

export default function LpdbServiceFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<LpdbForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof LpdbForm>(key: K, value: LpdbForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof LpdbForm> = [
      'institutionName',
      'legalEntity',
      'contactPerson',
      'phone',
      'businessFocus',
      'requestedFund',
      'fundUsagePlan',
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
      Alert.alert('Data belum lengkap', 'Mohon isi data lembaga, kontak, fokus usaha, dan kebutuhan dana.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'lpdb',
        data: form
      });
      Alert.alert(
        'Pengajuan tersimpan',
        'Permohonan dana bergulir LPDB telah tercatat. Tim kami akan menghubungi untuk tahapan evaluasi lanjutan.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi gangguan saat mengirim data.');
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
              <Text style={styles.heroTitle}>Form Pengajuan Dana Bergulir LPDB</Text>
              <Text style={styles.heroSubtitle}>
                Ajukan dukungan permodalan untuk koperasi atau UMKM siap ekspansi dengan melengkapi data berikut.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#5B21B633', 'transparent'] : ['#F5F3FF', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Profil Lembaga"
              subtitle="Informasi dasar mengenai badan usaha pengaju dana LPDB."
              icon="layers"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lembaga / Koperasi"
                icon="layers"
                placeholder="Nama lengkap lembaga"
                value={form.institutionName}
                onChangeText={value => handleChange('institutionName', value)}
                colors={colors}
              />
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Bentuk Badan Hukum</Text>
                <View style={styles.pillGroup}>
                  {legalEntityOptions.map(option => {
                    const active = option === form.legalEntity;
                    return (
                      <TouchableOpacity
                        key={option}
                        accessibilityRole="button"
                        onPress={() => handleChange('legalEntity', option)}
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
                label="Berdiri Sejak"
                icon="calendar"
                placeholder="Contoh: 2012"
                value={form.establishedSince}
                onChangeText={value => handleChange('establishedSince', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat Kantor"
                icon="map-pin"
                placeholder="Alamat lengkap operasional"
                value={form.address}
                onChangeText={value => handleChange('address', value)}
                colors={colors}
                multiline
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Kontak Utama"
              subtitle="Penanggung jawab yang dapat dihubungi."
              icon="user"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Penanggung Jawab"
                icon="user"
                placeholder="Nama lengkap PIC"
                value={form.contactPerson}
                onChangeText={value => handleChange('contactPerson', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon"
                icon="phone"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: kontak@lembaga.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Profil Usaha & Kebutuhan Dana"
              subtitle="Gambaran fokus usaha dan rencana penggunaan dana bergulir."
              icon="briefcase"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Fokus Usaha / Bidang Layanan"
                icon="briefcase"
                placeholder="Contoh: Produksi pangan olahan, jasa simpan pinjam"
                value={form.businessFocus}
                onChangeText={value => handleChange('businessFocus', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Nilai Dana Dimohon"
                icon="dollar-sign"
                placeholder="Contoh: Rp 500.000.000"
                value={form.requestedFund}
                onChangeText={value => handleChange('requestedFund', value)}
                colors={colors}
              />
              <LabeledInput
                label="Rencana Penggunaan Dana"
                icon="file-text"
                placeholder="Uraikan alokasi dana: modal kerja, investasi alat, ekspansi pasar, dsb."
                value={form.fundUsagePlan}
                onChangeText={value => handleChange('fundUsagePlan', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Ringkasan Agunan / Jaminan (opsional)"
                icon="shield"
                placeholder="Contoh: Sertifikat tanah, aset bergerak, rekening escrow"
                value={form.collateralSummary}
                onChangeText={value => handleChange('collateralSummary', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Tautan Laporan Keuangan (opsional)"
                icon="link"
                placeholder="Contoh: https://drive.google.com/xxxx"
                value={form.financialStatementLink}
                onChangeText={value => handleChange('financialStatementLink', value)}
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
                colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Kirim Pengajuan LPDB'}</Text>
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
    backgroundColor: 'rgba(30, 16, 54, 0.25)',
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
    color: 'rgba(242, 236, 255, 0.88)',
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


