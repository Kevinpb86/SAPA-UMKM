import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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
    background: '#F5F7FB',
    card: '#FFFFFF',
    text: '#0F1B3A',
    subtle: '#66728F',
    primary: '#1B5CC4',
    border: '#DEE4F2',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subtle: '#94A3B8',
    primary: '#3B82F6',
    border: '#273449',
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

  const handleChange = (key: 'email' | 'password', value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail || !form.password) {
      Alert.alert('Data belum lengkap', 'Mohon isi email dan kata sandi.');
      return;
    }

    const account = await login(trimmedEmail, form.password);
    if (!account) {
      Alert.alert('Login gagal', 'Email atau kata sandi tidak sesuai dengan data registrasi.');
      return;
    }

    const destination = account.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    router.replace(destination);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#1D4ED8', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroOverlayOne} />
            <View style={styles.heroOverlayTwo} />
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
                <Feather name="log-in" size={16} color="#FFFFFF" />
                <Text style={styles.heroTagText}>Masuk ke SAPA UMKM</Text>
              </View>
              <Text style={styles.heroTitle}>Selamat Datang Kembali</Text>
              <Text style={styles.heroSubtitle}>
                Akses layanan perizinan, program bantuan, komunitas, dan pelatihan UMKM dalam satu aplikasi.
              </Text>
            </View>

            <View style={styles.heroChecklist}>
              <View style={styles.heroChecklistItem}>
                <Feather name="shield" size={16} color="#FFFFFF" />
                <Text style={styles.heroChecklistText}>Autentikasi aman dengan email terdaftar.</Text>
              </View>
              <View style={styles.heroChecklistItem}>
                <Feather name="pie-chart" size={16} color="#FFFFFF" />
                <Text style={styles.heroChecklistText}>Pantau status legalitas dan program aktif.</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.formHeader}>
              <View style={[styles.formHeaderIcon, { backgroundColor: 'rgba(37,99,235,0.12)' }]}
              >
                <Feather name="mail" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.formHeaderTitle, { color: colors.text }]}>Masuk dengan akun Anda</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Email</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <Feather name="at-sign" size={18} color={colors.subtle} style={styles.inputIcon} />
                <TextInput
                  placeholder="contoh: pelaku@umkm.id"
                  placeholderTextColor={`${colors.subtle}80`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={value => handleChange('email', value)}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Kata Sandi</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <Feather name="lock" size={18} color={colors.subtle} style={styles.inputIcon} />
                <TextInput
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor={`${colors.subtle}80`}
                  secureTextEntry
                  value={form.password}
                  onChangeText={value => handleChange('password', value)}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              <TouchableOpacity style={styles.linkInline}>
                <Text style={[styles.linkText, { color: colors.primary }]}>Lupa kata sandi?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.primaryButtonText}>Masuk</Text>
              <Feather name="arrow-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>

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
    borderRadius: 28,
    padding: 24,
    gap: 20,
    overflow: 'hidden',
  },
  heroOverlayOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -80,
    right: -70,
  },
  heroOverlayTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    bottom: -60,
    left: -40,
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
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroChecklistText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
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
    fontSize: 18,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  },
  inputIcon: {
    opacity: 0.75,
  },
  input: {
    flex: 1,
    fontSize: 15,
    outlineStyle: 'none',
    outlineWidth: 0,
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
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#1B5CC4',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
