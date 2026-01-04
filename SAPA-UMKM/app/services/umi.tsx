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
    background: '#F4FAFF',
    hero: ['#0284C7', '#38BDF8'],
    card: '#FFFFFF',
    border: '#CDE9FB',
    text: '#082F49',
    subtle: '#3A6B85',
    accent: '#0284C7',
  },
  dark: {
    background: '#041724',
    hero: ['#0369A1', '#0EA5E9'],
    card: '#082536',
    border: '#0F3B57',
    text: '#F0F9FF',
    subtle: '#94D2F5',
    accent: '#38BDF8',
  },
};

type UmiForm = {
  ownerName: string;
  nik: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  monthlyRevenue: string;
  fundingNeed: string;
  fundUsage: string;
  repaymentPlan: string;
};

const defaultForm: UmiForm = {
  ownerName: '',
  nik: '',
  phone: '',
  email: '',
  businessName: '',
  businessType: '',
  businessAddress: '',
  monthlyRevenue: '',
  fundingNeed: '',
  fundUsage: '',
  repaymentPlan: '',
};

export default function UmiServiceFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<UmiForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof UmiForm>(key: K, value: UmiForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof UmiForm> = [
      'ownerName',
      'nik',
      'phone',
      'businessName',
      'businessType',
      'fundingNeed',
      'fundUsage',
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
      Alert.alert('Data belum lengkap', 'Mohon isi data pemohon, data usaha, dan kebutuhan pendanaan.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'umi',
        data: form
      });
      Alert.alert(
        'Pengajuan tersimpan',
        'Pengajuan Program UMi berhasil direkam. Kami akan menghubungi Anda untuk verifikasi lebih lanjut.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kendala saat mengirim data.');
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
            <Text style={styles.heroTitle}>Form Pendaftaran Program UMi</Text>
            <Text style={styles.heroSubtitle}>
              Program Ultra Mikro untuk tambahan modal usaha harian dengan proses penyaluran cepat.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Data Pemohon"
              subtitle="Identitas pribadi dan kontak pemohon UMi."
              icon="user"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lengkap Pemohon"
                placeholder="Sesuai identitas"
                value={form.ownerName}
                onChangeText={value => handleChange('ownerName', value)}
                colors={colors}
              />
              <LabeledInput
                label="NIK (Nomor Induk Kependudukan)"
                placeholder="16 digit NIK"
                keyboardType="number-pad"
                value={form.nik}
                onChangeText={value => handleChange('nik', value)}
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
                label="Email Aktif (opsional)"
                placeholder="contoh: pelaku@umkm.id"
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
              title="Profil Usaha"
              subtitle="Informasi singkat mengenai usaha Anda."
              icon="briefcase"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama toko atau brand"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Jenis Usaha"
                placeholder="Contoh: Kuliner, jasa laundry, warung kelontong"
                value={form.businessType}
                onChangeText={value => handleChange('businessType', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat / Lokasi Usaha"
                placeholder="Alamat lengkap atau kecamatan"
                value={form.businessAddress}
                onChangeText={value => handleChange('businessAddress', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Omzet Rata-rata per Bulan (opsional)"
                placeholder="Contoh: Rp 8.000.000"
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
              subtitle="Isi kebutuhan dana dan rencana pengembalian."
              icon="trending-up"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Kebutuhan Dana"
                placeholder="Contoh: Rp 10.000.000"
                value={form.fundingNeed}
                onChangeText={value => handleChange('fundingNeed', value)}
                colors={colors}
              />
              <LabeledInput
                label="Rencana Penggunaan Dana"
                placeholder="Contoh: Modal stok bahan baku, promosi daring"
                value={form.fundUsage}
                onChangeText={value => handleChange('fundUsage', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Rencana Pengembalian"
                placeholder="Contoh: Cicilan mingguan dari penjualan harian"
                value={form.repaymentPlan}
                onChangeText={value => handleChange('repaymentPlan', value)}
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
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Kirim Pengajuan UMi'}</Text>
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
    backgroundColor: 'rgba(8, 47, 73, 0.28)',
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
    color: 'rgba(224, 242, 254, 0.9)',
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


