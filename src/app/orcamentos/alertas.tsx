import { useRouter } from 'expo-router';

import AlertsScreen from '../../screens/AlertsScreen';

export default function Alertas() {
  const router = useRouter();
  return (
    <AlertsScreen
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/orcamentos'))}
    />
  );
}
