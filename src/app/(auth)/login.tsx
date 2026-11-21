import { useRouter } from 'expo-router';
import { LoginScreen } from '../../screens/auth/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();
  const navigation: any = {
    goBack: () => router.back(),
    navigate: (screen: string) => {
      if (screen === 'ForgotPassword') router.push('/(auth)/forgot-password');
      if (screen === 'Register') router.push('/(auth)/register');
    },
  };
  return <LoginScreen navigation={navigation} route={{} as any} />;
}