import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
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
    background: '#F5F8FF',
    hero: ['#1D4ED8', '#2563EB'],
    surface: '#FFFFFF',
    border: '#D8E3FF',
    text: '#0B1740',
    subtle: '#516091',
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <Text style={styles.heroKicker}>Pengajuan & Pembaruan Izin Usaha</Text>
          <Text style={styles.heroTitle}>Nomor Induk Berusaha (NIB)</Text>
          <Text style={styles.heroSubtitle}>
            Dapatkan legalitas usaha secara resmi melalui penerbitan NIB daring. Lengkapi data, unggah dokumen, dan pantau proses secara real-time.
          </Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}1A` }]}
            >
              <Feather name="file-text" size={20} color={colors.accent} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Alur Pengajuan</Text>
              <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                Ikuti langkah berikut agar proses persetujuan berjalan mulus.
              </Text>
            </View>
          </View>

          <View style={styles.stepList}>
            {steps.map(step => (
              <View key={step} style={styles.stepItem}>
                <View style={[styles.stepBadge, { borderColor: `${colors.accent}55` }]}
                >
                  <Feather name="check" size={14} color={colors.accent} />
                </View>
                <Text style={[styles.stepText, { color: colors.subtle }]}>{step}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/services/nib/apply')}
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.primaryButtonText}>Ajukan NIB Sekarang</Text>
            <Feather name="external-link" size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
    padding: 24,
    gap: 20,
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(15,23,42,0.18)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(224, 234, 255, 0.95)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: 'rgba(233, 244, 255, 0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  stepList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
