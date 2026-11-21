import { useRouter } from 'expo-router';
import { InitialBalanceScreen } from '../../screens/onboarding/InitialBalanceScreen';

export default function InitialBalanceRoute() {
  const router = useRouter();
  const navigation: any = {
    navigate: (_screen: string, params: { initialBalance: number }) => {
      router.push({
        pathname: '/(onboarding)/top-categories',
        params: { initialBalance: String(params.initialBalance) },
      });
    },
  };
  return <InitialBalanceScreen navigation={navigation} route={{} as any} />;
}