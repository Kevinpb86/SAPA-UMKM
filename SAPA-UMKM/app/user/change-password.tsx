import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
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

const palette = {
    light: {
        background: '#F5F7FB',
        surface: '#FFFFFF',
        primary: '#1B5CC4',
        text: '#0F1B3A',
        subtle: '#66728F',
        border: '#E1E6F3',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        primary: '#3B82F6',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        border: '#273449',
    },
};

export default function ChangePasswordScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            Alert.alert('Error', 'Mohon isi semua kolom.');
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok.');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Sukses', 'Kata sandi berhasil diperbarui.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Ubah Kata Sandi</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Kata Sandi Saat Ini</Text>
                            <TextInput
                                secureTextEntry
                                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                                value={form.currentPassword}
                                onChangeText={(t) => setForm(prev => ({ ...prev, currentPassword: t }))}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Kata Sandi Baru</Text>
                            <TextInput
                                secureTextEntry
                                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                                value={form.newPassword}
                                onChangeText={(t) => setForm(prev => ({ ...prev, newPassword: t }))}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Konfirmasi Kata Sandi Baru</Text>
                            <TextInput
                                secureTextEntry
                                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                                value={form.confirmPassword}
                                onChangeText={(t) => setForm(prev => ({ ...prev, confirmPassword: t }))}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            style={[styles.button, { backgroundColor: colors.primary }]}>
                            <Text style={styles.buttonText}>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    button: {
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
