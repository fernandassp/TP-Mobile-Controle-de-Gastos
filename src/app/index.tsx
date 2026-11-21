import 'react-native-get-random-values';
import { useRouter } from 'expo-router';

import { useAlertas } from '../hooks/useAlertas';
import HomeScreen from '../screens/HomeScreen';

export default function Index() {
  const router = useRouter();
  const { ultimoNaoLido } = useAlertas();
  return (
    <HomeScreen
      userName="Giulia"
      onPressSeeAll={() => router.navigate('/lancamentos')}
      alertaOrcamento={
        ultimoNaoLido ? { titulo: ultimoNaoLido.titulo, mensagem: ultimoNaoLido.alerta.mensagem } : undefined
      }
      onPressAlert={() => router.navigate('/orcamentos/alertas')}
      onPressBudgets={() => router.navigate('/orcamentos')}
    />
  );
}
