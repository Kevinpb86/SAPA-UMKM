import { useAuth } from '@/hooks/use-auth';
import { createSubmission } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
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
    background: '#F0FDF4',
    hero: ['#22C55E', '#16A34A'],
    card: '#FFFFFF',
    border: '#DCFCE7',
    text: '#14532D',
    subtle: '#166534',
    accent: '#16A34A',
  },
  dark: {
    background: '#0C1C14',
    hero: ['#16A34A', '#15803D'],
    card: '#14261B',
    border: '#1E3F2A',
    text: '#F0FDF4',
    subtle: '#86EFAC',
    accent: '#22C55E',
  },
};

const legalEntityOptions = ['Koperasi', 'PT', 'CV', 'Yayasan', 'Badan Usaha Lain'];

type LpdbForm = {
  institutionName: string;
  legalEntity: string;
  establishedSince: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessFocus: string;
  requestedFund: string;
  fundUsagePlan: string;
  collateralSummary: string;
  financialStatementLink: string;
};

const defaultForm: LpdbForm = {
  institutionName: '',
  legalEntity: 'Koperasi',
  establishedSince: '',
  address: '',
  contactPerson: '',
  phone: '',
  email: '',
  businessFocus: '',
  requestedFund: '',
  fundUsagePlan: '',
  collateralSummary: '',
  financialStatementLink: '',
};

export default function LpdbServiceFormScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<LpdbForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  // Animations
  const meshAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesh rotation
    Animated.loop(
      Animated.timing(meshAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating loop
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

    // Fade-in entry
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 20,
      friction: 8,
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

  const handleChange = <K extends keyof LpdbForm>(key: K, value: LpdbForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const validateForm = () => {
    const requiredFields: Array<keyof LpdbForm> = [
      'institutionName',
      'legalEntity',
      'contactPerson',
      'phone',
      'businessFocus',
      'requestedFund',
      'fundUsagePlan',
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon isi data lembaga, kontak, fokus usaha, dan kebutuhan dana.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'lpdb',
        data: form
      });
      Alert.alert(
        'Pengajuan tersimpan',
        'Permohonan dana bergulir LPDB telah tercatat. Tim kami akan menghubungi untuk tahapan evaluasi lanjutan.',
      );
      resetForm();
    } catch (error) {
      Alert.alert('Gagal mengirim', error instanceof Error ? error.message : 'Terjadi gangguan saat mengirim data.');
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
              <Animated.View style={[styles.meshOverlay, { transform: [{ rotate: meshRotate }, { scale: 1.5 }] }]}>
                <View style={[styles.meshCircle, { top: -80, right: -40, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
                <View style={[styles.meshCircle, { bottom: -120, left: -60, width: 320, height: 320, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
              </Animated.View>

              <Animated.View style={[styles.floatingIcon, { top: '15%', right: '10%', transform: [{ translateY: floatY }] }]}>
                <Feather name="pie-chart" size={80} color="#FFFFFF" style={{ opacity: 0.1 }} />
              </Animated.View>

              <View style={styles.heroContent}>
                <Text style={styles.heroKicker}>PENDANAAN</Text>
                <Text style={styles.heroTitle}>Dana Bergulir (LPDB)</Text>
                <Text style={styles.heroSubtitle}>
                  Perkuat fundamental koperasi dan UMKM Anda melalui pembiayaan dana bergulir yang kompetitif untuk keberlanjutan ekonomi rakyat.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Profil Lembaga"
              subtitle="Informasi dasar mengenai badan usaha pengaju dana LPDB."
              icon="layers"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Lembaga / Koperasi"
                icon="layers"
                placeholder="Nama lengkap lembaga"
                value={form.institutionName}
                onChangeText={value => handleChange('institutionName', value)}
                colors={colors}
              />
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Bentuk Badan Hukum</Text>
                <View style={styles.pillGroup}>
                  {legalEntityOptions.map(option => {
                    const active = option === form.legalEntity;
                    return (
                      <TouchableOpacity
                        key={option}
                        accessibilityRole="button"
                        onPress={() => handleChange('legalEntity', option)}
                        style={[
                          styles.pill,
                          {
                            backgroundColor: `${colors.subtle}08`,
                            borderColor: 'transparent',
                          },
                          active && {
                            borderColor: colors.accent,
                            backgroundColor: `${colors.accent}15`,
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
              <LabeledInput
                label="Berdiri Sejak"
                icon="calendar"
                placeholder="Contoh: 2012"
                value={form.establishedSince}
                onChangeText={value => handleChange('establishedSince', value)}
                colors={colors}
              />
              <LabeledInput
                label="Alamat Kantor"
                icon="map-pin"
                placeholder="Alamat lengkap operasional"
                value={form.address}
                onChangeText={value => handleChange('address', value)}
                colors={colors}
                multiline
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Kontak Utama"
              subtitle="Penanggung jawab yang dapat dihubungi."
              icon="user"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Nama Penanggung Jawab"
                icon="user"
                placeholder="Nama lengkap PIC"
                value={form.contactPerson}
                onChangeText={value => handleChange('contactPerson', value)}
                colors={colors}
              />
              <LabeledInput
                label="Nomor Telepon"
                icon="phone"
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={value => handleChange('phone', value)}
                colors={colors}
              />
              <LabeledInput
                label="Email Aktif"
                icon="mail"
                placeholder="contoh: kontak@lembaga.id"
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => handleChange('email', value)}
                colors={colors}
              />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionHeader
              colors={colors}
              title="Profil Usaha & Kebutuhan Dana"
              subtitle="Gambaran fokus usaha dan rencana penggunaan dana bergulir."
              icon="briefcase"
            />
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Fokus Usaha / Bidang Layanan"
                icon="briefcase"
                placeholder="Contoh: Produksi pangan olahan, jasa simpan pinjam"
                value={form.businessFocus}
                onChangeText={value => handleChange('businessFocus', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Nilai Dana Dimohon"
                icon="dollar-sign"
                placeholder="Contoh: Rp 500.000.000"
                value={form.requestedFund}
                onChangeText={value => handleChange('requestedFund', value)}
                colors={colors}
              />
              <LabeledInput
                label="Rencana Penggunaan Dana"
                icon="file-text"
                placeholder="Uraikan alokasi dana: modal kerja, investasi alat, ekspansi pasar, dsb."
                value={form.fundUsagePlan}
                onChangeText={value => handleChange('fundUsagePlan', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Ringkasan Agunan / Jaminan (opsional)"
                icon="shield"
                placeholder="Contoh: Sertifikat tanah, aset bergerak, rekening escrow"
                value={form.collateralSummary}
                onChangeText={value => handleChange('collateralSummary', value)}
                colors={colors}
                multiline
              />
              <LabeledInput
                label="Tautan Laporan Keuangan (opsional)"
                icon="link"
                placeholder="Contoh: https://drive.google.com/xxxx"
                value={form.financialStatementLink}
                onChangeText={value => handleChange('financialStatementLink', value)}
                colors={colors}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                    borderColor: colors.border,
                    borderWidth: 1,
                  }
                ]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
                style={styles.modalSubmitWrapper}
              >
                <LinearGradient
                  colors={submitting ? [`${colors.accent}CC`, `${colors.accent}CC`] : [`${colors.accent}`, `${colors.accent}EE`]}
                  style={styles.modalSubmitBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Kirim Pengajuan'}</Text>
                  <Feather name={submitting ? 'loader' : 'send'} size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type SectionHeaderProps = {
  colors: typeof palette.light;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

function SectionHeader({ colors, title, subtitle, icon }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: `${colors.accent}12` }]}>
        <Feather name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.sectionCopy}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtle }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

type LabeledInputProps = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  colors,
  multiline,
  keyboardType = 'default',
}: LabeledInputProps) {
  const scheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', colors.accent],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', `${colors.accent}04`],
  });

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle, opacity: isFocused ? 1 : 0.8 }]}>{label}</Text>
      <Animated.View style={[
        styles.inputInner,
        {
          backgroundColor,
          borderColor,
          transform: [{ scale: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) }],
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }),
          shadowRadius: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
          elevation: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }),
        }
      ]}>
        <View style={[styles.inputIcon, { top: multiline ? 16 : 14 }]}>
          <Feather name={icon} size={18} color={isFocused ? colors.accent : colors.subtle} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${colors.subtle}80`}
          multiline={multiline}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? 96 : 48,
              paddingLeft: 48,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)
          ]}
        />
      </Animated.View>
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
    padding: 20,
    gap: 20,
  },
  heroContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  hero: {
    padding: 24,
    minHeight: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
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
    zIndex: 0,
  },
  heroContent: {
    gap: 8,
    zIndex: 2,
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    borderRadius: 32,
    padding: 24,
    gap: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.7,
  },
  fieldGroup: {
    gap: 20,
  },
  inputWrapper: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitWrapper: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubmitWrapper: {
    flex: 2,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
