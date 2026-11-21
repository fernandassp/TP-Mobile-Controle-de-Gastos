import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>◈</Text>
        </View>

        <Text style={styles.title}>Saiba para onde{'\n'}vai o seu dinheiro.</Text>
        <Text style={styles.subtitle}>
          Anote receitas e despesas, acompanhe seus limites e entenda seu mês sem planilhas.
        </Text>

        <View style={styles.bullets}>
          <Text style={styles.bulletItem}>✓  Registre um gasto em segundos</Text>
          <Text style={styles.bulletItem}>◔  Veja para onde vai cada real</Text>
          <Text style={styles.bulletItem}>!  Receba aviso antes de estourar o limite</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.header, justifyContent: 'space-between' },
    content: { paddingHorizontal: 24, paddingTop: 48 },
    logoBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.mint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    logoText: { color: colors.onMint, fontSize: 24, fontWeight: 'bold' },
    title: { color: '#F1F7F5', fontSize: 30, fontWeight: '700', lineHeight: 36, marginBottom: 16 },
    subtitle: { color: '#A9BFBC', fontSize: 15, lineHeight: 22, marginBottom: 32 },
    bullets: { gap: 16 },
    bulletItem: { color: '#F1F7F5', fontSize: 14 },
    footer: { padding: 24, gap: 12 },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    secondaryButton: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    secondaryButtonText: { color: '#F1F7F5', fontSize: 16, fontWeight: '600' },
  });