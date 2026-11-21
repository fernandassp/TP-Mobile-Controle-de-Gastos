import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, Chip, EmptyState, Input, TransactionRow } from '../components';
import { FiltersSheet } from '../features/transactions/FiltersSheet';
import {
  agruparPorDia,
  aplicarFiltros,
  contarFiltrosAtivos,
  FILTROS_PADRAO,
  totalizar,
  type Filtros,
  type GrupoDeDia,
} from '../features/transactions/filters';
import { useLancamentos } from '../hooks/useLancamentos';
import { useTheme } from '../theme';
import { capitalize, formatBRL, formatTime, intervaloLabel } from '../utils/format';

interface TransactionsScreenProps {
  /** Abre a tela de edição (feita por outro integrante). */
  onPressTransaction?: (id: string) => void;
  /** Abre a tela "Novo lançamento". */
  onPressNewTransaction?: () => void;
}

const TIPOS: { id: Filtros['tipo']; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'despesa', label: 'Despesas' },
  { id: 'receita', label: 'Receitas' },
];

/** Tela Lançamentos: busca, filtros por período/categoria/tipo e ordenação cronológica (RF05). */
export default function TransactionsScreen({ onPressTransaction, onPressNewTransaction }: TransactionsScreenProps) {
  const { colors } = useTheme();
  const { lancamentos, categorias } = useLancamentos();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_PADRAO);
  const [painelAberto, setPainelAberto] = useState(false);

  const now = useMemo(() => new Date(), []);
  const categoriasPorId = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);

  const filtrados = useMemo(() => aplicarFiltros(lancamentos, filtros, now), [lancamentos, filtros, now]);
  const grupos = useMemo(() => agruparPorDia(filtrados, now), [filtrados, now]);
  const totais = useMemo(() => totalizar(filtrados), [filtrados]);
  const ativos = contarFiltrosAtivos(filtros);

  const semNenhumLancamento = lancamentos.length === 0;
  const semResultado = !semNenhumLancamento && filtrados.length === 0;

  const limparFiltros = () => setFiltros(FILTROS_PADRAO);

  const cabecalho = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <AppText variant="h1">Lançamentos</AppText>
        <Chip
          role="button"
          icon="options-outline"
          label="Filtros"
          badge={ativos}
          height={44}
          onPress={() => setPainelAberto(true)}
        />
      </View>

      <Input
        label="Buscar lançamento"
        hideLabel
        leftIcon="search-outline"
        placeholder="Buscar por descrição"
        value={filtros.busca}
        onChangeText={(busca) => setFiltros((f) => ({ ...f, busca }))}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Tipo">
        {TIPOS.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            selected={filtros.tipo === t.id}
            onPress={() => setFiltros((f) => ({ ...f, tipo: t.id, categoriaIds: [] }))}
          />
        ))}
      </View>

      {!semNenhumLancamento && !semResultado ? (
        <Card style={styles.summary}>
          <AppText variant="overline">{capitalize(intervaloLabel(filtros.periodo, now))}</AppText>
          <View style={styles.totals}>
            <View style={styles.total} accessible accessibilityLabel={`Receitas ${formatBRL(totais.receitas)}`}>
              <Ionicons name="arrow-up" size={14} color={colors.positive} />
              <AppText variant="caption" color="positive" style={styles.totalText}>
                {formatBRL(totais.receitas)}
              </AppText>
            </View>
            <View style={styles.total} accessible accessibilityLabel={`Despesas ${formatBRL(totais.despesas)}`}>
              <Ionicons name="arrow-down" size={14} color={colors.negative} />
              <AppText variant="caption" color="negative" style={styles.totalText}>
                {formatBRL(totais.despesas)}
              </AppText>
            </View>
          </View>
        </Card>
      ) : null}
    </View>
  );

  const vazio = semNenhumLancamento ? (
    <Card style={styles.emptyCard}>
      <EmptyState
        icon="list-outline"
        title="Nenhum lançamento ainda"
        description="Toque em + para registrar o primeiro."
        actionLabel="Registrar lançamento"
        onAction={onPressNewTransaction}
      />
    </Card>
  ) : semResultado ? (
    <Card style={styles.emptyCard}>
      <EmptyState
        icon="search-outline"
        title="Nada encontrado"
        description="Nenhum lançamento com esses filtros. Tente outra busca ou outro período."
        actionLabel="Limpar filtros"
        actionVariant="secondary"
        onAction={limparFiltros}
      />
    </Card>
  ) : undefined;

  const renderGrupo = ({ item }: { item: GrupoDeDia }) => (
    <View style={styles.group}>
      <AppText variant="overline" style={styles.groupTitle} accessibilityRole="header">
        {item.titulo}
      </AppText>
      <Card style={styles.groupCard}>
        {item.itens.map((l, i) => {
          const categoria = categoriasPorId.get(l.categoriaId);
          return (
            <TransactionRow
              key={l.id}
              title={l.descricao}
              subtitle={`${categoria?.nome ?? 'Sem categoria'} · ${formatTime(new Date(l.data))}`}
              valor={l.valor}
              tipo={l.tipo}
              icon={categoria?.icone ?? 'ellipse-outline'}
              divider={i < item.itens.length - 1}
              onPress={() => onPressTransaction?.(l.id)}
            />
          );
        })}
      </Card>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        data={grupos}
        keyExtractor={(g) => g.chave}
        renderItem={renderGrupo}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={vazio}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 92 }]}
        showsVerticalScrollIndicator={false}
      />
      <FiltersSheet
        visible={painelAberto}
        filtros={filtros}
        categorias={categorias}
        onApply={setFiltros}
        onClose={() => setPainelAberto(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { gap: 14, marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  totals: { flexDirection: 'row', gap: 14 },
  total: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalText: { fontWeight: '600' },
  group: { gap: 4, marginBottom: 14 },
  groupTitle: { marginHorizontal: 4, marginTop: 6, marginBottom: 2 },
  groupCard: { paddingVertical: 0 },
  emptyCard: { paddingVertical: 0 },
});
