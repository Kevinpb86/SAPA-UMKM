import { useAuth } from '@/hooks/use-auth';
import { fetchSubmissionDetail } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtle: '#64748B',
        primary: '#2563EB',
        success: '#10B981',
        secondary: '#6366F1',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        border: '#334155',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        primary: '#3B82F6',
        success: '#34D399',
        secondary: '#818CF8',
    },
};

export default function SubmissionDetailScreen() {
    const { id, type } = useLocalSearchParams();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();

    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadDetail = async () => {
        if (!user?.token || !id || !type) return;
        try {
            const response = await fetchSubmissionDetail(user.token, id as string, type as string);
            if (response.success) {
                setDetail(response.data);
            }
        } catch (error) {
            console.error('Load detail error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetail();
    }, [id, type]);

    const formatKey = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace('Id', 'ID')
            .replace('Nik', 'NIK')
            .replace('Nib', 'NIB')
            .replace('Nuip', 'NUIP')
            .replace('Npwp', 'NPWP')
            .replace('Bpom', 'BPOM')
            .replace('Sni', 'SNI')
            .replace('Kp', 'KP')
            .replace('Kur', 'KUR')
            .replace('Umi', 'UMi')
            .replace('Lpdb', 'LPDB');
    };

    const renderValue = (key: string, value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value);
        if (key.includes('created_at') || key.includes('updated_at')) {
            return new Date(value).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return String(value);
    };

    const ignoredKeys = ['id', 'user_id', 'created_at', 'updated_at', 'display_name', 'email'];

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!detail) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.subtle }}>Detail tidak ditemukan</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Detail {type}</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.subtle }]}>ID: #{detail.id}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Meta Information */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <Feather name="info" size={18} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Informasi Dasar</Text>
                    </View>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: colors.subtle }]}>Status</Text>
                            <View style={[styles.statusBadge, { backgroundColor: `${detail.status === 'approved' ? colors.success : colors.primary}12` }]}>
                                <Text style={[styles.statusText, { color: detail.status === 'approved' ? colors.success : colors.primary }]}>
                                    {String(detail.status).toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: colors.subtle }]}>Tanggal Pengajuan</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{renderValue('created_at', detail.created_at)}</Text>
                        </View>
                    </View>
                </View>

                {/* Submitter Info */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <Feather name="user" size={18} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik</Text>
                    </View>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: colors.subtle }]}>Nama Lengkap</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{detail.display_name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={[styles.label, { color: colors.subtle }]}>Email</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{detail.email}</Text>
                        </View>
                    </View>
                </View>

                {/* dynamic fields section */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.sectionHeader}>
                        <Feather name="file-text" size={18} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Rincian {type}</Text>
                    </View>
                    <View style={styles.dynamicGrid}>
                        {Object.entries(detail)
                            .filter(([key]) => !ignoredKeys.includes(key) && key !== 'status' && key !== 'type')
                            .map(([key, value]) => (
                                <View key={key} style={styles.dynamicItem}>
                                    <Text style={[styles.label, { color: colors.subtle }]}>{formatKey(key)}</Text>
                                    <Text style={[styles.value, { color: colors.text }]}>{renderValue(key, value)}</Text>
                                </View>
                            ))}
                    </View>
                </View>

                {/* Success Message/Badge if Approved */}
                {detail.status === 'approved' && (
                    <View style={[styles.approvedBanner, { backgroundColor: `${colors.success}10`, borderColor: colors.success }]}>
                        <Feather name="check-circle" size={24} color={colors.success} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.approvedTitle, { color: colors.success }]}>Dokumen Telah Disetujui</Text>
                            <Text style={[styles.approvedSubtitle, { color: colors.success }]}>
                                Seluruh data telah diverifikasi oleh kementerian terkait dan dokumen Anda kini berstatus AKTIF.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: 12,
    },
    scrollContent: {
        padding: 20,
        gap: 16,
    },
    section: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    gridItem: {
        flex: 1,
        minWidth: '40%',
    },
    dynamicGrid: {
        gap: 16,
    },
    dynamicItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.02)',
        paddingBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    approvedBanner: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        gap: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    approvedTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    approvedSubtitle: {
        fontSize: 13,
        lineHeight: 18,
        opacity: 0.9,
    },
});
