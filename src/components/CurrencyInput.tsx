import { forwardRef } from 'react';
import type { TextInput } from 'react-native';
import { formatBRL } from '../utils/format';
import { Input, type InputProps } from './Input';

interface CurrencyInputProps extends Omit<InputProps, 'value' | 'onChangeText' | 'keyboardType'> {
  /** Valor em reais (ex.: 45.5). */
  value: number;
  onChangeValue: (value: number) => void;
}

/** Máscara automática de reais: digitar 4500 mostra "R$ 45,00". */
export const CurrencyInput = forwardRef<TextInput, CurrencyInputProps>(function CurrencyInput(
  { value, onChangeValue, ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      keyboardType="number-pad"
      value={formatBRL(value)}
      onChangeText={(text) => {
        const digits = text.replace(/\D/g, '').slice(0, 11);
        onChangeValue(Number(digits || '0') / 100);
      }}
      {...rest}
    />
  );
});
