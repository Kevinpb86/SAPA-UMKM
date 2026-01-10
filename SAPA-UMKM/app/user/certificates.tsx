import { useAuth } from '@/hooks/use-auth';
import { fetchMyCertificates } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

const palette = {
    light: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtle: '#64748B',
        primary: '#2563EB',
        success: '#10B981',
        secondary: '#8B5CF6',
    },
    dark: {
        background: '#0F172A',
        card: '#1E293B',
        border: '#334155',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        primary: '#3B82F6',
        success: '#34D399',
        secondary: '#A78BFA',
    },
};

type Certificate = {
    id: number;
    training_interest: string;
    full_name: string;
    created_at: string;
    status: string;
};

export default function CertificatesScreen() {
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadCertificates = async () => {
        if (!user?.token) return;
        try {
            const response = await fetchMyCertificates(user.token);
            if (response.success) {
                setCertificates(response.data);
            }
        } catch (error) {
            console.error('Load certificates error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCertificates();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadCertificates();
    };

    const handleDownload = (cert: Certificate) => {
        Alert.alert(
            'Unduh Sertifikat',
            `Sertifikat untuk pelatihan "${cert.training_interest}" sedang diproses untuk diunduh.`,
            [{ text: 'OK' }]
        );
    };

    const renderItem = ({ item }: { item: Certificate }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardIconContainer}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.secondary}15` }]}>
                    <Feather name="award" size={24} color={colors.secondary} />
                </View>
                <View style={styles.cardHeaderInfo}>
                    <Text style={[styles.certTitle, { color: colors.text }]}>{item.training_interest}</Text>
                    <Text style={[styles.certSubtitle, { color: colors.subtle }]}>Diterbitkan untuk: {item.full_name}</Text>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.cardFooter}>
                <View style={styles.dateInfo}>
                    <Feather name="calendar" size={14} color={colors.subtle} />
                    <Text style={[styles.dateText, { color: colors.subtle }]}>
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleDownload(item)}
                    style={[styles.downloadBtn, { backgroundColor: `${colors.primary}10` }]}
                >
                    <Feather name="download" size={16} color={colors.primary} />
                    <Text style={[styles.downloadText, { color: colors.primary }]}>Unduh</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Sertifikat Pelatihan</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={certificates}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={[styles.emptyIconCircle, { backgroundColor: `${colors.secondary}10` }]}>
                                <Feather name="book-open" size={48} color={colors.secondary} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada sertifikat</Text>
                            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
                                Selesaikan pelatihan komunitas untuk mendapatkan sertifikat resmi Anda di sini.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        padding: 20,
        gap: 16,
        flexGrow: 1,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderInfo: {
        flex: 1,
        gap: 4,
    },
    certTitle: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
    },
    certSubtitle: {
        fontSize: 13,
    },
    divider: {
        height: 1,
        marginVertical: 16,
        opacity: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '500',
    },
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    downloadText: {
        fontSize: 13,
        fontWeight: '700',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: 16,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
});
