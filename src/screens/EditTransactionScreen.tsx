import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Platform, View, type ViewStyle } from 'react-native';
import { AppText, ContentContainer, useToast } from '../components';
import { TransactionForm, type TransactionFormValues } from '../features/transactions/TransactionForm';
import { useLancamentos } from '../hooks/useLancamentos';
import { lancamentoRepository } from '../repositories/lancamentoRepository';
import { useTheme } from '../theme';
import type { Lancamento } from '../types';

interface EditTransactionScreenProps {
  id: string;
}

export function EditTransactionScreen({ id }: EditTransactionScreenProps) {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const { categorias } = useLancamentos();

  const [lancamento, setLancamento] = useState<Lancamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const webViewportStyle: ViewStyle =
    Platform.OS === 'web'
      ? {
          height: '100vh' as unknown as number,
          maxHeight: '100vh' as unknown as number,
          overflow: 'hidden',
        }
      : { flex: 1 };

  useEffect(() => {
    let active = true;
    setLoading(true);
    lancamentoRepository
      .obterPorId(id)
      .then((item) => {
        if (!active) return;
        setLancamento(item);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const navigateAfterAction = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleUpdate = async (values: TransactionFormValues) => {
    setSaving(true);
    try {
      await lancamentoRepository.atualizar(id, {
        tipo: values.tipo,
        valor: values.valor,
        descricao: values.descricao,
        categoriaId: values.categoriaId,
        data: values.dataIso,
      });
      toast.success('Lançamento atualizado.');
      navigateAfterAction();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível atualizar.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      await lancamentoRepository.excluir(id);
      toast.success('Lançamento excluído.');
      navigateAfterAction();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível excluir.';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeletePress = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm('Deseja realmente excluir este lançamento?')
          : true;
      if (confirmed) {
        void performDelete();
      }
      return;
    }

    Alert.alert(
      'Excluir lançamento',
      'Deseja realmente excluir este lançamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: performDelete },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, webViewportStyle]}>
        <ContentContainer style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </ContentContainer>
      </View>
    );
  }

  if (!lancamento) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.bg }, webViewportStyle]}>
        <ContentContainer style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{ padding: 16, gap: 12 }}>
            <AppText variant="h2">Lançamento não encontrado.</AppText>
            <Button title="Voltar ao início" onPress={() => router.replace('/')} />
          </View>
        </ContentContainer>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.bg }, webViewportStyle]}>
      <ContentContainer style={{ flex: 1, backgroundColor: colors.bg }}>
        <AppText variant="h1" style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          Editar lançamento
        </AppText>
        <TransactionForm
          initialValues={{
            tipo: lancamento.tipo,
            valor: lancamento.valor,
            descricao: lancamento.descricao,
            categoriaId: lancamento.categoriaId,
            dataIso: lancamento.data,
          }}
          categorias={categorias}
          submitLabel="Salvar alterações"
          submitting={saving}
          deleting={deleting}
          onSubmit={handleUpdate}
          onDelete={handleDeletePress}
        />
      </ContentContainer>
    </View>
  );
}