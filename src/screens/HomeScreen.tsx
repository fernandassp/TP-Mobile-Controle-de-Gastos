import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, Card, ContentContainer, TransactionRow } from '../components';
import { DonutChart } from '../features/home/DonutChart';
import { MonthlyChart } from '../features/home/MonthlyChart';
import { gastosPorCategoria, gastosPorMes } from '../features/home/stats';
import { aplicarFiltros, FILTROS_PADRAO, totalizar } from '../features/transactions/filters';
import { useLancamentos } from '../hooks/useLancamentos';
import { fonts, useTheme } from '../theme';
import { capitalize, formatBRL, formatTime, monthName } from '../utils/format';
import { NetworkStatusIndicator } from '../features/sync/components/NetworkStatusIndicator';

interface HomeScreenProps {
  /** Nome exibido na saudação. */
  userName?: string;
  /** Aviso de orçamento (RF09), fornecido pela tela de Orçamentos. */
  alertaOrcamento?: { titulo: string; mensagem: string };
  onPressAlert?: () => void;
  onPressProfile?: () => void;
  onPressSeeAll?: () => void;
  onPressTransaction?: (id: string) => void;
  onPressNewTransaction?: () => void;
  onPressBudgets?: () => void;
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0].charAt(0);
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : partes[0].charAt(1);
  return (primeira + ultima).toUpperCase();
}

/** Tela Início: saldo, totais do mês, gráficos e últimos lançamentos (RF06 e RF07). */
export default function HomeScreen({
  userName = 'Você',
  alertaOrcamento,
  onPressAlert,
  onPressProfile,
  onPressSeeAll,
  onPressTransaction,
  onPressNewTransaction,
  onPressBudgets,
}: HomeScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { lancamentos, categorias } = useLancamentos();
  const now = useMemo(() => new Date(), []);

  const doMes = useMemo(() => aplicarFiltros(lancamentos, FILTROS_PADRAO, now), [lancamentos, now]);
  const totais = useMemo(() => totalizar(doMes), [doMes]);
  const mensal = useMemo(() => gastosPorMes(lancamentos, now, 6), [lancamentos, now]);
  const fatias = useMemo(() => gastosPorCategoria(lancamentos, categorias, now, 4), [lancamentos, categorias, now]);
  const recentes = useMemo(
    () => aplicarFiltros(lancamentos, { ...FILTROS_PADRAO, periodo: 'ultimos_3_meses' }, now).slice(0, 5),
    [lancamentos, now],
  );
  const categoriasPorId = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);

  const [mesSelecionado, setMesSelecionado] = useState(mensal.valores.length - 1);

  const primeiraVez = doMes.length === 0;
  const negativo = totais.saldo < 0;
  const temGraficoMensal = mensal.valores.some((v) => v > 0);
  const nomeDoMes = monthName(now);
  const corDaFatia = (i: number) => colors.chart[Math.min(i, colors.chart.length - 1)];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cabeçalho com saldo */}
        <View style={[styles.header, { backgroundColor: colors.header, paddingTop: insets.top + 20 + (Platform.OS === 'web' ? 72 : 0) }]}>
          <ContentContainer style={styles.headerInner}>
            <View style={styles.greetingRow}>
              <AppText variant="body" color="#C9EBE4">
                Olá, <AppText variant="bodyStrong" color="#FFFFFF">{userName}</AppText>
              </AppText>
              <NetworkStatusIndicator />
              <Pressable
                onPress={onPressProfile}
                accessibilityRole="button"
                accessibilityLabel="Perfil e configurações"
                style={styles.avatar}
              >
                <AppText variant="bodyStrong" color="#FFFFFF" style={{ fontFamily: fonts.displayBold }}>
                  {iniciais(userName)}
                </AppText>
              </Pressable>
            </View>

            <AppText variant="overline" color="#A9BFBC" style={styles.balanceLabel}>
              Saldo de {nomeDoMes}
            </AppText>
            <AppText
              variant="h1"
              color={negativo ? '#EC9A93' : '#FFFFFF'}
              style={styles.balance}
              accessibilityLabel={`Saldo de ${nomeDoMes}: ${formatBRL(totais.saldo)}`}
              accessibilityRole="text"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatBRL(totais.saldo)}
            </AppText>

            <View style={styles.totalsRow}>
              <View style={styles.totalBox} accessible accessibilityLabel={`Entrou ${formatBRL(totais.receitas)}`}>
                <View style={styles.totalLabel}>
                  <Ionicons name="arrow-up" size={14} color="#91B99C" />
                  <AppText variant="caption" color="#91B99C" style={styles.bold}>
                    Entrou
                  </AppText>
                </View>
                <AppText variant="money" color="#FFFFFF" style={styles.totalValue}>
                  {formatBRL(totais.receitas)}
                </AppText>
              </View>
              <View style={styles.totalBox} accessible accessibilityLabel={`Saiu ${formatBRL(totais.despesas)}`}>
                <View style={styles.totalLabel}>
                  <Ionicons name="arrow-down" size={14} color="#EC9A93" />
                  <AppText variant="caption" color="#EC9A93" style={styles.bold}>
                    Saiu
                  </AppText>
                </View>
                <AppText variant="money" color="#FFFFFF" style={styles.totalValue}>
                  {formatBRL(totais.despesas)}
                </AppText>
              </View>
            </View>
          </ContentContainer>
        </View>

        <ContentContainer style={styles.body}>
          {/* Estado de primeira vez */}
          {primeiraVez ? (
            <Card style={styles.firstTime}>
              <View style={[styles.checkIcon, { backgroundColor: colors.positiveBg }]}>
                <Ionicons name="checkmark" size={22} color={colors.positive} />
              </View>
              <AppText variant="h2" style={styles.center}>
                Tudo pronto, {userName}!
              </AppText>
              <AppText variant="caption" style={styles.center}>
                Comece registrando o gasto de hoje.
              </AppText>
              <Button
                title="Registrar primeiro gasto"
                icon={<Ionicons name="add" size={20} color={colors.onPrimary} />}
                onPress={onPressNewTransaction}
              />
            </Card>
          ) : null}

          {/* Saldo negativo */}
          {negativo ? (
            <Card style={[styles.banner, { borderColor: colors.negative }]}>
              <Ionicons name="alert-circle-outline" size={22} color={colors.negative} />
              <AppText variant="body" style={styles.flex}>
                Você gastou {formatBRL(Math.abs(totais.saldo))} a mais do que recebeu este mês.
              </AppText>
            </Card>
          ) : null}

          {/* Aviso de orçamento (RF09) */}
          {alertaOrcamento ? (
            <Pressable onPress={onPressAlert} accessibilityRole="button">
              <Card style={[styles.banner, { borderColor: colors.negative }]}>
                <View style={[styles.bannerIcon, { backgroundColor: colors.negativeBg }]}>
                  <Ionicons name="alert-circle-outline" size={22} color={colors.negative} />
                </View>
                <View style={styles.flex}>
                  <AppText variant="bodyStrong" color="negative">
                    {alertaOrcamento.titulo}
                  </AppText>
                  <AppText variant="body">{alertaOrcamento.mensagem}</AppText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.icon} />
              </Card>
            </Pressable>
          ) : null}

          {/* Gastos mês a mês */}
          <Card>
            <View style={styles.cardHeader}>
              <AppText variant="h2">Gastos mês a mês</AppText>
              {temGraficoMensal ? <AppText variant="caption">Toque num mês</AppText> : null}
            </View>
            {temGraficoMensal ? (
              <MonthlyChart
                rotulos={mensal.rotulos}
                valores={mensal.valores}
                selecionado={mesSelecionado}
                onSelecionar={setMesSelecionado}
              />
            ) : (
              <View style={styles.hint}>
                <Ionicons name="trending-up-outline" size={22} color={colors.icon} />
                <AppText variant="caption" style={styles.flex}>
                  Seu gráfico aparece depois do primeiro lançamento.
                </AppText>
              </View>
            )}
          </Card>

          {/* Gastos por categoria */}
          <Card>
            <View style={styles.cardHeader}>
              <AppText variant="h2">Gastos por categoria</AppText>
              <Pressable onPress={onPressBudgets} accessibilityRole="link" hitSlop={8}>
                <AppText variant="bodyStrong" color="primaryText">
                  Limites
                </AppText>
              </Pressable>
            </View>
            {fatias.length > 0 ? (
              <View style={styles.donutRow}>
                <DonutChart
                  slices={fatias.map((f, i) => ({ value: f.valor, color: corDaFatia(i) }))}
                  trackColor={colors.soft}
                >
                  <AppText variant="caption">Saiu</AppText>
                  <AppText variant="money" style={styles.donutValue}>
                    {formatBRL(totais.despesas)}
                  </AppText>
                </DonutChart>
                <View style={styles.legend}>
                  {fatias.map((f, i) => (
                    <View
                      key={f.id}
                      style={styles.legendItem}
                      accessible
                      accessibilityLabel={`${f.nome}: ${Math.round(f.percentual)}% dos gastos`}
                    >
                      <View style={[styles.swatch, { backgroundColor: corDaFatia(i), borderColor: colors.border }]} />
                      <AppText variant="body" style={styles.flex} numberOfLines={1}>
                        {f.nome}
                      </AppText>
                      <AppText variant="money" style={styles.legendPct}>
                        {Math.round(f.percentual)}%
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.hint}>
                <Ionicons name="pie-chart-outline" size={22} color={colors.icon} />
                <AppText variant="caption" style={styles.flex}>
                  Quando você registrar despesas, mostramos aqui onde o dinheiro vai.
                </AppText>
              </View>
            )}
          </Card>

          {/* Últimos lançamentos */}
          {recentes.length > 0 ? (
            <Card style={styles.recentCard}>
              <View style={[styles.cardHeader, styles.recentHeader]}>
                <AppText variant="h2">Últimos lançamentos</AppText>
                <Pressable onPress={onPressSeeAll} accessibilityRole="link" hitSlop={8}>
                  <AppText variant="bodyStrong" color="primaryText">
                    Ver todos
                  </AppText>
                </Pressable>
              </View>
              {recentes.map((l, i) => {
                const categoria = categoriasPorId.get(l.categoriaId);
                return (
                  <TransactionRow
                    key={l.id}
                    title={l.descricao}
                    subtitle={`${categoria?.nome ?? 'Sem categoria'} · ${formatTime(new Date(l.data))}`}
                    valor={l.valor}
                    tipo={l.tipo}
                    icon={categoria?.icone ?? 'ellipse-outline'}
                    divider={i < recentes.length - 1}
                    onPress={() => onPressTransaction?.(l.id)}
                  />
                );
              })}
            </Card>
          ) : null}
          <AppText variant="caption" style={styles.footer}>
            {capitalize(nomeDoMes)} de {now.getFullYear()}
          </AppText>
        </ContentContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingBottom: 24 },
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  bold: { fontWeight: '600' },
  header: { paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerInner: {},
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#195967',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  balanceLabel: { marginTop: 14 },
  balance: { fontSize: 36, lineHeight: 42, marginTop: 4 },
  totalsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  totalBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12 },
  totalLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  totalValue: { fontSize: 18, lineHeight: 26 },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  firstTime: { alignItems: 'center', gap: 10 },
  checkIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  banner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1.5 },
  bannerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 6 },
  donutValue: { fontSize: 15, lineHeight: 20 },
  legend: { flex: 1, minWidth: 0 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 32 },
  swatch: { width: 12, height: 12, borderRadius: 4, borderWidth: 1 },
  legendPct: { fontWeight: '600' },
  recentCard: { paddingBottom: 6 },
  recentHeader: { marginBottom: 0 },
  footer: { textAlign: 'center', marginTop: 4 },
});
