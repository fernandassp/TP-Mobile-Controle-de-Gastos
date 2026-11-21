import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'InitialBalance'>;

export const InitialBalanceScreen: React.FC<Props> = ({ navigation }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [amountText, setAmountText] = useState('1200,00');

  function parseCurrency(text: string): number {
    const cleaned = text.replace(/\./g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  function handleContinue() {
    navigation.navigate('TopCategories', { initialBalance: parseCurrency(amountText) });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressRow}>
          <View style={[styles.bar, styles.barActive]} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>

        <Text style={styles.title}>Quanto você tem hoje?</Text>
        <Text style={styles.subtitle}>
          Some o que está na conta e na carteira. É o ponto de partida do seu saldo e dá para ajustar depois.
        </Text>

        <Text style={styles.label}>Saldo inicial</Text>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyPrefix}>R$</Text>
          <TextInput
            style={styles.currencyInput}
            keyboardType="decimal-pad"
            value={amountText}
            onChangeText={setAmountText}
          />
        </View>
        <Text style={styles.hint}>Pode ser R$ 0,00 se preferir começar do zero.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('TopCategories', { initialBalance: 0 })}
        >
          <Text style={styles.skipText}>Pular por enquanto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'space-between' },
    content: { padding: 24 },
    progressRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
    barActive: { backgroundColor: colors.primary },
    title: { fontSize: 26, fontWeight: '700', color: colors.title, marginBottom: 8 },
    subtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 28 },
    label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
    currencyBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    currencyPrefix: { fontSize: 20, fontWeight: '600', color: colors.textSecondary, marginRight: 8 },
    currencyInput: { flex: 1, fontSize: 28, fontWeight: '700', color: colors.title },
    hint: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
    footer: { padding: 24, gap: 12 },
    primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    skipButton: { paddingVertical: 10, alignItems: 'center' },
    skipText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  });