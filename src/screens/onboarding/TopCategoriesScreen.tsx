import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'TopCategories'>;

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Contas',
  'Moradia',
  'Saúde',
  'Educação',
  'Pets',
];

export const TopCategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { initialBalance } = route.params;
  const [selected, setSelected] = useState<string[]>(['Alimentação', 'Transporte', 'Contas']);

  function toggleCategory(cat: string) {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressRow}>
          <View style={[styles.bar, styles.barActive]} />
          <View style={[styles.bar, styles.barActive]} />
          <View style={styles.bar} />
        </View>

        <Text style={styles.title}>Onde você mais gasta?</Text>
        <Text style={styles.subtitle}>
          Marque as categorias que usa. Elas já ficam à mão na hora de anotar.
        </Text>

        <View style={styles.grid}>
          {DEFAULT_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggleCategory(cat)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {cat} {isSelected ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.hint}>{selected.length} categorias escolhidas</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('FirstBudget', {
              initialBalance,
              selectedCategories: selected.length > 0 ? selected : ['Alimentação'],
            })
          }
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
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
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
      width: '48%',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    chipSelected: { backgroundColor: colors.mint, borderColor: colors.primary },
    chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
    chipTextSelected: { color: colors.onMint },
    hint: { fontSize: 12, color: colors.textSecondary, marginTop: 16 },
    footer: { padding: 24 },
    primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  });