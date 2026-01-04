import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { fetchSubmissionById, updateSubmissionStatus } from '@/lib/api';

const palette = {
    light: {
        background: '#F5F7FB',
        surface: '#FFFFFF',
        border: '#E1E6F3',
        primary: '#1B5CC4',
        accent: '#F97316',
        success: '#16A34A',
        warning: '#FACC15',
        text: '#0F1B3A',
        subtle: '#66728F',
        error: '#DC2626',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        border: '#273449',
        primary: '#3B82F6',
        accent: '#FB923C',
        success: '#22C55E',
        warning: '#FBBF24',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        error: '#EF4444',
    },
};

type Submission = {
    id: number;
    user_id: number;
    type: string;
    data: any;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    email: string;
    display_name: string;
};

const DataExplorer = ({ data, level = 0 }: { data: any; level?: number }) => {
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;

    if (typeof data !== 'object' || data === null) {
        return (
            <Text style={[styles.dataValue, { color: colors.text }]}>
                {String(data)}
            </Text>
        );
    }

    return (
        <View style={{ gap: 12 }}>
            {Object.entries(data).map(([key, value]) => {
                // Skip internal or empty keys
                if (key === 'termsAccepted') return null;

                const isNested = typeof value === 'object' && value !== null;
                const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/_/g, ' ');

                return (
                    <View
                        key={key}
                        style={[
                            styles.dataRow,
                            {
                                borderColor: colors.border,
                                backgroundColor: level === 0
                                    ? (scheme === 'dark' ? 'rgba(255,255,255,0.02)' : '#F8FAFC')
                                    : 'transparent',
                                marginLeft: level * 8,
                                marginTop: isNested && level > 0 ? 8 : 0,
                                borderLeftWidth: level > 0 ? 2 : 1,
                                borderLeftColor: level > 0 ? colors.primary : colors.border
                            }
                        ]}
                    >
                        <Text style={[
                            styles.dataLabel,
                            {
                                color: isNested ? colors.primary : colors.subtle,
                                fontSize: isNested ? 13 : 12,
                                marginBottom: isNested ? 8 : 0
                            }
                        ]}>
                            {label}
                        </Text>
                        <DataExplorer data={value} level={level + 1} />
                    </View>
                );
            })}
        </View>
    );
};

export default function SubmissionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadSubmission();
    }, [id]);

    const loadSubmission = async () => {
        if (!user?.token || !id) return;
        try {
            const response = await fetchSubmissionById(user.token, id);
            if (response.success) {
                setSubmission(response.data);
            } else {
                Alert.alert('Error', response.message);
                router.back();
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal memuat data pengajuan');
            console.error(error);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
        if (!user?.token || !submission) return;

        setProcessing(true);
        try {
            await updateSubmissionStatus(user.token, submission.id, status);
            Alert.alert(
                status === 'approved' ? 'Terverifikasi' : 'Ditolak',
                `Pengajuan berhasil ${status === 'approved' ? 'diverifikasi' : 'ditolak'}.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Gagal mengupdate status');
        } finally {
            setProcessing(false);
        }
    };

    const [parsedData, setParsedData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (submission?.data) {
            try {
                const data = typeof submission.data === 'string'
                    ? JSON.parse(submission.data)
                    : submission.data;
                setParsedData(data);
            } catch (e) {
                setParsedData({ error: 'Gagal memproses data' });
            }
        }
    }, [submission]);

    const formatLabel = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/_/g, ' '); // Replace underscores with spaces
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                <Text style={{ color: colors.subtle }}>Memuat data...</Text>
            </SafeAreaView>
        );
    }

    if (!submission) return null;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                >
                    <Feather name="arrow-left" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Detail Pengajuan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
                            <Feather name="file-text" size={24} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{submission.type.toUpperCase()}</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                                Oleh: {submission.display_name}
                            </Text>
                            <Text style={[styles.cardSubtitle, { color: colors.subtle, fontSize: 12 }]}>
                                {submission.email}
                            </Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    submission.status === 'approved' ? `${colors.success}15` :
                                        submission.status === 'rejected' ? `${colors.error}15` :
                                            `${colors.warning}15`
                            }
                        ]}>
                            <Text style={{
                                color:
                                    submission.status === 'approved' ? colors.success :
                                        submission.status === 'rejected' ? colors.error :
                                            colors.warning,
                                fontWeight: '700',
                                fontSize: 12
                            }}>
                                {submission.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.dataContainer}>
                        <Text style={[styles.sectionHeading, { color: colors.text }]}>Informasi Formulir</Text>
                        {Object.entries(parsedData).length === 0 ? (
                            <Text style={{ color: colors.subtle, fontStyle: 'italic' }}>Tidak ada data formulir.</Text>
                        ) : (
                            <DataExplorer data={parsedData} />
                        )}
                    </View>
                </View>
            </ScrollView>

            {submission.status === 'pending' && (
                <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: colors.error, borderWidth: 1 }]}
                        onPress={() => handleStatusUpdate('rejected')}
                        disabled={processing}
                    >
                        <Text style={[styles.actionButtonText, { color: colors.error }]}>Tolak</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.success }]}
                        onPress={() => handleStatusUpdate('approved')}
                        disabled={processing}
                    >
                        <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Verifikasi (Terima)</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        padding: 16,
        gap: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardSubtitle: {
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    dataContainer: {
        gap: 12,
    },
    sectionHeading: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dataRow: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    dataLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    dataValue: {
        fontSize: 15,
        marginTop: 2,
        lineHeight: 22,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontWeight: '700',
        fontSize: 14,
    },
});
