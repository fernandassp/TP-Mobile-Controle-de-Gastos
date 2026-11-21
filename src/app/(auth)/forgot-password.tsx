import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '../../screens/auth/ForgotPasswordScreen';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const navigation: any = {
    goBack: () => router.back(),
    navigate: (screen: string, params?: { email: string }) => {
      if (screen === 'EmailSent') {
        router.push({ pathname: '/(auth)/email-sent', params });
      }
    },
  };
  return <ForgotPasswordScreen navigation={navigation} route={{} as any} />;
}