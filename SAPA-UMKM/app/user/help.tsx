import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    useColorScheme,
    View,
} from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

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

const faqs = [
    {
        question: 'Bagaimana cara mendaftarkan NIB?',
        answer: 'Anda dapat mendaftarkan NIB melalui menu "Layanan Publik & Perizinan" di dashboard, lalu pilih "Pengajuan NIB". Ikuti instruksi formulir yang disediakan.',
    },
    {
        question: 'Berapa lama proses verifikasi legalitas?',
        answer: 'Proses verifikasi biasanya memakan waktu 1-3 hari kerja tergantung kelengkapan dokumen yang Anda unggah.',
    },
    {
        question: 'Bagaimana cara mengajukan KUR?',
        answer: 'Masuk ke menu "Program Pemberdayaan", pilih "Program KUR", dan isi formulir simulasi serta pengajuan yang tersedia.',
    },
    {
        question: 'Apakah aplikasi ini berbayar?',
        answer: 'SAPA UMKM adalah layanan gratis yang disediakan untuk membantu pengembangan UMKM di Indonesia.',
    },
];

export default function HelpScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Pusat Bantuan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={{ gap: 16 }}>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => toggleExpand(index)}
                            style={[
                                styles.faqItem,
                                { backgroundColor: colors.surface, borderColor: colors.border }
                            ]}
                        >
                            <View style={styles.questionRow}>
                                <Text style={[styles.question, { color: colors.text }]}>{faq.question}</Text>
                                <Feather
                                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.subtle}
                                />
                            </View>
                            {expandedIndex === index && (
                                <View style={styles.answerContainer}>
                                    <Text style={[styles.answer, { color: colors.subtle }]}>{faq.answer}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.contactTitle, { color: colors.text }]}>Masih butuh bantuan?</Text>
                    <Text style={[styles.contactText, { color: colors.subtle }]}>
                        Hubungi tim support kami melalui email atau telepon.
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                        <TouchableOpacity style={styles.contactButton}>
                            <Feather name="mail" size={20} color="#1B5CC4" />
                            <Text style={{ fontWeight: '600', color: '#1B5CC4' }}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactButton}>
                            <Feather name="phone" size={20} color="#1B5CC4" />
                            <Text style={{ fontWeight: '600', color: '#1B5CC4' }}>Telepon</Text>
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
        gap: 24,
    },
    faqItem: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    answerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    answer: {
        fontSize: 14,
        lineHeight: 20,
    },
    contactCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactText: {
        fontSize: 14,
        textAlign: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0F9FF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 99,
    },
});
