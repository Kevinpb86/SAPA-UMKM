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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrapper}>
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
              <Text style={styles.backText}>Kembali</Text>
            </TouchableOpacity>

            <Text style={styles.heroKicker}>Pengajuan Sertifikasi</Text>
            <Text style={styles.heroTitle}>Halal, SNI, dan Standar Lainnya</Text>
            <Text style={styles.heroSubtitle}>
              Pastikan produk Anda memenuhi standar kualitas dengan sertifikasi resmi. Pantau seluruh proses dari satu halaman terpadu.
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={scheme === 'dark' ? ['#065F4633', 'transparent'] : ['#F3FBF8', 'transparent']}
            style={styles.meshGradient}
          />
        </View>

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

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/services/sertifikasi/cek')}
            style={styles.submitWrapper}
          >
            <LinearGradient
              colors={[`${colors.accent}`, '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Cek Sertifikasi</Text>
              <Feather name="external-link" size={16} color="#FFFFFF" />
            </LinearGradient>
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
  heroWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  hero: {
    padding: 24,
    gap: 16,
    zIndex: 1,
  },
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(8, 34, 30, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroKicker: {
    color: 'rgba(209, 250, 229, 0.9)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(236, 253, 245, 0.92)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    borderRadius: 32,
    borderWidth: 0,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
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
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    opacity: 0.7,
  },
  checklist: {
    gap: 12,
  },
  checklistRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.8,
  },
  submitWrapper: {
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
