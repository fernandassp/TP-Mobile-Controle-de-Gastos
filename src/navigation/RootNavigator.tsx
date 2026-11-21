import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

const PlaceholderMainApp: React.FC = () => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { user, signOut } = useAuth();
  return (
    <View style={styles.placeholder}>
      <Text style={styles.welcome}>Olá, {user?.name}</Text>
      <Text style={styles.uid}>UID: {user?.uid}</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Sair da conta (Logout)</Text>
      </TouchableOpacity>
    </View>
  );
};

export const RootNavigator: React.FC = () => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { user, loading, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : !hasCompletedOnboarding ? (
        <OnboardingNavigator />
      ) : (
        <PlaceholderMainApp />
      )}
    </NavigationContainer>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
    placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.bg },
    welcome: { fontSize: 22, fontWeight: '700', color: colors.title, marginBottom: 8 },
    uid: { fontSize: 13, color: colors.textSecondary, marginBottom: 24 },
    logoutBtn: { backgroundColor: colors.danger, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
    logoutText: { color: '#FFFFFF', fontWeight: '600' },
  });