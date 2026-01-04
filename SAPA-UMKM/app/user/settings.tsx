import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';

const palette = {
    light: {
        background: '#F5F7FB',
        surface: '#FFFFFF',
        primary: '#1B5CC4',
        text: '#0F1B3A',
        subtle: '#66728F',
        border: '#E1E6F3',
        danger: '#EF4444',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        primary: '#3B82F6',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        border: '#273449',
        danger: '#F87171',
    },
};

export default function SettingsScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const { logout } = useAuth();

    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);
    const [darkMode, setDarkMode] = useState(scheme === 'dark');

    const handleLogout = async () => {
        Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Keluar',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/');
                },
            },
        ]);
    };

    const sections = [
        {
            title: 'Preferensi',
            items: [
                {
                    label: 'Notifikasi Push',
                    icon: 'bell',
                    type: 'toggle',
                    value: notifications,
                    onValueChange: setNotifications,
                },
                {
                    label: 'Tema Gelap',
                    icon: 'moon',
                    type: 'toggle',
                    value: darkMode,
                    onValueChange: setDarkMode,
                },
            ],
        },
        {
            title: 'Keamanan',
            items: [
                {
                    label: 'Ubah Kata Sandi',
                    icon: 'lock',
                    type: 'link',
                    onPress: () => router.push('/user/change-password'),
                },
                {
                    label: 'Biometrik / Face ID',
                    icon: 'smartphone',
                    type: 'toggle',
                    value: biometrics,
                    onValueChange: setBiometrics,
                },
            ],
        },
        {
            title: 'Tentang',
            items: [
                {
                    label: 'Pusat Bantuan',
                    icon: 'help-circle',
                    type: 'link',
                    onPress: () => router.push('/user/help'),
                },
                {
                    label: 'Syarat & Ketentuan',
                    icon: 'file-text',
                    type: 'link',
                    onPress: () => router.push('/user/terms'),
                },
                {
                    label: 'Versi Aplikasi',
                    icon: 'info',
                    type: 'value',
                    value: '1.0.0',
                },
            ],
        },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Pengaturan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {sections.map((section, index) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.subtle }]}>{section.title}</Text>
                        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {section.items.map((item: any, idx) => (
                                <View key={item.label}>
                                    <TouchableOpacity
                                        disabled={item.type === 'toggle' || item.type === 'value'}
                                        onPress={item.onPress}
                                        style={styles.itemRow}
                                    >
                                        <View style={styles.itemLeft}>
                                            <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
                                                <Feather name={item.icon as any} size={18} color={colors.primary} />
                                            </View>
                                            <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
                                        </View>

                                        {item.type === 'toggle' && (
                                            <Switch
                                                value={item.value}
                                                onValueChange={item.onValueChange}
                                                trackColor={{ false: '#CBD5E1', true: colors.primary }}
                                                thumbColor="#FFFFFF"
                                            />
                                        )}

                                        {item.type === 'link' && <Feather name="chevron-right" size={20} color={colors.subtle} />}

                                        {item.type === 'value' && (
                                            <Text style={[styles.itemValue, { color: colors.subtle }]}>{item.value}</Text>
                                        )}
                                    </TouchableOpacity>
                                    {idx < section.items.length - 1 && (
                                        <View style={[styles.separator, { backgroundColor: colors.border }]} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                    <Feather name="log-out" size={20} color={colors.danger} />
                    <Text style={[styles.logoutText, { color: colors.danger }]}>Keluar Aplikasi</Text>
                </TouchableOpacity>

                <Text style={[styles.footerText, { color: colors.subtle }]}>
                    SAPA UMKM © 2024
                </Text>
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
    section: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    sectionContent: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        minHeight: 56,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 14,
    },
    separator: {
        height: 1,
        marginLeft: 60,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 8,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 8,
    },
});
