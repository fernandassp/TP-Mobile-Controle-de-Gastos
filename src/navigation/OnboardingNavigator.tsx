import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { InitialBalanceScreen } from '../screens/onboarding/InitialBalanceScreen';
import { TopCategoriesScreen } from '../screens/onboarding/TopCategoriesScreen';
import { FirstBudgetScreen } from '../screens/onboarding/FirstBudgetScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InitialBalance" component={InitialBalanceScreen} />
      <Stack.Screen name="TopCategories" component={TopCategoriesScreen} />
      <Stack.Screen name="FirstBudget" component={FirstBudgetScreen} />
    </Stack.Navigator>
  );
};