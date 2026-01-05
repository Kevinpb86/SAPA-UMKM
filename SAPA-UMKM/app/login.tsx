import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
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
    background: '#F8FAFD',
    card: '#FFFFFF',
    text: '#0F172A',
    subtle: '#64748B',
    primary: '#2563EB',
    border: '#E2E8F0',
    input: '#FBFDFF',
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
    input: '#1A2333',
    accent: '#60A5FA',
    focus: '#3B82F6',
    success: '#34D399',
  },
};

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      router.replace(destination);
    }
  }, [user, loading, router]);

  const [form, setForm] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 20,
    }).start();
  };

  const handleChange = (key: 'email' | 'password', value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail || !form.password) {
      Alert.alert('Data belum lengkap', 'Mohon isi email dan kata sandi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const account = await login(trimmedEmail, form.password);
      if (!account) {
        Alert.alert('Login gagal', 'Email atau kata sandi tidak sesuai dengan data registrasi.');
        return;
      }

      Alert.alert('Login Berhasil', 'Anda akan dialihkan ke dashboard...', [
        {
          text: 'OK',
          onPress: () => {
            const destination = account.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
            router.replace(destination);
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Terjadi Kesalahan', 'Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroOverlayOne} />
            <View style={styles.heroOverlayTwo} />
            <View style={styles.heroOverlayThree} />

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.heroBackButton}
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.heroBackText}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.heroHeader}>
              <View style={styles.heroTag}>
                <Feather name="shield" size={16} color="#FFFFFF" />
                <Text style={styles.heroTagText}>Portal SAPA UMKM</Text>
              </View>
              <Text style={styles.heroTitle}>Selamat Datang Kembali</Text>
              <Text style={styles.heroSubtitle}>
                Akses layanan perizinan, program bantuan, komunitas, dan pelatihan UMKM dalam satu ekosistem digital terpadu.
              </Text>
            </View>

            <View style={styles.heroChecklist}>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="lock" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>Akses Aman</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="trending-up" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>Pantau Usaha</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <View style={styles.checkInnerIcon}>
                  <Feather name="users" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.heroChecklistText}>Komunitas</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.formHeader}>
              <View style={styles.formHeaderIconOuter}>
                <View style={[styles.formHeaderIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Feather name="user-check" size={20} color={colors.primary} />
                </View>
              </View>
              <Text style={[styles.formHeaderTitle, { color: colors.text }]}>Masuk ke Akun Anda</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <View style={[
                styles.inputWrapper,
                {
                  borderColor: focusedField === 'email' ? colors.focus : colors.border,
                  backgroundColor: colors.input
                }
              ]}>
                <Feather
                  name="mail"
                  size={18}
                  color={focusedField === 'email' ? colors.focus : colors.subtle}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="name@company.com"
                  placeholderTextColor={`${colors.subtle}60`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={value => handleChange('email', value)}
                  style={[styles.input, { color: colors.text }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Kata Sandi</Text>
              <View style={[
                styles.inputWrapper,
                {
                  borderColor: focusedField === 'password' ? colors.focus : colors.border,
                  backgroundColor: colors.input
                }
              ]}>
                <Feather
                  name="lock"
                  size={18}
                  color={focusedField === 'password' ? colors.focus : colors.subtle}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={`${colors.subtle}60`}
                  secureTextEntry={!passwordVisible}
                  value={form.password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={value => handleChange('password', value)}
                  style={[styles.input, { color: colors.text }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.passwordToggle}>
                  <Feather
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.subtle}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.linkInline}>
                <Text style={[styles.linkText, { color: colors.primary }]}>Lupa kata sandi?</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                accessibilityRole="button"
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.9}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: isSubmitting ? colors.subtle : colors.focus,
                    shadowColor: colors.focus
                  }
                ]}>
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Memproses...' : 'Masuk ke Akun'}
                </Text>
                {!isSubmitting && <Feather name="log-in" size={20} color="#FFFFFF" />}
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.subtle }]}>atau</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/register')}
              style={[styles.secondaryButton, { borderColor: colors.border }]}>
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Buat akun baru</Text>
            </TouchableOpacity>
          </View>
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
  },
  hero: {
    borderRadius: 32,
    padding: 28,
    gap: 24,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  heroOverlayOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -100,
    right: -80,
  },
  heroOverlayTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -80,
    left: -60,
  },
  heroOverlayThree: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: '20%',
    left: '10%',
  },
  heroBackButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  heroBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroHeader: {
    gap: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
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
  formCard: {
    borderRadius: 32,
    borderWidth: 0,
    padding: 24,
    gap: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    marginTop: -8,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  formHeaderIconOuter: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.08)',
  },
  inputGroup: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.1,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    opacity: 0.75,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 4,
  },
  linkInline: {
    alignSelf: 'flex-end',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    borderRadius: 18,
    borderWidth: 0,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
