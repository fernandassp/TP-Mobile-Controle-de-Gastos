import React, { useEffect } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { lightColors, darkColors } from '../theme/colors';

function AuthGuard() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (user && !hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace('/(onboarding)/initial-balance');
    } else if (user && hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/');
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
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}