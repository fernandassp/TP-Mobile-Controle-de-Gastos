import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { cardShadow, radius, useTheme } from '../theme';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  /** Remove o padding interno (útil para listas que vão até a borda). */
  flush?: boolean;
}

export function Card({ style, flush, ...rest }: CardProps) {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={[
        styles.card,
        cardShadow(isDark),
        { backgroundColor: colors.card },
        flush ? styles.flush : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 16 },
  flush: { paddingVertical: 0 },
});
