import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
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
import { Feather } from '@expo/vector-icons';

const palette = {
  light: {
    background: '#F6F3FF',
    hero: ['#7C3AED', '#6366F1'],
    card: '#FFFFFF',
    border: '#DED6FF',
    text: '#1F1033',
    subtle: '#55497A',
    accent: '#7C3AED',
  },
  dark: {
    background: '#130B26',
    hero: ['#5B21B6', '#4338CA'],
    card: '#1B1235',
    border: '#2E1F54',
    text: '#F5F3FF',
    subtle: '#D1C4FF',
    accent: '#A855F7',
  },
};

type ForumForm = {
  participantName: string;
  email: string;
  businessName: string;
  sector: string;
  topics: string;
  expectations: string;
  preferredChannel: string;
};

const defaultForm: ForumForm = {
  participantName: '',
  email: '',
  businessName: '',
  sector: '',
  topics: '',
  expectations: '',
  preferredChannel: 'Grup WhatsApp',
};

const channelOptions = ['Grup WhatsApp', 'Telegram', 'Forum Web', 'Sesi Zoom Bulanan'];

export default function CommunityForumScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();

  const [form, setForm] = useState<ForumForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof ForumForm>(key: K, value: ForumForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof ForumForm> = ['participantName', 'email', 'businessName', 'topics'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Isi nama peserta, email, nama usaha, dan topik diskusi yang diminati.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      Alert.alert(
        'Pendaftaran forum berhasil',
        'Undangan forum komunikasi akan dikirim melalui kanal yang Anda pilih.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', 'Terjadi kendala saat menyimpan data. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
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
              <Text style={styles.backText}>Kembali</Text>
            </TouchableOpacity>
            <Text style={styles.heroKicker}>Forum Komunikasi & Diskusi</Text>
            <Text style={styles.heroTitle}>Temukan Solusi Bersama Komunitas UMKM</Text>
            <Text style={styles.heroSubtitle}>
              Berbagi tantangan, strategi, dan peluang baru bersama pelaku usaha lainnya melalui sesi diskusi rutin dan
              grup komunitas daring.
            </Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="message-circle" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Apa yang Akan Anda Dapatkan?</Text>
            </View>
            <View style={styles.sectionBody}>
              <InfoRow colors={colors} icon="users" text="Ruangan diskusi tematik mingguan bersama fasilitator." />
              <InfoRow colors={colors} icon="headphones" text="Sesi tanya jawab langsung dengan narasumber ahli." />
              <InfoRow colors={colors} icon="share-2" text="Kolaborasi lintas komunitas untuk peluang kemitraan baru." />
            </View>
            <View style={styles.divider} />
            <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>
              Panduan singkat: hormati peserta lain, jaga kerahasiaan data bisnis, dan gunakan bahasa yang sopan selama
              diskusi berlangsung.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${colors.accent}12` }]}>
                <Feather name="edit-3" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Form Registrasi Forum</Text>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Peserta"
                placeholder="Nama lengkap"
                value={form.participantName}
                onChangeText={value => handleChange('participantName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email"
                placeholder="contoh: anggota@umkm.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nama Usaha"
                placeholder="Nama brand atau komunitas"
                value={form.businessName}
                onChangeText={value => handleChange('businessName', value)}
                colors={colors}
              />
              <LabeledInput
                label="Sektor / Bidang Usaha"
                placeholder="Contoh: Kuliner, Fashion, Layanan Digital"
                value={form.sector}
                onChangeText={value => handleChange('sector', value)}
                colors={colors}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.subtle }]}>Preferensi Kanal Diskusi</Text>
              <View style={styles.pillGroup}>
                {channelOptions.map(option => {
                  const active = option === form.preferredChannel;
                  return (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      onPress={() => handleChange('preferredChannel', option)}
                      style={[
                        styles.pill,
                        {
                          borderColor: active ? colors.accent : colors.border,
                          backgroundColor: active ? `${colors.accent}1A` : colors.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: active ? colors.accent : colors.subtle },
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Topik Diskusi yang Diminati"
                placeholder="Contoh: Strategi pemasaran digital, akses permodalan"
                value={form.topics}
                onChangeText={value => handleChange('topics', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Harapan Mengikuti Forum (opsional)"
                placeholder="Kolaborasi reseller, insight branding, dukungan logistik, dll."
                value={form.expectations}
                onChangeText={value => handleChange('expectations', value)}
                colors={colors}
                multiline
              />
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={submitting}
              style={[
                styles.submitButton,
                { backgroundColor: colors.accent, opacity: submitting ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.submitText}>{submitting ? 'Mengirim...' : 'Masuk Forum'}</Text>
              <Feather name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LabeledInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
  colors,
  multiline,
  keyboardType = 'default',
}: LabeledInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${colors.subtle}80`}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.text,
            minHeight: multiline ? 96 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
    </View>
  );
}

type InfoRowProps = {
  colors: typeof palette.light;
  icon: React.ComponentProps<typeof Feather>['name'];
  text: string;
};

function InfoRow({ colors, icon, text }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={16} color={colors.accent} />
      <Text style={[styles.infoText, { color: colors.subtle }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flexOne: {
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
    backgroundColor: 'rgba(31, 15, 51, 0.25)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroKicker: {
    color: 'rgba(237, 233, 254, 0.92)',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(240, 240, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBody: {
    gap: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});


