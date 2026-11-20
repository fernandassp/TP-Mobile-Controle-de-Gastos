import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ToastProvider } from '@/components/Toast';
import { useAppFonts } from '@/theme/useAppFonts';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const fontsReady = useAppFonts();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {fontsReady ? (
        <ToastProvider>
          <AppTabs />
        </ToastProvider>
      ) : null}
    </ThemeProvider>
  );
}