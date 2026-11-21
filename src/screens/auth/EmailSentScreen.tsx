import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailSent'>;

export const EmailSentScreen: React.FC<Props> = ({ navigation, route }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { email } = route.params;
  const [resending, setResending] = useState(false);

  async function handleResend() {
    try {
      setResending(true);
      await authService.resetPassword(email);
      Alert.alert('Link reenviado', 'Verifique sua caixa de entrada e a pasta de spam.');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>✉</Text>
        </View>
        <Text style={styles.title}>Confira seu e-mail</Text>
        <Text style={styles.subtitle}>
          Mandamos um link para <Text style={styles.emailBold}>{email}</Text>. Abra o link para criar uma senha nova.
        </Text>
        <Text style={styles.hint}>Não chegou? Dê uma olhada na pasta de spam.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Voltar para entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={styles.secondaryButtonText}>
            {resending ? 'Reenviando...' : 'Enviar de novo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'space-between' },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    iconBox: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.mint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    iconText: { fontSize: 28, color: colors.onMint },
    title: { fontSize: 26, fontWeight: '700', color: colors.title, marginBottom: 12 },
    subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
    emailBold: { color: colors.text, fontWeight: '600' },
    hint: { fontSize: 13, color: colors.textSecondary, marginTop: 20 },
    footer: { padding: 24, gap: 12 },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    secondaryButton: {
      backgroundColor: colors.soft,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  });