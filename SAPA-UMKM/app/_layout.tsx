import { DarkTheme, DefaultTheme, ThemeProvider as ThemeProviderNative } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}

function InnerLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProviderNative value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="services/[category]" options={{ headerShown: false }} />
          <Stack.Screen name="services/nib" options={{ headerShown: false }} />
          <Stack.Screen name="services/nib/apply" options={{ headerShown: false }} />
          <Stack.Screen name="services/merek" options={{ headerShown: false }} />
          <Stack.Screen name="services/sertifikasi" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProviderNative>
    </AuthProvider>
  );
}
