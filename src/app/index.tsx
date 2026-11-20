import 'react-native-get-random-values';
import { useRouter } from 'expo-router';

import HomeScreen from '../screens/HomeScreen';

export default function Index() {
  const router = useRouter();
  return (
    <HomeScreen
      userName="Giulia"
      onPressSeeAll={() => router.navigate('/lancamentos')}
    />
  );
}