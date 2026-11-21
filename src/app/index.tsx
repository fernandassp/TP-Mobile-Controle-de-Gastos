import 'react-native-get-random-values';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';

export default function Index() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  function handleProfilePress() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Conta: ${user?.email}\n\nDeseja sair da conta?`);
      if (confirmed) signOut();
      return;
    }

    Alert.alert(
      user?.name || 'Minha conta',
      user?.email || 'Deseja encerrar sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair da conta',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ],
    );
  }

  return (
    <HomeScreen
      userName={user?.name || 'Você'}
      onPressProfile={handleProfilePress}
      onPressSeeAll={() => router.navigate('/lancamentos')}
      onPressBudgets={() => router.navigate('/orcamentos')}
      onPressAlert={() => router.navigate('/orcamentos')}
    />
  );
}