import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { lightColors, darkColors } from '../theme/colors';

export default function HomePlaceholder() {
  const { user, signOut } = useAuth();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.title }]}>Olá, {user?.name}</Text>
      <Text style={[styles.uid, { color: colors.textSecondary }]}>UID: {user?.uid}</Text>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: colors.danger }]}
        onPress={signOut}
      >
        <Text style={styles.logoutText}>Sair da conta (Logout)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  uid: { fontSize: 13, marginBottom: 24 },
  logoutBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  logoutText: { color: '#FFFFFF', fontWeight: '600' },
});