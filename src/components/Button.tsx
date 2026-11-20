import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, useTheme } from '../theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Ícone opcional à esquerda do texto. */
  icon?: ReactNode;
  /** false = largura do conteúdo (ex.: botão dentro de estado vazio). */
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Botão de 48 px. Só um principal por tela; o destrutivo é para ações sem volta. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  fullWidth = true,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = !!disabled || !!loading;

  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : colors.soft;
  const fg = variant === 'primary' ? colors.onPrimary : variant === 'danger' ? '#FFFFFF' : colors.text;
  const border = variant === 'secondary' ? colors.border : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed && variant === 'primary' ? colors.primaryHover : bg,
          borderColor: border,
          opacity: isDisabled ? 0.4 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'center',
          paddingHorizontal: fullWidth ? 16 : 24,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {icon}
          <AppText variant="bodyStrong" color={fg}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
