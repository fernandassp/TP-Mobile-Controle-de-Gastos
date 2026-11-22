import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';
import { AppText, ContentContainer, useToast } from '../components';
import { TransactionForm, type TransactionFormValues } from '../features/transactions/TransactionForm';
import { useLancamentos } from '../hooks/useLancamentos';
import { lancamentoRepository } from '../repositories/lancamentoRepository';
import { useTheme } from '../theme';

export function NewTransactionScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const { categorias } = useLancamentos();
  const [saving, setSaving] = useState(false);

  const navigateAfterSave = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleCreate = async (values: TransactionFormValues) => {
    setSaving(true);
    try {
      await lancamentoRepository.criar({
        tipo: values.tipo,
        valor: values.valor,
        descricao: values.descricao,
        categoriaId: values.categoriaId,
        data: values.dataIso,
      });
      toast.success('Lançamento salvo com sucesso.');
      navigateAfterSave();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível salvar o lançamento.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };
  const webViewportStyle: ViewStyle =
    Platform.OS === 'web'
      ? { height: '100vh' as unknown as number, maxHeight: '100vh' as unknown as number, overflow: 'hidden' }
      : { flex: 1 };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.bg }, webViewportStyle]}>
      <ContentContainer style={{ flex: 1, backgroundColor: colors.bg }}>
        <AppText variant="h1" style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          Novo lançamento
        </AppText>
        <TransactionForm
          categorias={categorias}
          submitLabel="Salvar lançamento"
          submitting={saving}
          onSubmit={handleCreate}
        />
      </ContentContainer>
    </View>
  );
}