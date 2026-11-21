import { useRouter, useLocalSearchParams } from 'expo-router';
import { EmailSentScreen } from '../../screens/auth/EmailSentScreen';

export default function EmailSentRoute() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const navigation: any = {
    navigate: (screen: string) => {
      if (screen === 'Login') router.replace('/(auth)/login');
    },
  };
  return <EmailSentScreen navigation={navigation} route={{ params: { email: email ?? '' } } as any} />;
}