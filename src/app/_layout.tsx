import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments, Href } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../components';
import { useTheme } from '../theme';

function AuthGuard() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === '(auth)';
    const inOnboardingGroup = firstSegment === '(onboarding)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/welcome' as Href);
    } else if (user && !hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace('/(onboarding)/initial-balance' as Href);
    } else if (user && hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/' as Href);
    }
  }, [user, loading, hasCompletedOnboarding, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <AuthGuard />
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}