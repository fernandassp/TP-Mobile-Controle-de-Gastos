import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';
import type { IconName, TipoLancamento } from '../types';
import { formatSigned } from '../utils/format';
import { AppText } from './AppText';

interface TransactionRowProps {
  title: string;
  subtitle: string;
  valor: number;
  tipo: TipoLancamento;
  icon: IconName;
  onPress?: () => void;
  /** Linha separadora inferior (não use na última linha do cartão). */
  divider?: boolean;
}

/** Linha de lançamento: ícone da categoria, descrição, categoria · hora e valor. */
export function TransactionRow({ title, subtitle, valor, tipo, icon, onPress, divider }: TransactionRowProps) {
  const { colors } = useTheme();
  const income = tipo === 'receita';
  const amount = formatSigned(tipo, valor);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}, ${income ? 'receita' : 'despesa'} de ${amount.slice(2)}`}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: income ? colors.positiveBg : colors.soft }]}>
        <Ionicons name={icon} size={22} color={income ? colors.positive : colors.title} />
      </View>
      <View style={styles.texts}>
        <AppText variant="body" numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="caption" numberOfLines={1}>
          {subtitle}
        </AppText>
      </View>
      <AppText variant="money" color={income ? 'positive' : 'negative'}>
        {amount}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 8 },
  icon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, minWidth: 0 },
  title: { fontWeight: '500' },
});
