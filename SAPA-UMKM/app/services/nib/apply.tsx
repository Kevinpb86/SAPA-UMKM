import { useAuth } from '@/hooks/use-auth';
import { createSubmission } from '@/lib/api';
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
    background: '#F5F8FF',
    card: '#FFFFFF',
    border: '#D8E3FF',
    text: '#0F1B3A',
    subtle: '#5E6B8D',
    accent: '#1D4ED8',
  },
  dark: {
    background: '#0B1224',
    card: '#111C32',
    border: '#1E2A4A',
    text: '#F8FAFC',
    subtle: '#A5B4CF',
    accent: '#60A5FA',
  },
};

const businessSectors = ['Perdagangan Umum', 'Kuliner dan Makanan', 'Jasa Kreatif', 'Manufaktur', 'Pertanian & Perkebunan'];
const capitalScales = ['Mikro (< Rp 1 Miliar)', 'Kecil (Rp 1-5 Miliar)', 'Menengah (Rp 5-10 Miliar)', 'Besar (> Rp 10 Miliar)'];

export default function NibApplyScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [owner, setOwner] = useState({
    nik: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [business, setBusiness] = useState({
    name: '',
    form: '',
    address: '',
    sector: '',
    capital: '',
  });

  const handleSubmit = async () => {
    if (!owner.nik || !owner.fullName || !owner.email || !business.name || !business.sector) {
      Alert.alert('Data belum lengkap', 'Mohon lengkapi minimal data pemilik dan data usaha utama.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSubmission(user.token, {
        type: 'nib',
        data: {
          owner,
          business
        }
      });
      Alert.alert('Sukses', 'Pengajuan NIB berhasil dikirim. Silakan cek status di dashboard Anda.', [
        { text: 'OK', onPress: () => router.replace('/user/dashboard') }
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Gagal mengirim pengajuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              style={[styles.backButton, { borderColor: colors.border }]}>
              <Feather name="arrow-left" size={18} color={colors.accent} />
              <Text style={[styles.backText, { color: colors.accent }]}>Kembali</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Feather name="file-text" size={32} color={colors.accent} />
              <Text style={[styles.title, { color: colors.text }]}>Form Pengajuan NIB</Text>
              <Text style={[styles.subtitle, { color: colors.subtle }]}>
                Isi data sesuai dokumen resmi untuk mempercepat penerbitan Nomor Induk Berusaha.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Pemilik Usaha</Text>
              <View style={styles.fieldGroup}>
                <LabeledInput
                  label="NIK (Nomor Induk Kependudukan)"
                  value={owner.nik}
                  onChangeText={value => setOwner(prev => ({ ...prev, nik: value }))}
                  placeholder="Masukkan 16 digit NIK"
                  keyboardType="number-pad"
                  colors={colors}
                />
                <LabeledInput
                  label="Nama Lengkap"
                  value={owner.fullName}
                  onChangeText={value => setOwner(prev => ({ ...prev, fullName: value }))}
                  placeholder="Sesuai KTP"
                  colors={colors}
                />
                <LabeledInput
                  label="Email Aktif"
                  value={owner.email}
                  onChangeText={value => setOwner(prev => ({ ...prev, email: value }))}
                  placeholder="contoh: pelaku@umkm.id"
                  keyboardType="email-address"
                  colors={colors}
                />
                <LabeledInput
                  label="Nomor Telepon"
                  value={owner.phone}
                  onChangeText={value => setOwner(prev => ({ ...prev, phone: value }))}
                  placeholder="08xxxxxxxxxx"
                  keyboardType="phone-pad"
                  colors={colors}
                />
                <LabeledInput
                  label="Alamat Domisili"
                  value={owner.address}
                  onChangeText={value => setOwner(prev => ({ ...prev, address: value }))}
                  placeholder="Alamat domisili sesuai KTP"
                  multiline
                  colors={colors}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usaha</Text>
              <View style={styles.fieldGroup}>
                <LabeledInput
                  label="Nama Usaha"
                  value={business.name}
                  onChangeText={value => setBusiness(prev => ({ ...prev, name: value }))}
                  placeholder="Nama brand atau toko"
                  colors={colors}
                />
                <LabeledInput
                  label="Bentuk Usaha"
                  value={business.form}
                  onChangeText={value => setBusiness(prev => ({ ...prev, form: value }))}
                  placeholder="PT/CV/Firma/Koperasi/Perorangan"
                  colors={colors}
                />
                <LabeledInput
                  label="Alamat Operasional"
                  value={business.address}
                  onChangeText={value => setBusiness(prev => ({ ...prev, address: value }))}
                  placeholder="Alamat lokasi usaha"
                  multiline
                  colors={colors}
                />
                <SelectField
                  label="Sektor Usaha"
                  value={business.sector}
                  placeholder="Pilih sektor usaha"
                  options={businessSectors}
                  onSelect={value => setBusiness(prev => ({ ...prev, sector: value }))}
                  colors={colors}
                />
                <SelectField
                  label="Skala Modal"
                  value={business.capital}
                  placeholder="Pilih skala modal"
                  options={capitalScales}
                  onSelect={value => setBusiness(prev => ({ ...prev, capital: value }))}
                  colors={colors}
                />
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitButton, { backgroundColor: colors.accent, opacity: isSubmitting ? 0.7 : 1 }]}>
              <Text style={styles.submitText}>{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan NIB'}</Text>
              {!isSubmitting && <Feather name="send" size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  colors: typeof palette.light;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
};

function LabeledInput({ label, value, placeholder, onChangeText, colors, multiline, keyboardType = 'default' }: LabeledInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${colors.subtle}80`}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card, minHeight: multiline ? 96 : 48 }]}
      />
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  colors: typeof palette.light;
};

function SelectField({ label, value, placeholder, options, onSelect, colors }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.subtle }]}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setOpen(!open)}
        style={[styles.selectButton, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <Text style={{ color: value ? colors.text : `${colors.subtle}80` }}>{value || placeholder}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.subtle} />
      </TouchableOpacity>
      {open && (
        <View style={[styles.optionList, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          {options.map(option => (
            <TouchableOpacity
              key={option}
              accessibilityRole="button"
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
              style={styles.optionItem}
            >
              <Text style={{ color: colors.text }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  selectButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionList: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
