import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
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
              <Text style={styles.heroKicker}>Pembaruan Data Profil UMKM</Text>
              <Text style={styles.heroTitle}>Pastikan Profil Usaha Selalu Terkini</Text>
              <Text style={styles.heroSubtitle}>
                Informasi profil yang akurat memudahkan proses verifikasi dan memprioritaskan dukungan program sesuai
                kebutuhan UMKM Anda.
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={scheme === 'dark' ? ['#10B98133', 'transparent'] : ['#F6FFF9', 'transparent']}
              style={styles.meshGradient}
            />
          </View>

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
                icon="briefcase"
                placeholder="Nama brand atau badan usaha"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Pemilik/Penanggung Jawab"
                icon="user"
                placeholder="Nama lengkap"
                value={form.ownerName}
                onChangeText={value => handleChange('ownerName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Sektor Usaha"
                icon="grid"
                placeholder="Contoh: Kuliner, Perdagangan, Jasa"
                value={form.sector}
                onChangeText={value => handleChange('sector', value)}
                colors={colors}
              />
              <LabeledInput
                label="Kode KBLI (opsional)"
                icon="hash"
                placeholder="Contoh: 56101 - Rumah makan/restoran"
                value={form.kbli}
                onChangeText={value => handleChange('kbli', value)}
                colors={colors}
              />
              <LabeledInput
                label="Jumlah Tenaga Kerja"
                icon="users"
                placeholder="Contoh: 12 orang"
                value={form.employees}
                onChangeText={value => handleChange('employees', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat Usaha"
                icon="map-pin"
                placeholder="Jalan, kelurahan, kecamatan"
                value={form.address}
                onChangeText={value => handleChange('address', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kabupaten/Kota"
                icon="map"
                placeholder="Contoh: Kota Malang"
                value={form.city}
                onChangeText={value => handleChange('city', value)}
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
                label="Email (opsional)"
                icon="mail"
                placeholder={accountEmail || 'contoh: kontak@umkm.id'}
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Deskripsi Usaha"
                icon="align-left"
                placeholder="Ringkasan produk/jasa, segmentasi pelanggan, dll."
                value={form.description}
                onChangeText={value => handleChange('description', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Kebutuhan Dukungan (opsional)"
                icon="help-circle"
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
              style={styles.submitWrapper}
            >
              <LinearGradient
                colors={submitting ? [`${colors.accent}80`, `${colors.accent}60`] : [`${colors.accent}`, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>{submitting ? 'Menyimpan...' : 'Perbarui Profil UMKM'}</Text>
                <Feather name={submitting ? 'loader' : 'save'} size={18} color="#FFFFFF" />
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? 120 : 50,
            },
            multiline && { paddingTop: 0, paddingBottom: 12 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </View>
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
    backgroundColor: 'rgba(6, 78, 59, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(204, 251, 241, 0.9)',
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
    color: 'rgba(209, 250, 229, 0.88)',
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
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
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


