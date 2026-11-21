import { useRouter } from 'expo-router';

import BudgetsScreen from '../../screens/BudgetsScreen';

export default function Orcamentos() {
  const router = useRouter();
  return <BudgetsScreen onPressAlerts={() => router.push('/orcamentos/alertas')} />;
}
