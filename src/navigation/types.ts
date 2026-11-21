export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EmailSent: { email: string };
};

export type OnboardingStackParamList = {
  InitialBalance: undefined;
  TopCategories: { initialBalance: number };
  FirstBudget: { initialBalance: number; selectedCategories: string[] };
};

// Placeholder para as telas que as Pessoas 2, 3 e 4 vão plugar depois
export type AppStackParamList = {
  MainTabs: undefined;
};