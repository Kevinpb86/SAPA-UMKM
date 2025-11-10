import { useEffect, useMemo, useState } from 'react';
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

import { useAuth } from '@/hooks/use-auth';

const palette = {
  light: {
    background: '#F6FFF9',
    hero: ['#10B981', '#059669'],
    card: '#FFFFFF',
    border: '#C9F2E1',
    text: '#064E3B',
    subtle: '#3F7662',
    accent: '#0EA47A',
  },
  dark: {
    background: '#05261D',
    hero: ['#047857', '#10B981'],
    card: '#0D2F25',
    border: '#184C3B',
    text: '#ECFDF5',
    subtle: '#A7F3D0',
    accent: '#34D399',
  },
};

type ProfileForm = {
  businessName: string;
  ownerName: string;
  sector: string;
  kbli: string;
  employees: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  supportNeeds: string;
};

const defaultForm: ProfileForm = {
  businessName: '',
  ownerName: '',
  sector: '',
  kbli: '',
  employees: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  description: '',
  supportNeeds: '',
};

export default function ProfileUpdateScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user, loading, updateUserAccount } = useAuth();

  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const accountEmail = useMemo(() => user?.email ?? '', [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      const profile = user.profile ?? {};
      setForm({
        businessName: profile.businessName ?? '',
        ownerName: profile.ownerName ?? '',
        sector: profile.sector ?? '',
        kbli: profile.kbli ?? '',
        employees: profile.employees ?? '',
        address: profile.businessAddress ?? profile.ownerAddress ?? '',
        city: profile.city ?? '',
        phone: profile.phone ?? '',
        email: profile.contactEmail ?? user.email ?? '',
        description: profile.businessDescription ?? '',
        supportNeeds: profile.supportNeeds ?? '',
      });
    }
  }, [user]);

  const handleChange = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const requiredFields: Array<keyof ProfileForm> = ['businessName', 'ownerName', 'sector', 'address', 'city', 'phone'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Tidak ada akun', 'Silakan masuk sebelum memperbarui profil.');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Lengkapi nama usaha, pemilik, sektor, alamat, kota, dan kontak.');
      return;
    }

    setSubmitting(true);
    try {
      await updateUserAccount({
        id: user.id,
        email: accountEmail,
        displayName: form.businessName || form.ownerName || user.displayName || accountEmail,
        profile: {
          ...user.profile,
          businessName: form.businessName.trim(),
          ownerName: form.ownerName.trim(),
          sector: form.sector.trim(),
          kbli: form.kbli.trim(),
          employees: form.employees.trim(),
          businessAddress: form.address.trim(),
          city: form.city.trim(),
          phone: form.phone.trim(),
          contactEmail: form.email.trim(),
          businessDescription: form.description.trim(),
          supportNeeds: form.supportNeeds.trim(),
        },
      });

      Alert.alert('Profil diperbarui', 'Data profil UMKM Anda telah disimpan dan siap diverifikasi.');
    } catch (error) {
      Alert.alert('Gagal menyimpan', 'Terjadi kendala saat memperbarui profil. Coba ulang beberapa saat lagi.');
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
            <Text style={styles.heroKicker}>Pembaruan Data Profil UMKM</Text>
            <Text style={styles.heroTitle}>Pastikan Profil Usaha Selalu Terkini</Text>
            <Text style={styles.heroSubtitle}>
              Informasi profil yang akurat memudahkan proses verifikasi dan memprioritaskan dukungan program sesuai
              kebutuhan UMKM Anda.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="info" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Mengapa Perlu Memperbarui Profil?</Text>
            </View>
            <View style={styles.sectionBody}>
              <InfoRow
                colors={colors}
                icon="check-circle"
                text="Dapatkan rekomendasi program dan pendanaan yang paling relevan."
              />
              <InfoRow
                colors={colors}
                icon="map-pin"
                text="Pastikan alamat dan wilayah layanan Anda tercatat untuk pemetaan pasar."
              />
              <InfoRow
                colors={colors}
                icon="users"
                text="Laporkan jumlah tenaga kerja terbaru sebagai dasar evaluasi pertumbuhan UMKM."
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Pembaruan Profil</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama brand atau badan usaha"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Pemilik/Penanggung Jawab"
                placeholder="Nama lengkap"
                value={form.ownerName}
                onChangeText={value => handleChange('ownerName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Sektor Usaha"
                placeholder="Contoh: Kuliner, Perdagangan, Jasa"
                value={form.sector}
                onChangeText={value => handleChange('sector', value)}
                colors={colors}
              />
              <LabeledInput
                label="Kode KBLI (opsional)"
                placeholder="Contoh: 56101 - Rumah makan/restoran"
                value={form.kbli}
                onChangeText={value => handleChange('kbli', value)}
                colors={colors}
              />
              <LabeledInput
                label="Jumlah Tenaga Kerja"
                placeholder="Contoh: 12 orang"
                value={form.employees}
                onChangeText={value => handleChange('employees', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat Usaha"
                placeholder="Jalan, kelurahan, kecamatan"
                value={form.address}
                onChangeText={value => handleChange('address', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kabupaten/Kota"
                placeholder="Contoh: Kota Malang"
                value={form.city}
                onChangeText={value => handleChange('city', value)}
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
                label="Email (opsional)"
                placeholder={accountEmail || 'contoh: kontak@umkm.id'}
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Deskripsi Usaha"
                placeholder="Ringkasan produk/jasa, segmentasi pelanggan, dll."
                value={form.description}
                onChangeText={value => handleChange('description', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kebutuhan Dukungan (opsional)"
                placeholder="Pelatihan digital marketing, akses bahan baku, kemitraan, dsb."
                value={form.supportNeeds}
                onChangeText={value => handleChange('supportNeeds', value)}
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
              <Text style={styles.submitText}>{submitting ? 'Menyimpan...' : 'Perbarui Profil'}</Text>
              <Feather name="save" size={16} color="#FFFFFF" />
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
    backgroundColor: 'rgba(6, 78, 59, 0.22)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(204, 251, 241, 0.9)',
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
    color: 'rgba(209, 250, 229, 0.88)',
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


