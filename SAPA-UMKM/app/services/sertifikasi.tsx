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
  View
} from 'react-native';

const palette = {
  light: {
    background: '#F3FBF8',
    hero: ['#0F766E', '#10B981'],
    surface: '#FFFFFF',
    border: '#CFF0E7',
    text: '#083B36',
    subtle: '#4A6F6A',
    accent: '#0F766E',
  },
  dark: {
    background: '#082420',
    hero: ['#065F46', '#15803D'],
    surface: '#102D28',
    border: '#1F433B',
    text: '#F8FAFC',
    subtle: '#A7F3D0',
    accent: '#34D399',
  },
};

const checklist = [
  'Tentukan jenis sertifikasi: Halal, SNI, atau standar khusus lainnya.',
  'Lengkapi dokumen pendukung seperti sertifikat produksi, bahan baku, dan laporan inspeksi.',
  'Kirim pengajuan dan jadwalkan audit lapangan bersama lembaga sertifikasi.',
];

export default function SertifikasiServiceScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  // Elite Animation System
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesh loop
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 20000,
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

    // Master entry
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
    outputRange: [0, -25],
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
            <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.4 }] }]}>
              <View style={[styles.meshCircle, { top: -60, left: -60, width: 220, height: 220, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
              <View style={[styles.meshCircle, { bottom: -100, right: -20, width: 280, height: 280, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
            </Animated.View>

            {/* Business Floating Icons */}
            <Animated.View style={[styles.floatingIcon, { top: '15%', right: '8%', transform: [{ translateY: floatY }] }]}>
              <Feather name="award" size={80} color="#FFFFFF" style={{ opacity: 0.05 }} />
            </Animated.View>
            <Animated.View style={[styles.floatingIcon, { bottom: '10%', left: '4%', transform: [{ translateY: Animated.multiply(floatY, -0.7) }] }]}>
              <Feather name="shield" size={100} color="#FFFFFF" style={{ opacity: 0.04 }} />
            </Animated.View>

            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>Pengajuan Sertifikasi</Text>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroTitleIcon}>
                  <Feather name="award" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Halal, SNI, dan Standar Lainnya</Text>
              </View>
              <Text style={styles.heroSubtitle}>
                Pastikan produk Anda memenuhi standar kualitas dengan sertifikasi resmi. Pantau seluruh proses dari satu halaman terpadu.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Official Trust Indicators */}
        <Animated.View
          style={[
            styles.trustBanner,
            {
              opacity: entryAnim,
              transform: [{ scale: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }]
            }
          ]}
        >
          <View style={styles.trustItem}>
            <Feather name="award" size={14} color="#0F766E" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Lembaga Resmi</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="activity" size={14} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Audit Terpadu</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="eye" size={14} color="#34D399" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Pantau Real-time</Text>
          </View>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}1A` }]}
            >
              <Feather name="award" size={20} color={colors.accent} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Checklist Persiapan</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                Ikuti langkah berikut untuk memperlancar proses sertifikasi.
              </Text>
            </View>
          </View>

          <View style={styles.checklist}>
            {checklist.map(item => (
              <View key={item} style={styles.checklistRow}>
                <Feather name="check-circle" size={16} color={colors.accent} />
                <Text style={[styles.checklistText, { color: colors.subtle }]}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={[styles.secondaryButton, { borderColor: colors.border }]}
            >
              <Feather name="chevron-left" size={18} color={colors.subtle} />
              <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Kembali</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/services/sertifikasi/cek')}
              activeOpacity={0.85}
              style={[styles.primaryButton, { backgroundColor: colors.accent, flex: 2 }]}
            >
              <Text style={styles.primaryButtonText}>Cek Sertifikasi</Text>
              <Feather name="external-link" size={18} color="#FFFFFF" />
            </TouchableOpacity>
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
  },
  heroContainer: {
    marginTop: 8,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  hero: {
    padding: 20,
    minHeight: 240,
    justifyContent: 'center',
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
    marginTop: 0,
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroTitleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  trustBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    marginHorizontal: 4,
    marginTop: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  card: {
    borderRadius: 36,
    borderWidth: 1,
    padding: 30,
    gap: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    marginVertical: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    opacity: 0.8,
  },
  pulseCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: -1,
  },
  checklist: {
    gap: 16,
  },
  checklistRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
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
  primaryButton: {
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
