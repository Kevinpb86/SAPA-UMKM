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
    background: '#F8FAFC',
    hero: ['#1D4ED8', '#2563EB'],
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    subtle: '#64748B',
    accent: '#1D4ED8',
  },
  dark: {
    background: '#0B1224',
    hero: ['#172554', '#1D4ED8'],
    surface: '#111C32',
    border: '#1E2A4A',
    text: '#F8FAFC',
    subtle: '#A5B4CF',
    accent: '#60A5FA',
  },
};

const steps = [
  'Siapkan data usaha, pemegang saham, dan alamat operasional.',
  'Lengkapi dokumen pendukung seperti KTP, NPWP, dan surat domisili.',
  'Ajukan melalui OSS, pantau status, dan unduh sertifikat NIB.',
];

export default function NibServiceScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  // Animations logic
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(steps.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Background mesh/pulse loop
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating drift loop
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
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Staggered items
    Animated.stagger(150,
      itemAnims.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 25,
          friction: 8,
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
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroContainer,
            { opacity: entryAnim, transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }
          ]}
        >
          <LinearGradient
            colors={colors.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            {/* Moving Mesh Leyer */}
            <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
              <View style={[styles.meshCircle, { top: -50, left: -50, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <View style={[styles.meshCircle, { bottom: -80, right: -40, width: 250, height: 250, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
            </Animated.View>

            {/* Floating Award Icon */}
            <Animated.View style={[styles.floatingIcon, { bottom: '20%', left: '5%', transform: [{ translateY: Animated.multiply(floatY, -0.8) }] }]}>
              <Feather name="award" size={80} color="#FFFFFF" style={{ opacity: 0.05 }} />
            </Animated.View>



            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>Pengajuan & Pembaruan Izin Usaha</Text>
              <View style={styles.heroTitleRow}>
                <View style={styles.heroTitleIcon}>
                  <Feather name="file-text" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Nomor Induk Berusaha (NIB)</Text>
              </View>
              <Text style={styles.heroSubtitle}>
                Dapatkan legalitas usaha secara resmi melalui penerbitan NIB daring. Lengkapi data, unggah dokumen, dan pantau proses secara real-time.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

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
            <Feather name="shield" size={14} color="#6366F1" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>DJKI Terintegrasi</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="lock" size={14} color="#10B981" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Proteksi Hukum</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="eye" size={14} color="#3B82F6" />
            <Text style={[styles.trustText, { color: colors.subtle }]}>Pantau 24/7</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              opacity: entryAnim,
              transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}15` }]}>
              <Animated.View style={{ transform: [{ rotate: meshAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '10deg'] }) }] }}>
                <Feather name="layers" size={22} color={colors.accent} />
              </Animated.View>
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Alur Pengajuan</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                Ikuti langkah berikut agar proses persetujuan berjalan mulus.
              </Text>
            </View>
          </View>

          <View style={styles.stepList}>
            {steps.map((step, index) => (
              <Animated.View
                key={step}
                style={[
                  styles.stepItem,
                  {
                    opacity: itemAnims[index],
                    transform: [{ translateX: itemAnims[index].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
                  }
                ]}
              >
                <View style={[styles.stepBadge, { backgroundColor: `${colors.accent}10`, borderColor: `${colors.accent}20` }]}>
                  <Feather name="check" size={14} color={colors.accent} />
                </View>
                <Text style={[styles.stepText, { color: colors.subtle }]}>{step}</Text>
              </Animated.View>
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
              onPress={() => router.push('/services/nib/apply')}
              activeOpacity={0.85}
              style={[styles.primaryButton, { backgroundColor: colors.accent, flex: 2 }]}
            >
              <Text style={styles.primaryButtonText}>Ajukan NIB</Text>
              <Feather name="external-link" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    gap: 16,
  },
  heroContainer: {
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
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroContent: {
    gap: 8,
    marginTop: 12,
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
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
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
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    marginHorizontal: 4,
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
  stepList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 8,
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
});
