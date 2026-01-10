import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
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
    background: '#FFF7ED',
    hero: ['#F97316', '#EA580C'],
    card: '#FFFFFF',
    border: '#FDEAD7',
    text: '#064E3B',
    subtle: '#3F7662',
    accent: '#F97316',
  },
  dark: {
    background: '#1C0A05',
    hero: ['#EA580C', '#F97316'],
    card: '#2C1508',
    border: '#3F1F0D',
    text: '#ECFDF5',
    subtle: '#FED7AA',
    accent: '#FB923C',
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

  // Animations
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesh rotation
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade-in entry
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 20,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const meshRotate = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

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
          <Animated.View
            style={[
              styles.heroContainer,
              {
                opacity: entryAnim,
                transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
              }
            ]}
          >
            <LinearGradient
              colors={colors.hero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
                <View style={[styles.meshCircle, { top: -80, right: -40, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
                <View style={[styles.meshCircle, { bottom: -120, left: -60, width: 320, height: 320, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              </Animated.View>

              <Animated.View style={[styles.floatingIcon, { top: '20%', right: '10%', transform: [{ translateY: floatY }] }]}>
                <Feather name="user" size={90} color="#FFFFFF" style={{ opacity: 0.1 }} />
              </Animated.View>

              <View style={styles.heroContent}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <Feather name="arrow-left" size={18} color="#FFFFFF" />
                  <Text style={styles.backText}>Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.heroKicker}>PENGATURAN PROFIL</Text>
                <Text style={styles.heroTitle}>Identitas Usaha</Text>
                <Text style={styles.heroSubtitle}>
                  Lengkapi data usaha Anda untuk memudahkan verifikasi program bantuan dan sinkronisasi dengan layanan pemerintah.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="briefcase" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Informasi Bisnis</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Usaha"
                icon="home"
                placeholder="cth: Coffee Baroka"
                value={form.businessName}
                onChangeText={v => setForm(f => ({ ...f, businessName: v }))}
                colors={colors}
              />
              <LabeledInput
                label="Nama Pemilik"
                icon="user"
                placeholder="cth: Ahmad Fauzi"
                value={form.ownerName}
                onChangeText={v => setForm(f => ({ ...f, ownerName: v }))}
                colors={colors}
              />
              <View style={styles.row}>
                <View style={styles.flexOne}>
                  <LabeledInput
                    label="Sektor Usaha"
                    icon="grid"
                    placeholder="cth: Kuliner"
                    value={form.sector}
                    onChangeText={v => setForm(f => ({ ...f, sector: v }))}
                    colors={colors}
                  />
                </View>
                <View style={styles.flexOne}>
                  <LabeledInput
                    label="Kode KBLI"
                    icon="hash"
                    placeholder="cth: 56101"
                    keyboardType="number-pad"
                    value={form.kbli}
                    onChangeText={v => setForm(f => ({ ...f, kbli: v }))}
                    colors={colors}
                  />
                </View>
              </View>
              <LabeledInput
                label="Jumlah Karyawan"
                icon="users"
                placeholder="cth: 5"
                keyboardType="number-pad"
                value={form.employees}
                onChangeText={v => setForm(f => ({ ...f, employees: v }))}
                colors={colors}
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="map-pin" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Kontak & Alamat</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Alamat Lengkap"
                icon="map"
                placeholder="cth: Jl. Merdeka No. 12"
                multiline
                value={form.address}
                onChangeText={v => setForm(f => ({ ...f, address: v }))}
                colors={colors}
              />
              <LabeledInput
                label="Kota / Kabupaten"
                icon="navigation"
                placeholder="cth: Surabaya"
                value={form.city}
                onChangeText={v => setForm(f => ({ ...f, city: v }))}
                colors={colors}
              />
              <View style={styles.row}>
                <View style={styles.flexOne}>
                  <LabeledInput
                    label="WhatsApp"
                    icon="phone"
                    placeholder="0812..."
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={v => setForm(f => ({ ...f, phone: v }))}
                    colors={colors}
                  />
                </View>
                <View style={styles.flexOne}>
                  <LabeledInput
                    label="Email Kontak"
                    icon="mail"
                    placeholder="email@bisnis.com"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={v => setForm(f => ({ ...f, email: v }))}
                    colors={colors}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="file-text" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Deskripsi Usaha</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Tentang Bisnis Anda"
                icon="info"
                placeholder="Ceritakan sejarah singkat atau spesialisasi usaha Anda"
                multiline
                value={form.description}
                onChangeText={v => setForm(f => ({ ...f, description: v }))}
                colors={colors}
              />
              <LabeledInput
                label="Harapan & Kebutuhan"
                icon="target"
                placeholder="Apa target Anda 1 tahun kedepan?"
                multiline
                value={form.supportNeeds}
                onChangeText={v => setForm(f => ({ ...f, supportNeeds: v }))}
                colors={colors}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                    borderColor: colors.border,
                    borderWidth: 1,
                  }
                ]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
                style={styles.modalSubmitWrapper}
              >
                <LinearGradient
                  colors={submitting ? [`${colors.accent}CC`, `${colors.accent}CC`] : [`${colors.accent}`, `${colors.accent}EE`]}
                  style={styles.modalSubmitBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Simpan Perubahan'}</Text>
                  <Feather name={submitting ? 'loader' : 'check'} size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  const scheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', colors.accent],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', `${colors.accent}04`],
  });

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle, opacity: isFocused ? 1 : 0.8 }]}>{label}</Text>
      <Animated.View style={[
        styles.inputInner,
        {
          backgroundColor,
          borderColor,
          transform: [{ scale: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) }],
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }),
          shadowRadius: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
          elevation: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }),
        }
      ]}>
        <View style={[styles.inputIcon, { top: multiline ? 16 : 14 }]}>
          <Feather name={icon} size={18} color={isFocused ? colors.accent : colors.subtle} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}80`}
          multiline={multiline}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? 96 : 48,
              paddingLeft: 48,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </Animated.View>
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
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  heroContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  hero: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  meshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  meshCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 0,
  },
  heroContent: {
    gap: 8,
    zIndex: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    borderRadius: 32,
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
  fieldGroup: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  inputWrapper: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubmitWrapper: {
    flex: 2,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
