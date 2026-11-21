import { forwardRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, radius, useTheme } from '../theme';
import type { IconName } from '../types';
import { AppText } from './AppText';

export interface InputProps extends TextInputProps {
  label?: string;
  /** Esconde o rótulo visualmente, mas mantém para leitores de tela (ex.: busca). */
  hideLabel?: boolean;
  error?: string;
  leftIcon?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Campo de texto de 52 px com rótulo, ícone opcional e mensagem de erro. */
export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(function Input(
  { label, hideLabel, error, leftIcon, containerStyle, onFocus, onBlur, style, ...rest },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={containerStyle}>
      {label && !hideLabel ? (
        <AppText variant="caption" color="text" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
            importantForAccessibility="no"
          />
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              backgroundColor: colors.bg2,
              borderColor,
              color: colors.text,
              paddingLeft: leftIcon ? 46 : 16,
            },
            style,
          ]}
          {...rest}
        />
      </View>
      {error ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
          <AppText variant="caption" color="error">
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bodySemi, marginBottom: 6 },
  icon: { position: 'absolute', left: 14, top: 16, zIndex: 1 },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingRight: 16,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
});
