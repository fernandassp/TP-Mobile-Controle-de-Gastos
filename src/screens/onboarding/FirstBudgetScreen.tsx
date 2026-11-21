import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FirstBudget'>;

export const FirstBudgetScreen: React.FC<Props> = ({ route }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { selectedCategories } = route.params;
  const { completeOnboarding } = useAuth();

  const [category, setCategory] = useState(selectedCategories[0] || 'Alimentação');
  const [limitText, setLimitText] = useState('1000,00');

  async function handleFinish() {
    await completeOnboarding();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressRow}>
          <View style={[styles.bar, styles.barActive]} />
          <View style={[styles.bar, styles.barActive]} />
          <View style={[styles.bar, styles.barActive]} />
        </View>

        <Text style={styles.title}>Defina seu primeiro limite</Text>
        <Text style={styles.subtitle}>
          Escolha uma categoria e quanto quer gastar nela por mês.
        </Text>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryRow}>
          {selectedCategories.slice(0, 3).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, category === cat && styles.catPillActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catPillText, category === cat && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Limite por mês</Text>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyPrefix}>R$</Text>
          <TextInput
            style={styles.currencyInput}
            keyboardType="decimal-pad"
            value={limitText}
            onChangeText={setLimitText}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔔  Avisamos quando você chegar a 80% do limite, antes de estourar.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>Começar a usar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
          <Text style={styles.skipText}>Fazer isso depois</Text>
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
    subtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 24 },
    label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 12 },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    catPill: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    catPillActive: { backgroundColor: colors.mint, borderColor: colors.primary },
    catPillText: { fontSize: 13, fontWeight: '600', color: colors.text },
    catPillTextActive: { color: colors.onMint },
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
    infoBox: {
      backgroundColor: colors.soft,
      padding: 14,
      borderRadius: 12,
      marginTop: 20,
    },
    infoText: { fontSize: 13, color: colors.text, lineHeight: 19 },
    footer: { padding: 24, gap: 12 },
    primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    skipButton: { paddingVertical: 10, alignItems: 'center' },
    skipText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  });