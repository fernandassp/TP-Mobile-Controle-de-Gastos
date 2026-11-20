import { Platform, useColorScheme, type ViewStyle } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';

export { darkColors, lightColors };
export type { ThemeColors };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const radius = { sm: 10, md: 12, lg: 14, xl: 18, xxl: 28, pill: 100 } as const;

/** Largura máxima do conteúdo (tablets e telas largas ficam centralizados). */
export const MAX_CONTENT_WIDTH = 600;

/** Nomes registrados em useAppFonts (Manrope para títulos e valores, Inter para texto). */
export const fonts = {
  display: 'Manrope_800ExtraBold',
  displayBold: 'Manrope_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
} as const;

/** Sombra de card que funciona em iOS (shadow*) e Android (elevation). */
export function cardShadow(isDark: boolean): ViewStyle {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: isDark ? '#000000' : '#123B46',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 12,
    };
  }
  return { elevation: isDark ? 0 : 2 };
}

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
