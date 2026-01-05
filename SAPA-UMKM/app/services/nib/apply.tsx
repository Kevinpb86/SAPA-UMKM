import { useAuth } from '@/hooks/use-auth';
import { createSubmission } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const palette = {
  light: {
    background: '#F5F8FF',
    card: '#FFFFFF',
    border: '#D8E3FF',
    text: '#0F1B3A',
    subtle: '#5E6B8D',
    accent: '#1D4ED8',
  },
  dark: {
    background: '#0B1224',
    card: '#111C32',
    border: '#1E2A4A',
    text: '#F8FAFC',
    subtle: '#A5B4CF',
    accent: '#60A5FA',
  },
};

const businessSectors = ['Perdagangan Umum', 'Kuliner dan Makanan', 'Jasa Kreatif', 'Manufaktur', 'Pertanian & Perkebunan'];
const capitalScales = ['Mikro (< Rp 1 Miliar)', 'Kecil (Rp 1-5 Miliar)', 'Menengah (Rp 5-10 Miliar)', 'Besar (> Rp 10 Miliar)'];

export default function NibApplyScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [owner, setOwner] = useState({
    nik: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [business, setBusiness] = useState({
    name: '',
    form: '',
    address: '',
    sector: '',
    capital: '',
  });

  const handleSubmit = async () => {
    if (!owner.nik || !owner.fullName || !owner.email || !business.name || !business.sector) {
      Alert.alert('Data belum lengkap', 'Mohon lengkapi minimal data pemilik dan data usaha utama.');
      return;
    }

    if (!user?.token) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    Animated.timing(buttonScale, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();

    try {
      await createSubmission(user.token, {
        type: 'nib',
        data: {
          owner,
          business
        }
      });
      Alert.alert('Sukses', 'Pengajuan NIB berhasil dikirim. Silakan cek status di dashboard Anda.', [
        { text: 'OK', onPress: () => router.replace('/user/dashboard') }
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Gagal mengirim pengajuan.');
    } finally {
      setIsSubmitting(false);
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  // Ultra-Premium Animations logic
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Background mesh loop
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ).start();

    // Secondary floating loop
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

    // Entry animation for badges
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Animated Mesh Background Section */}
            <View style={styles.meshContainer}>

              {/* Decorative Floating Symbols */}
              <Animated.View style={[styles.floatingDeco, { top: '20%', right: '10%', transform: [{ translateY: floatY }] }]}>
                <Feather name="globe" size={80} color={colors.accent} style={{ opacity: 0.03 }} />
              </Animated.View>
              <Animated.View style={[styles.floatingDeco, { bottom: '30%', left: '5%', transform: [{ translateY: Animated.multiply(floatY, -0.8) }] }]}>
                <Feather name="award" size={100} color={colors.accent} style={{ opacity: 0.02 }} />
              </Animated.View>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={[styles.backButton, { backgroundColor: `${colors.accent}12` }]}>
              <Feather name="arrow-left" size={18} color={colors.accent} />
              <Text style={[styles.backText, { color: colors.accent }]}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={[styles.headerIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="award" size={32} color={colors.accent} />
                <Animated.View style={[styles.shieldPulse, { backgroundColor: colors.accent, opacity: meshAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.3, 0.1] }) }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>Sertifikasi NIB</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Dapatkan legalitas usaha Anda dalam hitungan menit. Proses digital resmi & terintegrasi OSS.
                </Text>
              </View>
            </View>

            {/* Trust Badges Row */}
            <Animated.View style={[styles.trustRow, { opacity: entryAnim, transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
              <View style={styles.trustBadge}>
                <Feather name="check-circle" size={12} color="#10B981" />
                <Text style={[styles.trustText, { color: colors.subtle }]}>Verifikasi OSS</Text>
              </View>
              <View style={styles.trustBadge}>
                <Feather name="unlock" size={12} color="#6366F1" />
                <Text style={[styles.trustText, { color: colors.subtle }]}>Enkripsi Data</Text>
              </View>
              <View style={styles.trustBadge}>
                <Feather name="award" size={12} color="#F59E0B" />
                <Text style={[styles.trustText, { color: colors.subtle }]}>Layanan Resmi</Text>
              </View>
            </Animated.View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="user" size={20} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik Usaha</Text>
              </View>
              <View style={styles.fieldGroup}>
                <LabeledInput
                  label="NIK (Nomor Induk Kependudukan)"
                  icon="credit-card"
                  value={owner.nik}
                  onChangeText={value => setOwner(prev => ({ ...prev, nik: value }))}
                  placeholder="Masukkan 16 digit NIK"
                  keyboardType="number-pad"
                  colors={colors}
                />
                <LabeledInput
                  label="Nama Lengkap"
                  icon="user"
                  value={owner.fullName}
                  onChangeText={value => setOwner(prev => ({ ...prev, fullName: value }))}
                  placeholder="Sesuai KTP"
                  colors={colors}
                />
                <LabeledInput
                  label="Email Aktif"
                  icon="mail"
                  value={owner.email}
                  onChangeText={value => setOwner(prev => ({ ...prev, email: value }))}
                  placeholder="contoh: pelaku@umkm.id"
                  keyboardType="email-address"
                  colors={colors}
                />
                <LabeledInput
                  label="Nomor Telepon"
                  icon="phone"
                  value={owner.phone}
                  onChangeText={value => setOwner(prev => ({ ...prev, phone: value }))}
                  placeholder="08xxxxxxxxxx"
                  keyboardType="phone-pad"
                  colors={colors}
                />
                <LabeledInput
                  label="Alamat Domisili"
                  icon="map-pin"
                  value={owner.address}
                  onChangeText={value => setOwner(prev => ({ ...prev, address: value }))}
                  placeholder="Alamat domisili sesuai KTP"
                  multiline
                  colors={colors}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="briefcase" size={20} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usaha</Text>
              </View>
              <View style={styles.fieldGroup}>
                <LabeledInput
                  label="Nama Usaha"
                  icon="shopping-bag"
                  value={business.name}
                  onChangeText={value => setBusiness(prev => ({ ...prev, name: value }))}
                  placeholder="Nama brand atau toko"
                  colors={colors}
                />
                <LabeledInput
                  label="Bentuk Usaha"
                  icon="grid"
                  value={business.form}
                  onChangeText={value => setBusiness(prev => ({ ...prev, form: value }))}
                  placeholder="PT/CV/Firma/Koperasi/Perorangan"
                  colors={colors}
                />
                <LabeledInput
                  label="Alamat Operasional"
                  icon="map"
                  value={business.address}
                  onChangeText={value => setBusiness(prev => ({ ...prev, address: value }))}
                  placeholder="Alamat lokasi usaha"
                  multiline
                  colors={colors}
                />
                <SelectField
                  label="Sektor Usaha"
                  icon="layers"
                  value={business.sector}
                  placeholder="Pilih sektor usaha"
                  options={businessSectors}
                  onSelect={value => setBusiness(prev => ({ ...prev, sector: value }))}
                  colors={colors}
                />
                <SelectField
                  label="Skala Modal"
                  icon="trending-up"
                  value={business.capital}
                  placeholder="Pilih skala modal"
                  options={capitalScales}
                  onSelect={value => setBusiness(prev => ({ ...prev, capital: value }))}
                  colors={colors}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={[styles.secondaryButton, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
                style={styles.modalSubmitWrapper}
              >
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <LinearGradient
                    colors={isSubmitting ? [`${colors.accent}CC`, `${colors.accent}CC`] : [`${colors.accent}`, `${colors.accent}EE`]}
                    style={styles.modalSubmitBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitText}>{isSubmitting ? 'Memproses...' : 'Kirim Permohonan'}</Text>
                    {isSubmitting ? (
                      <Animated.View style={{ transform: [{ rotate: meshRotate }] }}>
                        <Feather name="loader" size={18} color="#FFFFFF" />
                      </Animated.View>
                    ) : (
                      <Feather name="send" size={18} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </Animated.View>
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
  icon: keyof typeof Feather.glyphMap;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({ label, icon, value, placeholder, onChangeText, colors, multiline, keyboardType = 'default' }: LabeledInputProps) {
  const scheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // Color and borderWidth don't support native driver in all versions
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
      <Text style={[styles.inputLabel, { color: colors.text, opacity: isFocused ? 1 : 0.8 }]}>{label}</Text>
      <Animated.View style={[
        styles.inputInner,
        {
          backgroundColor,
          borderColor,
          alignItems: multiline ? 'flex-start' : 'center',
          paddingTop: multiline ? 12 : 0,
          transform: [{ scale: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) }],
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.25] }),
          shadowRadius: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
          elevation: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }),
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
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: colors.text, minHeight: multiline ? 96 : 48 },
            multiline && { paddingTop: 0, paddingBottom: 12 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </Animated.View>
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  colors: typeof palette.light;
};

function SelectField({ label, icon, value, placeholder, options, onSelect, colors }: SelectFieldProps) {
  const scheme = useColorScheme();
  const [open, setOpen] = useState(false);
  const openAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(openAnim, {
      toValue: open ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [open]);

  const borderColor = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', colors.accent],
  });

  const backgroundColor = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', `${colors.accent}04`],
  });

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.text, opacity: open ? 1 : 0.8 }]}>{label}</Text>
      <AnimatedTouchable
        accessibilityRole="button"
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        style={[
          styles.selectButton,
          {
            backgroundColor,
            borderColor,
            transform: [{ scale: openAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) }],
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: openAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.25] }),
            shadowRadius: openAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
            elevation: openAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }),
          }
        ]}
      >
        <View style={styles.selectBtnLeft}>
          <Feather name={icon} size={18} color={value ? colors.accent : colors.subtle} />
          <Text style={{ color: value ? colors.text : `${colors.subtle}60`, marginLeft: 12, fontSize: 15, fontWeight: '400' }}>
            {value || placeholder}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: openAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <Feather name="chevron-down" size={18} color={colors.subtle} />
        </Animated.View>
      </AnimatedTouchable>
      {open && (
        <Animated.View style={[
          styles.optionList,
          {
            backgroundColor: colors.card,
            opacity: openAnim,
            transform: [{ translateY: openAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }]
          }
        ]}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              accessibilityRole="button"
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
              style={[styles.optionItem, { borderBottomColor: `${colors.subtle}10` }]}
            >
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '400' }}>{option}</Text>
              {value === option && <Feather name="check" size={16} color={colors.accent} />}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
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
    paddingBottom: 40,
  },
  card: {
    borderRadius: 32,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: 200,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    gap: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  meshCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  floatingDeco: {
    position: 'absolute',
    zIndex: -1,
  },
  shieldPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: -1,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    marginTop: -8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.8,
  },
  section: {
    gap: 20,
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
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
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  selectButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionList: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
    fontWeight: '600',
  },
  modalSubmitWrapper: {
    flex: 2.2,
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
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
