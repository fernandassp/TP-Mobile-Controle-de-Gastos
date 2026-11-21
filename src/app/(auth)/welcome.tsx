import { useRouter } from 'expo-router';
import { WelcomeScreen } from '../../screens/auth/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();
  const navigation: any = {
    navigate: (screen: string) => {
      if (screen === 'Register') router.push('/(auth)/register');
      if (screen === 'Login') router.push('/(auth)/login');
    },
  };
  return <WelcomeScreen navigation={navigation} route={{} as any} />;
}