import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const palette = {
  light: {
    background: '#EFF6FF',
    hero: ['#2563EB', '#3B82F6'],
    surface: '#FFFFFF',
    border: '#DBEAFE',
    text: '#1E3A8A',
    subtle: '#3B82F6',
    accent: '#2563EB',
  },
  dark: {
    background: '#0C1633',
    hero: ['#1E40AF', '#3B82F6'],
    surface: '#1E293B',
    border: '#1E3A8A',
    text: '#EFF6FF',
    subtle: '#93C5FD',
    accent: '#60A5FA',
  },
};

const certificateOptions = [
  {
    id: 'halal',
    title: 'Sertifikat Halal',
    description: 'Verifikasi status kehalalan produk dan pemegang sertifikat.',
    icon: 'check-circle' as const,
    route: '/services/sertifikasi/cek/halal',
  },
  {
    id: 'sni',
    title: 'Standar Nasional Indonesia (SNI)',
    description: 'Pastikan produk memenuhi standar mutu nasional Indonesia.',
    icon: 'award' as const,
    route: '/services/sertifikasi/cek/sni',
  },
  {
    id: 'bpom',
    title: 'Registrasi BPOM',
    description: 'Periksa nomor izin edar dan informasi produk yang terdaftar.',
    icon: 'shield' as const,
    route: '/services/sertifikasi/cek/bpom',
  },
  {
    id: 'lainnya',
    title: 'Standar Khusus Lainnya',
    description: 'Cek sertifikasi lain seperti HACCP, ISO, atau standar ekspor.',
    icon: 'file-text' as const,
    route: '/services/sertifikasi/cek/lainnya',
  },
];

export default function CertificateSelectionScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  // Elite Animation System
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(certificateOptions.map(() => new Animated.Value(0))).current;

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

    // Staggered entry
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 20,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.stagger(100,
      optionsAnim.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 40,
          friction: 9,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const meshRotate = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
            {/* Animated Mesh Overlay */}
            <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
              <View style={[styles.meshCircle, { top: -80, right: -40, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <View style={[styles.meshCircle, { bottom: -120, left: -60, width: 320, height: 320, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
            </Animated.View>

            {/* Floating Decorative Icons */}
            <Animated.View style={[styles.floatingIcon, { top: '20%', right: '12%', transform: [{ translateY: floatY }] }]}>
              <Feather name="award" size={70} color="#FFFFFF" style={{ opacity: 0.05 }} />
            </Animated.View>
            <Animated.View style={[styles.floatingIcon, { bottom: '15%', left: '8%', transform: [{ translateY: Animated.multiply(floatY, -0.6) }] }]}>
              <Feather name="check-circle" size={90} color="#FFFFFF" style={{ opacity: 0.04 }} />
            </Animated.View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Pilih Jenis Sertifikasi</Text>
              <Text style={styles.heroSubtitle}>
                Sesuaikan permohonan Anda dengan jenis sertifikasi yang ingin diperiksa agar tim kami bisa menindaklanjuti secara akurat.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Kategori Layanan</Text>
          <View style={styles.divider} />
          <View style={styles.optionList}>
            {certificateOptions.map((option, index) => (
              <Animated.View
                key={option.id}
                style={{
                  opacity: optionsAnim[index],
                  transform: [
                    { scale: optionsAnim[index].interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                    { translateX: optionsAnim[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                  ]
                }}
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => router.push(option.route as never)}
                  activeOpacity={0.75}
                  style={[styles.optionCard, { borderColor: colors.border, backgroundColor: colors.background }]}
                >
                  <View style={[styles.optionIcon, { backgroundColor: `${colors.accent}15` }]}>
                    <Feather name={option.icon} size={20} color={colors.accent} />
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
                    <Text style={[styles.optionDescription, { color: colors.subtle }]}>{option.description}</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.subtle} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    gap: 20,
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
    gap: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 'auto',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    lineHeight: 22,
    fontWeight: '400',
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    padding: 24,
    gap: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    marginTop: -8,
  },
  optionList: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    padding: 20,
    borderRadius: 32,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    opacity: 0.7,
  },
});


