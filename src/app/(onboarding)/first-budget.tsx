import { useLocalSearchParams } from 'expo-router';
import { FirstBudgetScreen } from '../../screens/onboarding/FirstBudgetScreen';

export default function FirstBudgetRoute() {
  const { initialBalance, selectedCategories } = useLocalSearchParams<{
    initialBalance: string;
    selectedCategories: string;
  }>();

  const parsedCategories = selectedCategories ? JSON.parse(selectedCategories) : ['Alimentação'];

  return (
    <FirstBudgetScreen
      navigation={{} as any}
      route={{
        params: {
          initialBalance: Number(initialBalance ?? 0),
          selectedCategories: parsedCategories,
        },
      } as any}
    />
  );
}