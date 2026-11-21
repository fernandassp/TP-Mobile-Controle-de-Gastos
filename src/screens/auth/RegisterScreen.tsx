import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) nextErrors.name = 'Informe seu nome.';
    if (!emailRegex.test(email.trim())) nextErrors.email = 'Esse e-mail não parece válido.';
    if (password.length < 8) nextErrors.password = 'A senha precisa ter pelo menos 8 caracteres.';
    if (password !== confirmPassword) nextErrors.confirm = 'As senhas não coincidem.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleRegister() {
    setGeneralError(null);
    if (!validate()) return;

    try {
      setLoading(true);
      await signUp(name, email, password);
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Leva menos de um minuto.</Text>

          {generalError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>!  {generalError}</Text>
            </View>
          )}

          <Text style={styles.label}>Seu nome</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Como quer ser chamado"
            placeholderTextColor={colors.icon}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.fieldError}>!  {errors.name}</Text>}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="voce@email.com"
            placeholderTextColor={colors.icon}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.fieldError}>!  {errors.email}</Text>}

          <Text style={styles.label}>Senha</Text>
          <View style={[styles.passwordRow, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Crie uma senha"
              placeholderTextColor={colors.icon}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.fieldError}>!  {errors.password}</Text>
          ) : (
            <Text style={styles.hint}>Pelo menos 8 caracteres</Text>
          )}

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={[styles.input, errors.confirm && styles.inputError]}
            placeholder="Repita sua senha"
            placeholderTextColor={colors.icon}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errors.confirm && <Text style={styles.fieldError}>!  {errors.confirm}</Text>}

          <TouchableOpacity
            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.bottomLink}>
            <Text style={styles.bottomLinkText}>
              Já tem conta? <Text style={styles.bottomLinkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    scroll: { padding: 24 },
    backBtn: { marginBottom: 16, width: 32 },
    backText: { fontSize: 28, color: colors.title },
    title: { fontSize: 28, fontWeight: '700', color: colors.title },
    subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 4, marginBottom: 24 },
    errorBanner: { backgroundColor: colors.negativeBg, padding: 12, borderRadius: 10, marginBottom: 16 },
    errorBannerText: { color: colors.error, fontSize: 13 },
    label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: 12 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
    },
    passwordInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
    eyeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
    inputError: { borderColor: colors.error },
    fieldError: { color: colors.error, fontSize: 12, marginTop: 4 },
    hint: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 28,
    },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    bottomLink: { marginTop: 20, alignItems: 'center' },
    bottomLinkText: { color: colors.textSecondary, fontSize: 14 },
    bottomLinkBold: { color: colors.primaryText, fontWeight: '700' },
  });