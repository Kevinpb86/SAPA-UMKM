import { useAuth } from '@/hooks/use-auth';
import { fetchMyHistory } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
        accent: '#06B6D4',
        success: '#10B981',
        pending: '#F59E0B',
        rejected: '#EF4444',
    },
    dark: {
        background: '#0F172A',
        card: '#1E293B',
        border: '#334155',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        primary: '#3B82F6',
        accent: '#22D3EE',
        success: '#34D399',
        pending: '#FBBF24',
        rejected: '#F87171',
    },
};

type Submission = {
    id: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    title: string;
};

export default function HistoryScreen() {
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();

    const [history, setHistory] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        if (!user?.token) return;
        try {
            const response = await fetchMyHistory(user.token);
            if (response.success) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Load history error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadHistory();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return colors.success;
            case 'pending':
                return colors.pending;
            case 'rejected':
                return colors.rejected;
            default:
                return colors.subtle;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'check-circle';
            case 'pending':
                return 'clock';
            case 'rejected':
                return 'x-circle';
            default:
                return 'circle';
        }
    };

    const getTypeIcon = (type: string) => {
        const typeUpper = type.toUpperCase();
        if (typeUpper.includes('NIB')) return 'shield';
        if (typeUpper.includes('MEREK')) return 'tag';
        if (typeUpper.includes('SERTIFIKAT') || typeUpper.includes('HALAL') || typeUpper.includes('SNI') || typeUpper.includes('BPOM')) return 'award';
        if (typeUpper.includes('KUR') || typeUpper.includes('UMI') || typeUpper.includes('LPDB')) return 'dollar-sign';
        if (typeUpper.includes('PELATIHAN')) return 'book-open';
        return 'file-text';
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const renderItem = ({ item }: { item: Submission }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/user/submission/[id]', params: { id: item.id, type: item.type } })}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
            {/* Top Accent Bar */}
            <LinearGradient
                colors={[getStatusColor(item.status), `${getStatusColor(item.status)}80`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardAccent}
            />

            <View style={styles.cardContent}>
                {/* Icon and Type Badge */}
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}25` }]}>
                            <Feather name={getTypeIcon(item.type)} size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.typeBadge, { backgroundColor: `${colors.primary}10` }]}>
                                <Text style={[styles.typeText, { color: colors.primary }]}>{item.type}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15`, borderColor: `${getStatusColor(item.status)}30` }]}>
                        <Feather name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status === 'approved' ? 'Disetujui' : item.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                </Text>

                {/* Footer with Date and Arrow */}
                <View style={styles.cardFooter}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <View style={[styles.dateIconContainer, { backgroundColor: `${colors.subtle}10` }]}>
                            <Feather name="calendar" size={12} color={colors.subtle} />
                        </View>
                        <Text style={[styles.date, { color: colors.subtle }]}>{formatDate(item.created_at)}</Text>
                    </View>
                    <View style={[styles.arrowContainer, { backgroundColor: `${colors.primary}08` }]}>
                        <Feather name="chevron-right" size={16} color={colors.primary} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

            {/* Enhanced Header with Gradient */}
            <LinearGradient
                colors={scheme === 'dark'
                    ? [colors.card, colors.card]
                    : ['#FFFFFF', `${colors.primary}02`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { borderBottomColor: colors.border }]}
            >
                {/* Top Gradient Accent Bar */}
                <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerAccent}
                />

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: `${colors.subtle}10` }]}
                >
                    <Feather name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                    <View style={[styles.headerIconContainer, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}25` }]}>
                        <Feather name="clock" size={18} color={colors.primary} />
                    </View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Riwayat Pengajuan</Text>
                </View>

                <View style={{ width: 40 }} />
            </LinearGradient>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={[styles.emptyIconCircle, { backgroundColor: `${colors.primary}08`, borderWidth: 2, borderColor: `${colors.primary}15`, borderStyle: 'dashed' }]}>
                                <Feather name="inbox" size={56} color={colors.primary} style={{ opacity: 0.6 }} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum Ada Riwayat</Text>
                            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
                                Semua pengajuan program dan layanan Anda akan muncul di sini
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
        paddingVertical: 16,
        borderBottomWidth: 1.5,
        position: 'relative',
        overflow: 'hidden',
    },
    headerAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        opacity: 0.9,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    listContent: {
        padding: 20,
        gap: 16,
        flexGrow: 1,
    },
    card: {
        borderRadius: 20,
        borderWidth: 1.5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        overflow: 'hidden',
    },
    cardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
    },
    cardContent: {
        padding: 18,
        gap: 14,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    typeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
        borderWidth: 1.5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    dateIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    date: {
        fontSize: 13,
        fontWeight: '500',
    },
    arrowContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
        gap: 18,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
    },
});
