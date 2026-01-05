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

const palette = {
  light: {
    background: '#F3FBF8',
    card: '#FFFFFF',
    border: '#CFF0E7',
    text: '#083B36',
    subtle: '#4A6F6A',
    accent: '#0F766E',
  },
  dark: {
    background: '#082420',
    card: '#102D28',
    border: '#1F433B',
    text: '#F8FAFC',
    subtle: '#A7F3D0',
    accent: '#34D399',
  },
};

type FormState = {
  certificateNumber: string;
  holderName: string;
  productName: string;
  issuedBy: string;
  notes: string;
};

const defaultForm: FormState = {
  certificateNumber: '',
  holderName: '',
  productName: '',
  issuedBy: '',
  notes: '',
};

export default function HalalCertificateFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  // Elite Animation System
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesh loop
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
    outputRange: [0, -20],
  });

  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    if (!form.certificateNumber.trim() || !form.holderName.trim() || !form.productName.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon masukkan nomor sertifikat, nama pemegang, dan nama produk.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'halal',
        data: form
      });
      Alert.alert(
        'Permintaan terkirim',
        'Permintaan cek Sertifikat Halal Anda telah kami terima. Hasil pengecekan akan diinformasikan segera.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim permintaan.');
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
              colors={['#0F766E', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
                <View style={[styles.meshCircle, { top: -80, right: -40, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
                <View style={[styles.meshCircle, { bottom: -120, left: -60, width: 320, height: 320, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
              </Animated.View>

              <Animated.View style={[styles.floatingIcon, { top: '15%', right: '10%', transform: [{ translateY: floatY }] }]}>
                <Feather name="check-circle" size={80} color="#FFFFFF" style={{ opacity: 0.05 }} />
              </Animated.View>

              <View style={styles.heroContent}>
                <Text style={styles.heroKicker}>SERTIFIKASI</Text>
                <Text style={styles.heroTitle}>Cek Sertifikat Halal</Text>
                <Text style={styles.heroSubtitle}>
                  Verifikasi keabsahan, status hukum, dan masa berlaku sertifikasi halal produk Anda secara real-time untuk menjamin kepatuhan terhadap standar syariah yang berlaku.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
              <View style={[styles.headerIcon, { backgroundColor: `${colors.accent}1A` }]}>
                <Feather name="check-circle" size={22} color={colors.accent} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.text }]}>Data Sertifikat</Text>
                <Text style={[styles.subtitle, { color: colors.subtle }]}>
                  Mohon lengkapi detail berikut sesuai dokumen yang diterbitkan.
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nomor Sertifikat Halal"
                placeholder="Contoh: ID1234567890"
                value={form.certificateNumber}
                onChangeText={value => handleChange('certificateNumber', value)}
                colors={colors}
                icon="hash"
              />
              <LabeledInput
                label="Nama Pemegang Sertifikat"
                placeholder="Nama pemilik atau perusahaan"
                value={form.holderName}
                onChangeText={value => handleChange('holderName', value)}
                colors={colors}
                icon="user"
              />
              <LabeledInput
                label="Nama Produk / Merek"
                placeholder="Produk yang tersertifikasi"
                value={form.productName}
                onChangeText={value => handleChange('productName', value)}
                colors={colors}
                icon="box"
              />
              <LabeledInput
                label="Lembaga Penerbit (opsional)"
                placeholder="BPJPH, MUI, atau lembaga resmi lainnya"
                value={form.issuedBy}
                onChangeText={value => handleChange('issuedBy', value)}
                colors={colors}
                icon="award"
              />
              <LabeledInput
                label="Catatan Tambahan (opsional)"
                placeholder="Informasi batch, pabrik, atau keterangan lain"
                value={form.notes}
                onChangeText={value => handleChange('notes', value)}
                colors={colors}
                multiline
                icon="edit-3"
              />
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                activeOpacity={0.7}
                style={[styles.secondaryButton, { borderColor: colors.border }]}
              >
                <Feather name="arrow-left" size={18} color={colors.subtle} />
                <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Kembali</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.85}
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.accent, opacity: submitting ? 0.6 : 1, flex: 2 },
                ]}
              >
                <Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Kirim Permintaan'}</Text>
                <Feather name="send" size={16} color="#FFFFFF" />
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
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  icon?: keyof typeof Feather.glyphMap;
};

function LabeledInput({ label, placeholder, value, onChangeText, colors, multiline, icon }: LabeledInputProps) {
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
        {icon && (
          <View style={[styles.inputIcon, { top: multiline ? 16 : 14 }]}>
            <Feather name={icon} size={18} color={isFocused ? colors.accent : colors.subtle} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}80`}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? 96 : 48,
              paddingLeft: icon ? 48 : 16,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </Animated.View>
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
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  heroContainer: {
    marginTop: 8,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  hero: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'center',
    gap: 12,
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
    zIndex: -1,
  },
  heroContent: {
    gap: 6,
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  card: {
    borderRadius: 36,
    borderWidth: 1,
    padding: 24,
    gap: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  fieldGroup: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingRight: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});


