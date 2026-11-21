import { useRouter } from 'expo-router';
import { RegisterScreen } from '../../screens/auth/RegisterScreen';

export default function RegisterRoute() {
  const router = useRouter();
  const navigation: any = {
    goBack: () => router.back(),
    navigate: (screen: string) => {
      if (screen === 'Login') router.push('/(auth)/login');
    },
  };
  return <RegisterScreen navigation={navigation} route={{} as any} />;
}