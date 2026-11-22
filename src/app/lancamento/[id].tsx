import { useLocalSearchParams } from 'expo-router';
import { AppText, ContentContainer } from '../../components';
import { EditTransactionScreen } from '../../screens/EditTransactionScreen';

export default function EditarLancamentoRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!id || typeof id !== 'string') {
    return (
      <ContentContainer>
        <AppText variant="h2" style={{ padding: 16 }}>
          Identificador de lançamento inválido.
        </AppText>
      </ContentContainer>
    );
  }

  return <EditTransactionScreen id={id} />;
}