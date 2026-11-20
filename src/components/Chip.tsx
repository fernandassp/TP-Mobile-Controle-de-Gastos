import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius, useTheme } from '../theme';
import type { IconName } from '../types';
import { AppText } from './AppText';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** "radio" para escolha única, "checkbox" para múltipla, "button" para ações. */
  role?: 'radio' | 'checkbox' | 'button';
  /** Número exibido em um selo (ex.: quantidade de filtros ativos). */
  badge?: number;
  height?: number;
}

/** Chip/pílula usado em filtros e seletores. */
export function Chip({ label, selected, onPress, icon, role = 'radio', badge, height = 40 }: ChipProps) {
  const { colors } = useTheme();
  const fg = selected ? colors.onMint : colors.text;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 2, bottom: 2 }}
      accessibilityRole={role}
      accessibilityState={role === 'button' ? undefined : { checked: !!selected }}
      accessibilityLabel={badge ? `${label}, ${badge} ativos` : label}
      style={({ pressed }) => [
        styles.chip,
        {
          height,
          backgroundColor: selected ? colors.mint : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {selected && role !== 'button' ? <Ionicons name="checkmark" size={16} color={fg} /> : null}
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <AppText variant="caption" color={fg} style={styles.label}>
        {label}
      </AppText>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <AppText variant="caption" color={colors.onPrimary} style={styles.badgeText}>
            {badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  label: { fontWeight: '600' },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
});
