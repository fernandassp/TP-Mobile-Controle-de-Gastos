import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { lightColors, darkColors, ThemeColors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage('Preencha seu e-mail e sua senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Que bom ter você de volta.</Text>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>!  {errorMessage}</Text>
          </View>
        )}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, errorMessage && styles.inputError]}
          placeholder="marina@email.com"
          placeholderTextColor={colors.icon}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <View style={[styles.passwordRow, errorMessage && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Sua senha"
            placeholderTextColor={colors.icon}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.bottomLink}>
          <Text style={styles.bottomLinkText}>
            Ainda não tem conta? <Text style={styles.bottomLinkBold}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 24 },
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
    forgotBtn: { alignSelf: 'flex-end', marginTop: 10 },
    forgotText: { color: colors.primaryText, fontSize: 13, fontWeight: '600' },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    primaryButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
    bottomLink: { marginTop: 20, alignItems: 'center' },
    bottomLinkText: { color: colors.textSecondary, fontSize: 14 },
    bottomLinkBold: { color: colors.primaryText, fontWeight: '700' },
  });