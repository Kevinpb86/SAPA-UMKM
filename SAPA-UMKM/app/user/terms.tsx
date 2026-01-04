import { Feather } from '@expo/vector-icons';
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
        background: '#F5F7FB',
        surface: '#FFFFFF',
        text: '#0F1B3A',
        subtle: '#66728F',
        border: '#E1E6F3',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        border: '#273449',
    },
};

export default function TermsScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Syarat & Ketentuan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Selamat datang di aplikasi SAPA UMKM. Harap membaca syarat dan ketentuan berikut dengan saksama.
                    </Text>

                    <Text style={[styles.heading, { color: colors.text }]}>1. Penggunaan Layanan</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Layanan ini disediakan untuk membantu pelaku UMKM dalam mengurus legalitas, mendapatkan akses pembiayaan, dan mengikuti program pelatihan. Pengguna wajib memberikan data yang valid dan benar.
                    </Text>

                    <Text style={[styles.heading, { color: colors.text }]}>2. Privasi Data</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Kami menjaga kerahasiaan data pribadi Anda sesuai dengan kebijakan privasi yang berlaku. Data Anda hanya digunakan untuk keperluan verifikasi layanan dan program terkait.
                    </Text>

                    <Text style={[styles.heading, { color: colors.text }]}>3. Tanggung Jawab Pengguna</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Pengguna bertanggung jawab atas keamanan akun masing-masing. Segala aktivitas yang terjadi di bawah akun pengguna menjadi tanggung jawab pengguna sepenuhnya.
                    </Text>

                    <Text style={[styles.heading, { color: colors.text }]}>4. Perubahan Layanan</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Kami berhak mengubah atau menghentikan layanan sewaktu-waktu dengan atau tanpa pemberitahuan sebelumnya demi peningkatan kualitas aplikasi.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        padding: 24,
    },
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    heading: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 8,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
    },
});
