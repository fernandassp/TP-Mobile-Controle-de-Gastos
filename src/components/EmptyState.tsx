import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';
import type { IconName } from '../types';
import { AppText } from './AppText';
import { Button } from './Button';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** "secondary" para ações leves, como "Limpar filtros". */
  actionVariant?: 'primary' | 'secondary';
}

/** Estado vazio padrão: ícone, título, explicação e (opcional) uma ação. */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconBox, { backgroundColor: colors.soft }]}>
        <Ionicons name={icon} size={28} color={colors.title} />
      </View>
      <AppText variant="h2" style={styles.center}>
        {title}
      </AppText>
      <AppText variant="caption" style={[styles.center, styles.description]}>
        {description}
      </AppText>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant={actionVariant} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingVertical: 28, paddingHorizontal: 12 },
  iconBox: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  description: { maxWidth: 260 },
  action: { marginTop: 6 },
});
