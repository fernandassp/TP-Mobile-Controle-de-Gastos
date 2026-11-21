import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, useToast } from '../components';
import { categoriasAtivas } from '../features/categorias/rules';
import { BudgetFormSheet } from '../features/orcamentos/BudgetFormSheet';
import { ProgressBar } from '../features/orcamentos/ProgressBar';
import { calcularUso, mesDe, rotuloDoMes, somarMeses } from '../features/orcamentos/rules';
import { statusVisual } from '../features/orcamentos/statusVisual';
import { useAlertas } from '../hooks/useAlertas';
import { useCategorias } from '../hooks/useCategorias';
import { useOrcamentos, type OrcamentoDetalhado } from '../hooks/useOrcamentos';
import { useTheme } from '../theme';
import type { Orcamento } from '../types';
import { formatBRL } from '../utils/format';

interface BudgetsScreenProps {
  onPressAlerts?: () => void;
}

export default function BudgetsScreen({ onPressAlerts }: BudgetsScreenProps) {
  const { colors } = useTheme();
  const toast = useToast();
  const [mes, setMes] = useState(() => mesDe(new Date()));
  const { itens, totalLimite, totalGasto, salvar, excluir } = useOrcamentos(mes);
  const { categorias } = useCategorias();
  const { naoLidos } = useAlertas();
  const [form, setForm] = useState<{ aberto: boolean; orcamento?: Orcamento; versao: number }>({ aberto: false, versao: 0 });

  const despesas = useMemo(() => categoriasAtivas(categorias, 'despesa'), [categorias]);
  const comOrcamento = useMemo(() => new Set(itens.map((i) => i.orcamento.categoriaId)), [itens]);
  const usoTotal = calcularUso(
    { id: 'total', categoriaId: '', mesReferencia: mes, valorLimite: totalLimite, percentualAlerta: 100 },
    totalGasto,
  );

  const fechar = () => setForm((f) => ({ ...f, aberto: false }));
  const abrirNovo = () => setForm((f) => ({ aberto: true, versao: f.versao + 1 }));

  const cartao = ({ orcamento, categoria, uso }: OrcamentoDetalhado) => {
    const visual = statusVisual(uso.status, colors);
    const nome = categoria ? `${categoria.nome}${categoria.excluido ? ' (excluída)' : ''}` : 'Sem categoria';
    return (
      <Pressable
        key={orcamento.id}
        onPress={() => setForm((f) => ({ aberto: true, orcamento, versao: f.versao + 1 }))}
        accessibilityRole="button"
        accessibilityLabel={`${nome}: ${formatBRL(uso.gasto)} de ${formatBRL(orcamento.valorLimite)}, ${visual.label}. Editar`}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Card style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View style={[styles.icon, { backgroundColor: categoria?.cor ?? colors.soft }]}>
              <Ionicons name={categoria?.icone ?? 'ellipse-outline'} size={20} color="#FFFFFF" />
            </View>
            <AppText variant="bodyStrong" numberOfLines={1} style={styles.flex}>
              {nome}
            </AppText>
            <View style={[styles.pill, { backgroundColor: visual.bg }]}>
              <Ionicons name={visual.icon} size={14} color={visual.color} />
              <AppText variant="caption" color={visual.color} style={styles.pillText}>
                {visual.label}
              </AppText>
            </View>
          </View>

          <ProgressBar percentual={uso.percentual} color={visual.color} marcador={orcamento.percentualAlerta} />

          <View style={styles.values}>
            <AppText variant="caption">
              <AppText variant="money" style={styles.small}>
                {formatBRL(uso.gasto)}
              </AppText>{' '}
              de {formatBRL(orcamento.valorLimite)}
            </AppText>
            <AppText variant="money" color={visual.color} style={styles.small}>
              {Math.round(uso.percentual)}%
            </AppText>
          </View>
          <AppText variant="caption">
            {uso.restante >= 0
              ? `Restam ${formatBRL(uso.restante)} · aviso em ${orcamento.percentualAlerta}%`
              : `Passou ${formatBRL(-uso.restante)} do limite`}
          </AppText>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 92 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <AppText variant="h1">Orçamentos</AppText>
          <Pressable
            onPress={onPressAlerts}
            accessibilityRole="button"
            accessibilityLabel={naoLidos > 0 ? `Alertas, ${naoLidos} não lidos` : 'Alertas'}
            style={[styles.bell, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.title} />
            {naoLidos > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.negative }]}>
                <AppText variant="caption" color="#FFFFFF" style={styles.badgeText}>
                  {naoLidos}
                </AppText>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.monthRow}>
          <Pressable
            onPress={() => setMes((m) => somarMeses(m, -1))}
            accessibilityRole="button"
            accessibilityLabel="Mês anterior"
            hitSlop={8}
            style={styles.monthButton}
          >
            <Ionicons name="chevron-back" size={22} color={colors.title} />
          </Pressable>
          <AppText variant="h2" accessibilityRole="text" accessibilityLiveRegion="polite">
            {rotuloDoMes(mes)}
          </AppText>
          <Pressable
            onPress={() => setMes((m) => somarMeses(m, 1))}
            accessibilityRole="button"
            accessibilityLabel="Próximo mês"
            hitSlop={8}
            style={styles.monthButton}
          >
            <Ionicons name="chevron-forward" size={22} color={colors.title} />
          </Pressable>
        </View>

        {itens.length > 0 ? (
          <>
            <Card style={styles.summary}>
              <AppText variant="overline">Total do mês</AppText>
              <View style={styles.values}>
                <AppText variant="money">{formatBRL(totalGasto)}</AppText>
                <AppText variant="caption">de {formatBRL(totalLimite)}</AppText>
              </View>
              <ProgressBar
                percentual={usoTotal.percentual}
                color={statusVisual(usoTotal.status === 'estourado' ? 'estourado' : 'ok', colors).color}
                accessibilityLabel={`Total usado: ${Math.round(usoTotal.percentual)}%`}
              />
            </Card>

            {itens.map(cartao)}

            <Button
              title="Novo orçamento"
              variant="secondary"
              icon={<Ionicons name="add" size={20} color={colors.text} />}
              onPress={abrirNovo}
              disabled={despesas.every((c) => comOrcamento.has(c.id))}
            />
          </>
        ) : (
          <Card style={styles.emptyCard}>
            <EmptyState
              icon="pie-chart-outline"
              title={`Nenhum orçamento em ${rotuloDoMes(mes).split(' ')[0].toLowerCase()}`}
              description="Defina um limite por categoria e acompanhe quanto já gastou."
              actionLabel="Criar orçamento"
              onAction={abrirNovo}
            />
          </Card>
        )}
      </ScrollView>

      <BudgetFormSheet
        key={form.versao}
        visible={form.aberto}
        orcamento={form.orcamento}
        mes={mes}
        categorias={despesas}
        categoriasComOrcamento={comOrcamento}
        onClose={fechar}
        onSave={async (dados) => {
          try {
            const erros = await salvar(dados, form.orcamento?.id);
            if (Object.keys(erros).length === 0) {
              fechar();
              toast.success(form.orcamento ? 'Orçamento atualizado.' : 'Orçamento criado.');
            }
            return erros;
          } catch {
            toast.error('Não foi possível salvar o orçamento.');
            return {};
          }
        }}
        onDelete={async () => {
          if (!form.orcamento) return;
          try {
            await excluir(form.orcamento.id);
            fechar();
            toast.success('Orçamento excluído.');
          } catch {
            toast.error('Não foi possível excluir o orçamento.');
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, width: '100%', maxWidth: 600, alignSelf: 'center', gap: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bell: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  summary: { gap: 8 },
  budgetCard: { gap: 10 },
  budgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  pillText: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  values: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  small: { fontSize: 15 },
  emptyCard: { paddingVertical: 0 },
});
