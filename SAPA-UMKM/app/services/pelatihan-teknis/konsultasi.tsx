import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import { trainingModules } from '@/constants/trainingPrograms';
import { useAuth } from '@/hooks/use-auth';

const palette = {
    light: {
        background: '#F8FAFC',
        hero: ['#0EA5E9', '#3B82F6'],
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtle: '#64748B',
        accent: '#0EA5E9',
    },
    dark: {
        background: '#0B1224',
        hero: ['#0C4A6E', '#0EA5E9'],
        surface: '#111C32',
        border: '#1E2A4A',
        text: '#F8FAFC',
        subtle: '#A5B4CF',
        accent: '#38BDF8',
    },
};

const businessFields = [
    'Kuliner & F&B',
    'Fashion & Tekstil',
    'Kerajinan & Handmade',
    'Pertanian & Perkebunan',
    'Perikanan & Peternakan',
    'Jasa & Layanan',
    'Perdagangan & Retail',
    'Teknologi & Digital',
    'Kesehatan & Kecantikan',
    'Lainnya',
];

const employeeCounts = [
    '1-5 orang',
    '6-19 orang',
    '20-99 orang',
    '100+ orang',
];

const trainingModes = [
    'Tatap Muka',
    'Hybrid',
    'Daring',
];

export default function TrainingConsultationScreen() {
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const router = useRouter();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        businessName: '',
        businessField: '',
        employeeCount: '',
        interestedModules: [] as string[],
        preferredMode: '',
        preferredSchedule: '',
        specialNotes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animations
    const meshAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const entryAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Background mesh rotation
        Animated.loop(
            Animated.timing(meshAnim, {
                toValue: 1,
                duration: 15000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Entry animation
        Animated.spring(entryAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const meshRotate = meshAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const floatY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const handleModuleToggle = (moduleId: string) => {
        setFormData(prev => ({
            ...prev,
            interestedModules: prev.interestedModules.includes(moduleId)
                ? prev.interestedModules.filter(id => id !== moduleId)
                : [...prev.interestedModules, moduleId],
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            Alert.alert('Validasi', 'Nama lengkap harus diisi');
            return false;
        }
        if (!formData.email.trim()) {
            Alert.alert('Validasi', 'Email harus diisi');
            return false;
        }
        if (!formData.phone.trim()) {
            Alert.alert('Validasi', 'Nomor telepon harus diisi');
            return false;
        }
        if (!formData.businessName.trim()) {
            Alert.alert('Validasi', 'Nama usaha harus diisi');
            return false;
        }
        if (!formData.businessField) {
            Alert.alert('Validasi', 'Bidang usaha harus dipilih');
            return false;
        }
        if (formData.interestedModules.length === 0) {
            Alert.alert('Validasi', 'Pilih minimal satu modul pelatihan');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const { createSubmission } = require('@/lib/api');

            await createSubmission(user?.token || '', {
                type: 'consultation',
                data: formData
            });

            Alert.alert(
                'Konsultasi Berhasil Dikirim! ✅',
                'Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk mendiskusikan kebutuhan pelatihan lebih lanjut.\n\nTerima kasih atas minat Anda!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error('Submit consultation error:', error);
            Alert.alert(
                'Gagal Mengirim',
                'Terjadi kesalahan saat mengirim konsultasi. Silakan coba lagi.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <Animated.View
                    style={[
                        styles.heroContainer,
                        {
                            opacity: entryAnim,
                            transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
                        }
                    ]}
                >
                    <LinearGradient
                        colors={colors.hero}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        {/* Moving Mesh Layer */}
                        <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
                            <View style={[styles.meshCircle, { top: -50, left: -50, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
                            <View style={[styles.meshCircle, { bottom: -80, right: -40, width: 250, height: 250, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
                        </Animated.View>

                        {/* Floating Icon */}
                        <Animated.View style={[styles.floatingIcon, { bottom: '20%', left: '5%', transform: [{ translateY: Animated.multiply(floatY, -0.8) }] }]}>
                            <Feather name="message-circle" size={80} color="#FFFFFF" style={{ opacity: 0.05 }} />
                        </Animated.View>

                        <View style={styles.heroContent}>
                            <Text style={styles.heroKicker}>PELATIHAN & PENGEMBANGAN UMKM</Text>
                            <View style={styles.heroTitleRow}>
                                <View style={styles.heroTitleIcon}>
                                    <Feather name="book-open" size={24} color="#FFFFFF" />
                                </View>
                                <Text style={styles.heroTitle}>Konsultasi Pelatihan</Text>
                            </View>
                            <Text style={styles.heroSubtitle}>
                                Diskusikan kebutuhan pelatihan usaha Anda dengan tim ahli kami. Kami akan membantu merancang program yang sesuai dengan kebutuhan bisnis Anda.
                            </Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Trust Banner */}
                <Animated.View
                    style={[
                        styles.trustBanner,
                        {
                            opacity: entryAnim,
                            transform: [{ scale: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }]
                        }
                    ]}
                >
                    <View style={styles.trustItem}>
                        <Feather name="users" size={14} color="#6366F1" />
                        <Text style={[styles.trustText, { color: colors.subtle }]}>Mentor Berpengalaman</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Feather name="award" size={14} color="#10B981" />
                        <Text style={[styles.trustText, { color: colors.subtle }]}>Sertifikat Resmi</Text>
                    </View>
                    <View style={styles.trustItem}>
                        <Feather name="clock" size={14} color="#3B82F6" />
                        <Text style={[styles.trustText, { color: colors.subtle }]}>Jadwal Fleksibel</Text>
                    </View>
                </Animated.View>

                {/* Form Card - Informasi Kontak */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            opacity: entryAnim,
                            transform: [{ translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }]
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}15` }]}>
                            <Feather name="user" size={22} color={colors.accent} />
                        </View>
                        <View style={styles.cardHeaderCopy}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Informasi Kontak</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                                Data diri untuk komunikasi lebih lanjut
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Nama Lengkap <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.text,
                                },
                                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            placeholder="Masukkan nama lengkap"
                            placeholderTextColor={colors.subtle}
                            value={formData.fullName}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Email <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.text,
                                },
                                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            placeholder="nama@email.com"
                            placeholderTextColor={colors.subtle}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Nomor Telepon <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.text,
                                },
                                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            placeholder="08xxxxxxxxxx"
                            placeholderTextColor={colors.subtle}
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                        />
                    </View>
                </Animated.View>

                {/* Form Card - Informasi Usaha */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            opacity: entryAnim,
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}15` }]}>
                            <Feather name="briefcase" size={22} color={colors.accent} />
                        </View>
                        <View style={styles.cardHeaderCopy}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Informasi Usaha</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                                Detail bisnis untuk penyesuaian program
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Nama Usaha <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.text,
                                },
                                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            placeholder="Nama usaha/bisnis Anda"
                            placeholderTextColor={colors.subtle}
                            value={formData.businessName}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Bidang Usaha <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.chipGrid}>
                            {businessFields.map((field) => (
                                <TouchableOpacity
                                    key={field}
                                    accessibilityRole="button"
                                    onPress={() => setFormData(prev => ({ ...prev, businessField: field }))}
                                    style={[
                                        styles.chip,
                                        {
                                            borderColor: formData.businessField === field ? colors.accent : colors.border,
                                            backgroundColor: formData.businessField === field ? `${colors.accent}15` : colors.background,
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: formData.businessField === field ? colors.accent : colors.subtle }
                                    ]}>
                                        {field}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Jumlah Karyawan</Text>
                        <View style={styles.chipGrid}>
                            {employeeCounts.map((count) => (
                                <TouchableOpacity
                                    key={count}
                                    accessibilityRole="button"
                                    onPress={() => setFormData(prev => ({ ...prev, employeeCount: count }))}
                                    style={[
                                        styles.chip,
                                        {
                                            borderColor: formData.employeeCount === count ? colors.accent : colors.border,
                                            backgroundColor: formData.employeeCount === count ? `${colors.accent}15` : colors.background,
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: formData.employeeCount === count ? colors.accent : colors.subtle }
                                    ]}>
                                        {count}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                {/* Form Card - Preferensi Pelatihan */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            opacity: entryAnim,
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}15` }]}>
                            <Feather name="book-open" size={22} color={colors.accent} />
                        </View>
                        <View style={styles.cardHeaderCopy}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Preferensi Pelatihan</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.subtle }]}>
                                Pilih modul dan metode yang sesuai
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            Modul yang Diminati <Text style={styles.required}>*</Text>
                        </Text>
                        <Text style={[styles.hint, { color: colors.subtle }]}>Pilih satu atau lebih modul</Text>
                        <View style={styles.checkboxList}>
                            {trainingModules.map((module) => (
                                <TouchableOpacity
                                    key={module.id}
                                    accessibilityRole="button"
                                    onPress={() => handleModuleToggle(module.id)}
                                    style={[
                                        styles.checkboxItem,
                                        {
                                            borderColor: formData.interestedModules.includes(module.id) ? colors.accent : colors.border,
                                            backgroundColor: formData.interestedModules.includes(module.id) ? `${colors.accent}08` : colors.background,
                                        }
                                    ]}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        {
                                            borderColor: formData.interestedModules.includes(module.id) ? colors.accent : colors.border,
                                            backgroundColor: formData.interestedModules.includes(module.id) ? colors.accent : 'transparent',
                                        }
                                    ]}>
                                        {formData.interestedModules.includes(module.id) && (
                                            <Feather name="check" size={14} color="#FFFFFF" />
                                        )}
                                    </View>
                                    <Text style={[styles.checkboxLabel, { color: colors.text }]}>{module.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Mode Pelatihan Preferensi</Text>
                        <View style={styles.chipGrid}>
                            {trainingModes.map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    accessibilityRole="button"
                                    onPress={() => setFormData(prev => ({ ...prev, preferredMode: mode }))}
                                    style={[
                                        styles.chip,
                                        {
                                            borderColor: formData.preferredMode === mode ? colors.accent : colors.border,
                                            backgroundColor: formData.preferredMode === mode ? `${colors.accent}15` : colors.background,
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: formData.preferredMode === mode ? colors.accent : colors.subtle }
                                    ]}>
                                        {mode}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Kebutuhan Khusus / Catatan</Text>
                        <TextInput
                            style={[
                                styles.textarea,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    color: colors.text,
                                },
                                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
                            ]}
                            placeholder="Ceritakan kebutuhan spesifik atau pertanyaan Anda..."
                            placeholderTextColor={colors.subtle}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.specialNotes}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, specialNotes: text }))}
                        />
                    </View>
                </Animated.View>

                {/* Footer Actions */}
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        style={[styles.secondaryButton, { borderColor: colors.border }]}
                    >
                        <Feather name="chevron-left" size={18} color={colors.subtle} />
                        <Text style={[styles.secondaryButtonText, { color: colors.subtle }]}>Kembali</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.85}
                        style={[
                            styles.primaryButton,
                            { backgroundColor: colors.accent, flex: 2 },
                            isSubmitting && styles.primaryButtonDisabled
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Kirim Konsultasi'}
                        </Text>
                        <Feather name="send" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.footerNote, { color: colors.subtle }]}>
                    <Feather name="info" size={12} color={colors.subtle} /> Tim kami akan menghubungi Anda dalam 1-2 hari kerja
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },
    heroContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    hero: {
        padding: 20,
        minHeight: 240,
        justifyContent: 'center',
    },
    meshOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    meshCircle: {
        position: 'absolute',
        borderRadius: 999,
    },
    floatingIcon: {
        position: 'absolute',
        zIndex: -1,
    },
    heroContent: {
        gap: 8,
        marginTop: 12,
    },
    heroKicker: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
        flex: 1,
    },
    heroTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    heroTitleIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    heroSubtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '400',
    },
    trustBanner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.1)',
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    trustText: {
        fontSize: 11,
        fontWeight: '600',
    },
    card: {
        borderRadius: 24,
        padding: 20,
        gap: 20,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
        gap: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
    },
    formGroup: {
        gap: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    required: {
        color: '#EF4444',
    },
    hint: {
        fontSize: 12,
        fontWeight: '400',
        marginTop: -6,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '400',
    },
    textarea: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '400',
        minHeight: 100,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    checkboxList: {
        gap: 10,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    footerRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderRadius: 14,
        paddingVertical: 14,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 14,
        paddingVertical: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    footerNote: {
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: -8,
    },
});
