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

          <Text style={styles.heroKicker}>Pengajuan Sertifikasi</Text>
          <Text style={styles.heroTitle}>Halal, SNI, dan Standar Lainnya</Text>
          <Text style={styles.heroSubtitle}>
            Pastikan produk Anda memenuhi standar kualitas dengan sertifikasi resmi. Pantau seluruh proses dari satu halaman terpadu.
          </Text>
        </LinearGradient>

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
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.primaryButtonText}>Cek Sertifikasi</Text>
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
    backgroundColor: 'rgba(8, 34, 30, 0.25)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(209, 250, 229, 0.9)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
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
    fontWeight: '700',
  },
});
