import { useRouter, useLocalSearchParams } from 'expo-router';
import { TopCategoriesScreen } from '../../screens/onboarding/TopCategoriesScreen';

export default function TopCategoriesRoute() {
  const router = useRouter();
  const { initialBalance } = useLocalSearchParams<{ initialBalance: string }>();
  const navigation: any = {
    navigate: (_screen: string, params: { initialBalance: number; selectedCategories: string[] }) => {
      router.push({
        pathname: '/(onboarding)/first-budget',
        params: {
          initialBalance: String(params.initialBalance),
          selectedCategories: JSON.stringify(params.selectedCategories),
        },
      });
    },
  };
  return (
    <TopCategoriesScreen
      navigation={navigation}
      route={{ params: { initialBalance: Number(initialBalance ?? 0) } } as any}
    />
  );
}