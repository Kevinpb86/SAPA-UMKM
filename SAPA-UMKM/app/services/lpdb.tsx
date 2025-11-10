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

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      Alert.alert(
        'Pengajuan tersimpan',
        'Permohonan dana bergulir LPDB telah tercatat. Tim kami akan menghubungi untuk tahapan evaluasi lanjutan.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi gangguan saat mengirim data. Silakan coba kembali.');
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
            <Text style={styles.heroTitle}>Form Pengajuan Dana Bergulir LPDB</Text>
            <Text style={styles.heroSubtitle}>
              Ajukan dukungan permodalan untuk koperasi atau UMKM siap ekspansi dengan melengkapi data berikut.
            </Text>
          </LinearGradient>

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
                placeholder="Nama lengkap lembaga"
                value={form.institutionName}
                onChangeText={value => handleChange('institutionName', value)}
                colors={colors}
              />
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.subtle }]}>Bentuk Badan Hukum</Text>
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
                label="Berdiri Sejak"
                placeholder="Contoh: 2012"
                value={form.establishedSince}
                onChangeText={value => handleChange('establishedSince', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat Kantor"
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
                placeholder="Nama lengkap PIC"
                value={form.contactPerson}
                onChangeText={value => handleChange('contactPerson', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
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
                placeholder="Contoh: Produksi pangan olahan, jasa simpan pinjam"
                value={form.businessFocus}
                onChangeText={value => handleChange('businessFocus', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Nilai Dana Dimohon"
                placeholder="Contoh: Rp 500.000.000"
                value={form.requestedFund}
                onChangeText={value => handleChange('requestedFund', value)}
                colors={colors}
              />
              <LabeledInput
                label="Rencana Penggunaan Dana"
                placeholder="Uraikan alokasi dana: modal kerja, investasi alat, ekspansi pasar, dsb."
                value={form.fundUsagePlan}
                onChangeText={value => handleChange('fundUsagePlan', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Ringkasan Agunan / Jaminan (opsional)"
                placeholder="Contoh: Sertifikat tanah, aset bergerak, rekening escrow"
                value={form.collateralSummary}
                onChangeText={value => handleChange('collateralSummary', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Tautan Laporan Keuangan (opsional)"
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
              style={[
                styles.submitButton,
                { backgroundColor: colors.accent, opacity: submitting ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Kirim Pengajuan LPDB'}</Text>
              <Feather name="send" size={16} color="#FFFFFF" />
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
    backgroundColor: 'rgba(30, 16, 54, 0.28)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(242, 236, 255, 0.88)',
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
    gap: 12,
    alignItems: 'center',
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
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


