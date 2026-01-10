import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';

const palette = {
  light: {
    background: '#F5F7FB',
    card: '#FFFFFF',
    text: '#0F172A',
    subtle: '#64748B',
    primary: '#2563EB',
    border: '#E2E8F0',
    input: '#FFFFFF',
    accent: '#3B82F6',
    focus: '#2563EB',
    success: '#10B981',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    primary: '#3B82F6',
    border: '#334155',
    input: '#0F172A',
    accent: '#60A5FA',
    focus: '#3B82F6',
    success: '#34D399',
  },
};

const sectorOptions = [
  'Makanan & Minuman',
  'Kerajinan & Kreatif',
  'Jasa & Layanan',
  'Perdagangan Umum',
  'Pertanian & Kelautan',
];

const scaleOptions = ['Mikro', 'Kecil', 'Menengah'];

const kbliOptions = [
  '10792 - Perdagangan kebutuhan pokok',
  '56101 - Rumah makan/restoran',
  '56301 - Kedai kopi/kafe',
  '14111 - Industri pakaian jadi',
  '47213 - Perdagangan eceran makanan minuman',
  '46206 - Perdagangan besar hasil pertanian',
  '46411 - Perdagangan besar tekstil',
  '47111 - Supermarket/minimarket',
  '62010 - Aktivitas pemrograman komputer',
  '85500 - Pendidikan dan pelatihan',
  '96022 - Layanan salon dan kecantikan',
];

type RegisterForm = {
  nik: string;
  ownerName: string;
  email: string;
  password: string;
  npwp: string;
  ownerAddress: string;
  businessName: string;
  businessAddress: string;
  kbli: string;
  sector: string;
  scale: string;
  capital: string;
};

type FormInputProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
  onIconPress?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  accentColor?: string; // NEW: Color for icon and background tint
};

function FormInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  required,
  keyboardType = 'default',
  secureTextEntry,
  multiline,
  onIconPress,
  rightIcon,
  autoCapitalize,
  accentColor, // NEW
}: FormInputProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const [isFocused, setIsFocused] = useState(false);

  // Premium animations
  const focusAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Use accent color or fallback to default
  const effectiveAccentColor = accentColor || colors.primary;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.spring(focusAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${effectiveAccentColor}30`, effectiveAccentColor],
  });

  const animatedShadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.02, 0.12],
  });

  return (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isFocused ? `${effectiveAccentColor}12` : `${effectiveAccentColor}08`,
            minHeight: multiline ? 100 : 54,
            alignItems: multiline ? 'flex-start' : 'center',
            paddingTop: multiline ? 12 : 0,
            transform: [{ scale: scaleAnim }],
            shadowColor: effectiveAccentColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: animatedShadowOpacity,
            shadowRadius: 20,
            elevation: isFocused ? 8 : 3,
            borderWidth: 2.5,
            borderColor: isFocused ? effectiveAccentColor : '#FFFFFF',
          },
        ]}>
        <Feather
          name={icon}
          size={18}
          color={isFocused ? effectiveAccentColor : `${effectiveAccentColor}90`}
          style={[styles.inputIcon, multiline && { marginTop: 4 }]}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}80`}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { color: colors.text },
            multiline && { textAlignVertical: 'top', paddingTop: 0 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
          ]}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onIconPress} style={styles.passwordToggle}>
            <Feather name={rightIcon} size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function SelectField({ label, icon, placeholder, options, value, onChange, required }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;

  return (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={[styles.selectButton, { borderColor: colors.border, backgroundColor: colors.input }]}>
        <View style={styles.selectContent}>
          <Feather name={icon} size={18} color={colors.subtle} style={styles.inputIcon} />
          <Text style={value ? [styles.selectValue, { color: colors.text }] : [styles.placeholder, { color: `${colors.subtle}80` }]}>
            {value || placeholder}
          </Text>
        </View>
        <Feather name="chevron-down" size={18} color={colors.subtle} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{label}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => setVisible(false)}>
                <Feather name="x" size={20} color={colors.subtle} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option);
                    setVisible(false);
                  }}
                  style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>{option}</Text>
                  {value === option && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    nik: '',
    ownerName: '',
    email: '',
    password: '',
    npwp: '',
    ownerAddress: '',
    businessName: '',
    businessAddress: '',
    kbli: '',
    sector: '',
    scale: '',
    capital: '',
  })
  const [ktpImage, setKtpImage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Premium entrance animations
  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const heroSlideAnim = useRef(new Animated.Value(30)).current;
  const section1FadeAnim = useRef(new Animated.Value(0)).current;
  const section1SlideAnim = useRef(new Animated.Value(30)).current;
  const section2FadeAnim = useRef(new Animated.Value(0)).current;
  const section2SlideAnim = useRef(new Animated.Value(30)).current;
  const submitButtonScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.stagger(120, [
      // Hero animation
      Animated.parallel([
        Animated.timing(heroFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(heroSlideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Section 1 animation
      Animated.parallel([
        Animated.timing(section1FadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(section1SlideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Section 2 animation
      Animated.parallel([
        Animated.timing(section2FadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(section2SlideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Submit button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(submitButtonScaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(submitButtonScaleAnim, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };


  const handleSubmit = async () => {
    if (!form.email) {
      Alert.alert('Data belum lengkap', 'Mohon isi email aktif untuk akun SAPA UMKM.');
      return;
    }
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(form.email)) {
      Alert.alert('Email tidak valid', 'Pastikan email ditulis dengan format yang benar.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      Alert.alert('Data belum lengkap', 'Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      await registerUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ownerName: form.ownerName,
        nik: form.nik,
        businessName: form.businessName,
        profile: {
          ownerAddress: form.ownerAddress,
          businessAddress: form.businessAddress,
          kbli: form.kbli,
          sector: form.sector,
          scale: form.scale,
          capital: form.capital,
          npwp: form.npwp,
        },
      });

      Alert.alert(
        'Registrasi berhasil',
        'Silakan masuk menggunakan email dan kata sandi Anda.'
      );

      router.replace('/login');
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_RESERVED_FOR_ADMIN') {
        Alert.alert('Registrasi gagal', 'Email ini khusus untuk akun admin. Mohon gunakan email lain.');
        return;
      }
      Alert.alert('Registrasi gagal', 'Terjadi kesalahan saat menyimpan data. Coba lagi.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Ultra-Premium Animated Hero Section */}
          <Animated.View
            style={{
              opacity: heroFadeAnim,
              transform: [{ translateY: heroSlideAnim }],
            }}
          >
            <LinearGradient
              colors={['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              {/* Multiple Decorative Blobs with Different Sizes */}
              <View style={{
                position: 'absolute',
                top: -80,
                right: -60,
                width: 280,
                height: 280,
                borderRadius: 140,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }} />
              <View style={{
                position: 'absolute',
                top: 40,
                right: 20,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              }} />
              <View style={{
                position: 'absolute',
                bottom: -40,
                left: -30,
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }} />
              <View style={{
                position: 'absolute',
                bottom: 60,
                right: 40,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }} />

              {/* Glassmorphic Back Button */}
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.4)',
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <Feather name="arrow-left" size={18} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 15, letterSpacing: -0.2 }}>Kembali</Text>
              </TouchableOpacity>

              {/* Premium Header Content */}
              <View style={{ gap: 16, marginTop: 8 }}>
                {/* Glassmorphic Badge */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: 'rgba(255,255,255,0.20)',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="shield" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                  }}>Portal Registrasi UMKM</Text>
                </View>

                {/* Title with Text Shadow */}
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 32,
                  letterSpacing: -0.8,
                  lineHeight: 38,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 8,
                }}>Registrasi Pelaku UMKM</Text>

                {/* Subtitle */}
                <Text style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: 15,
                  lineHeight: 23,
                  letterSpacing: -0.1,
                }}>
                  Lengkapi data pemilik, identitas usaha, dan dokumen pendukung untuk mengakses layanan SAPA UMKM secara terpadu.
                </Text>
              </View>

              {/* Ultra-Premium Glassmorphic Chips */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                {/* Chip 1 */}
                <View style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.35)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 5,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="user-check" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    letterSpacing: -0.2,
                  }}>NIK & NPWP pemilik</Text>
                </View>

                {/* Chip 2 */}
                <View style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.35)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 5,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="briefcase" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    letterSpacing: -0.2,
                  }}>Detail usaha & KBLI</Text>
                </View>

                {/* Chip 3 */}
                <View style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.35)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 5,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="file-text" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    letterSpacing: -0.2,
                  }}>E-KTP & Dokumen</Text>
                </View>

                {/* Chip 4 */}
                <View style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.35)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 5,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="check-circle" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    letterSpacing: -0.2,
                  }}>Verifikasi & Submit</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Animated Section 1: Data Pemilik */}
          <Animated.View
            style={{
              opacity: section1FadeAnim,
              transform: [{ translateY: section1SlideAnim }],
            }}
          >
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}15` }]}
                >
                  <Feather name="user" size={20} color={colors.primary} />
                </View>
                <View style={styles.sectionHeaderCopy}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                    Informasi identitas pribadi sesuai dokumen resmi.
                  </Text>
                </View>
              </View>
              <View style={styles.formGroup}>
                <FormInput
                  label="NIK (Nomor Induk Kependudukan)"
                  icon="credit-card"
                  placeholder="Masukkan 16 digit NIK"
                  value={form.nik}
                  onChangeText={value => handleChange('nik', value)}
                  keyboardType="number-pad"
                  accentColor="#3B82F6"
                  required
                />
                <FormInput
                  label="Nama Lengkap Pemilik"
                  icon="user"
                  placeholder="Sesuai e-KTP"
                  value={form.ownerName}
                  onChangeText={value => handleChange('ownerName', value)}
                  accentColor="#6366F1"
                  required
                />
                <FormInput
                  label="Email Aktif"
                  icon="mail"
                  placeholder="contoh: pelaku@umkm.id"
                  value={form.email}
                  onChangeText={value => handleChange('email', value.trim())}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accentColor="#8B5CF6"
                  required
                />
                <FormInput
                  label="Kata Sandi"
                  icon="lock"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChangeText={value => handleChange('password', value)}
                  secureTextEntry={!passwordVisible}
                  rightIcon={passwordVisible ? 'eye-off' : 'eye'}
                  onIconPress={() => setPasswordVisible(!passwordVisible)}
                  accentColor="#A855F7"
                  required
                />
                <FormInput
                  label="NPWP Pribadi"
                  icon="file-text"
                  placeholder="Nomor Pokok Wajib Pajak"
                  value={form.npwp}
                  onChangeText={value => handleChange('npwp', value)}
                  keyboardType="number-pad"
                  accentColor="#14B8A6"
                  required
                />
                <FormInput
                  label="Alamat Pemilik"
                  icon="map-pin"
                  placeholder="Sesuai domisili pribadi"
                  value={form.ownerAddress}
                  onChangeText={value => handleChange('ownerAddress', value)}
                  multiline
                  accentColor="#06B6D4"
                  required
                />

                {/* KTP Photo Upload */}
                <View style={styles.formField}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Foto e-KTP
                    <Text style={styles.required}> *</Text>
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Izin ditolak', 'Mohon berikan izin akses galeri untuk mengunggah foto KTP.');
                        return;
                      }

                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [16, 10],
                        quality: 0.8,
                      });

                      if (!result.canceled && result.assets[0]) {
                        setKtpImage(result.assets[0].uri);
                      }
                    }}
                    style={[
                      styles.imageUploadButton,
                      {
                        backgroundColor: ktpImage ? `${colors.success}12` : `${colors.primary}08`,
                        borderColor: ktpImage ? colors.success : `${colors.primary}30`,
                      }
                    ]}
                  >
                    {ktpImage ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: ktpImage }} style={styles.imagePreview} />
                        <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                          <Feather name="check-circle" size={32} color="#10B981" />
                          <Text style={styles.imageOverlayText}>Foto KTP Terunggah</Text>
                          <Text style={styles.imageOverlaySubtext}>Ketuk untuk mengubah</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <View style={[styles.uploadIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                          <Feather name="camera" size={28} color={colors.primary} />
                        </View>
                        <Text style={[styles.uploadText, { color: colors.text }]}>Unggah Foto e-KTP</Text>
                        <Text style={[styles.uploadSubtext, { color: colors.subtle }]}>
                          Ketuk untuk memilih dari galeri
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text style={[styles.helperText, { color: colors.subtle }]}>
                    Pastikan foto KTP jelas dan dapat terbaca
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Animated Section 2: Data Usaha */}
          <Animated.View
            style={{
              opacity: section2FadeAnim,
              transform: [{ translateY: section2SlideAnim }],
            }}
          >
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.success}15` }]}
                >
                  <Feather name="briefcase" size={20} color={colors.success} />
                </View>
                <View style={styles.sectionHeaderCopy}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usaha</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
                    Detail usaha yang akan didaftarkan dalam SAPA UMKM.
                  </Text>
                </View>
              </View>
              <View style={styles.formGroup}>
                <FormInput
                  label="Nama Usaha"
                  icon="shopping-bag"
                  placeholder="Nama brand atau toko"
                  value={form.businessName}
                  onChangeText={value => handleChange('businessName', value)}
                  accentColor="#10B981"
                  required
                />
                <FormInput
                  label="Alamat Lokasi Usaha"
                  icon="map"
                  placeholder="Alamat tempat usaha beroperasi"
                  value={form.businessAddress}
                  onChangeText={value => handleChange('businessAddress', value)}
                  multiline
                  accentColor="#F59E0B"
                  required
                />
                <SelectField
                  label="Kode KBLI"
                  icon="hash"
                  placeholder="Pilih kode KBLI"
                  options={kbliOptions}
                  value={form.kbli}
                  onChange={value => handleChange('kbli', value)}
                  required
                />
                <SelectField
                  label="Sektor Usaha"
                  icon="grid"
                  placeholder="Pilih sektor usaha"
                  options={sectorOptions}
                  value={form.sector}
                  onChange={value => handleChange('sector', value)}
                  required
                />
                <SelectField
                  label="Skala Usaha"
                  icon="trending-up"
                  placeholder="Pilih skala usaha"
                  options={scaleOptions}
                  value={form.scale}
                  onChange={value => handleChange('scale', value)}
                  required
                />
                <FormInput
                  label="Estimasi Modal Usaha"
                  icon="dollar-sign"
                  placeholder="Nominal investasi"
                  value={form.capital}
                  onChangeText={value => handleChange('capital', value)}
                  keyboardType="number-pad"
                  accentColor="#EF4444"
                  required
                />
              </View>
            </View>
          </Animated.View>

          {/* Animated Submit Button */}
          <Animated.View style={{ transform: [{ scale: submitButtonScaleAnim }] }}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              style={[styles.submitButton, { backgroundColor: colors.focus, shadowColor: colors.focus }]}>
              <Text style={styles.submitButtonText}>Daftar Sekarang</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            style={styles.footerLink}>
            <Text style={[styles.footerText, { color: colors.subtle }]}>
              Sudah memiliki akun? <Text style={{ color: colors.primary, fontWeight: '700' }}>Masuk di sini</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    gap: 24,
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 32,
    padding: 28,
    gap: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroOverlayOne: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroOverlayTwo: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroBackButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  heroBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroHeader: {
    gap: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  heroChecklist: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroChecklistItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  checkInnerIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroChecklistText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 28,
    gap: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  formGroup: {
    gap: 20,
  },
  formField: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 2,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    height: '100%',
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 4,
  },
  selectButton: {
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectValue: {
    fontSize: 15,
    fontWeight: '400',
  },
  placeholder: {
    fontSize: 15,
    fontWeight: '400',
  },
  uploadField: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  uploadTextSelected: {
    fontWeight: '600',
  },
  optionalNote: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    marginTop: 2,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 30,
    padding: 24,
    maxHeight: '75%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalList: {
    marginBottom: 8,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
    marginRight: 12,
  },
  footerLink: {
    alignItems: 'center',
    marginVertical: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  imageUploadButton: {
    borderRadius: 20,
    borderWidth: 2.5,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageOverlaySubtext: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.9,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubtext: {
    fontSize: 13,
    fontWeight: '400',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    marginLeft: 4,
  },
});
