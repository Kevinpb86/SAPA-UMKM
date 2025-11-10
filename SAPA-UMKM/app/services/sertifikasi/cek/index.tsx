import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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
          <Text style={styles.heroTitle}>Pilih Jenis Sertifikasi</Text>
          <Text style={styles.heroSubtitle}>
            Sesuaikan permohonan Anda dengan jenis sertifikasi yang ingin diperiksa agar tim kami bisa menindaklanjuti secara akurat.
          </Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Jenis Sertifikasi</Text>
          <View style={styles.divider} />
          <View style={styles.optionList}>
            {certificateOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                accessibilityRole="button"
                onPress={() => router.push(option.route as never)}
                style={[styles.optionCard, { borderColor: colors.border }]}
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
    backgroundColor: 'rgba(8, 34, 30, 0.25)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(236, 253, 245, 0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
  },
  optionList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});


