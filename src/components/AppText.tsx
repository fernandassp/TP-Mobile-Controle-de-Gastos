import { Text, type TextProps, type TextStyle } from 'react-native';
import { fonts, useTheme, type ThemeColors } from '../theme';

export type TextVariant = 'h1' | 'h2' | 'body' | 'bodyStrong' | 'caption' | 'overline' | 'money';

const variants: Record<TextVariant, TextStyle> = {
  h1: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32 },
  h2: { fontFamily: fonts.displayBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  overline: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  money: { fontFamily: fonts.displayBold, fontSize: 16, lineHeight: 24, fontVariant: ['tabular-nums'] },
};

const defaultColor: Record<TextVariant, keyof ThemeColors> = {
  h1: 'title',
  h2: 'title',
  body: 'text',
  bodyStrong: 'text',
  caption: 'textSecondary',
  overline: 'textSecondary',
  money: 'text',
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  /** Nome de uma cor do tema ou um valor de cor direto (#hex). */
  color?: keyof ThemeColors | (string & {});
}

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const key = color ?? defaultColor[variant];
  const resolved = key in colors ? (colors[key as keyof ThemeColors] as string) : key;
  return (
    <Text
      // Respeita o tamanho de fonte do sistema, mas limita para não quebrar o layout.
      maxFontSizeMultiplier={1.3}
      accessibilityRole={variant === 'h1' || variant === 'h2' ? 'header' : undefined}
      style={[variants[variant], { color: resolved }, style]}
      {...rest}
    />
  );
}
