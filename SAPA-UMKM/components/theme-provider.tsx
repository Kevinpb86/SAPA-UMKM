import * as FileSystem from 'expo-file-system';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    colorScheme: 'light' | 'dark';
    setTheme: (theme: ThemeMode) => Promise<void>;
    toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const fsCompat = FileSystem as Partial<
    typeof FileSystem & {
        documentDirectory?: string;
        EncodingType?: { UTF8: string };
    }
>;

const STORAGE_ROOT = fsCompat.documentDirectory ?? '';
const THEME_STORAGE_FILE = `${STORAGE_ROOT}theme-preference.json`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceColorScheme = useDeviceColorScheme() ?? 'light';
    const [theme, setThemeState] = useState<ThemeMode>('system');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const info = await FileSystem.getInfoAsync(THEME_STORAGE_FILE);
            if (info.exists) {
                const content = await FileSystem.readAsStringAsync(THEME_STORAGE_FILE);
                const { theme: savedTheme } = JSON.parse(content);
                if (savedTheme) {
                    setThemeState(savedTheme);
                }
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setTheme = async (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        try {
            await FileSystem.writeAsStringAsync(
                THEME_STORAGE_FILE,
                JSON.stringify({ theme: newTheme })
            );
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const toggleTheme = async () => {
        const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
        await setTheme(nextTheme);
    };

    const colorScheme = theme === 'system' ? deviceColorScheme : theme;

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
