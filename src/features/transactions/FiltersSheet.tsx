import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, Chip, ContentContainer } from '../../components';
import { useTheme } from '../../theme';
import type { Categoria } from '../../types';
import { FILTROS_PADRAO, type Filtros, type Ordem, type Periodo } from './filters';

interface FiltersSheetProps {
  visible: boolean;
  filtros: Filtros;
  categorias: Categoria[];
  onApply: (filtros: Filtros) => void;
  onClose: () => void;
}

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: 'este_mes', label: 'Este mês' },
  { id: 'mes_passado', label: 'Mês passado' },
  { id: 'ultimos_3_meses', label: 'Últimos 3 meses' },
];

const ORDENS: { id: Ordem; label: string }[] = [
  { id: 'recentes', label: 'Mais recentes' },
  { id: 'antigos', label: 'Mais antigos' },
];

/** Painel de filtros (período, categorias e ordenação). Só aplica ao tocar em "Ver resultados". */
export function FiltersSheet({ visible, filtros, categorias, onApply, onClose }: FiltersSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [rascunho, setRascunho] = useState<Filtros>(filtros);
  const [estavaAberto, setEstavaAberto] = useState(visible);

  // Sempre que abrir, começa a partir dos filtros atuais.
  if (visible !== estavaAberto) {
    setEstavaAberto(visible);
    if (visible) setRascunho(filtros);
  }

  // Só mostra categorias compatíveis com o tipo escolhido na tela.
  const disponiveis = categorias.filter((c) => filtros.tipo === 'todos' || c.tipo === filtros.tipo);

  const alternarCategoria = (id: string) =>
    setRascunho((r) => ({
      ...r,
      categoriaIds: r.categoriaIds.includes(id) ? r.categoriaIds.filter((x) => x !== id) : [...r.categoriaIds, id],
    }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Fechar filtros"
        accessibilityRole="button"
      />
      <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <ContentContainer>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <AppText variant="h2" style={styles.title}>
            Filtros
          </AppText>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <AppText variant="overline" style={styles.section}>
              Período
            </AppText>
            <View style={styles.wrap} accessibilityRole="radiogroup">
              {PERIODOS.map((p) => (
                <Chip
                  key={p.id}
                  label={p.label}
                  selected={rascunho.periodo === p.id}
                  onPress={() => setRascunho((r) => ({ ...r, periodo: p.id }))}
                />
              ))}
            </View>

            <AppText variant="overline" style={styles.section}>
              Categorias
            </AppText>
            <View style={styles.wrap}>
              {disponiveis.map((c) => (
                <Chip
                  key={c.id}
                  label={c.nome}
                  role="checkbox"
                  selected={rascunho.categoriaIds.includes(c.id)}
                  onPress={() => alternarCategoria(c.id)}
                />
              ))}
            </View>

            <AppText variant="overline" style={styles.section}>
              Ordenar por
            </AppText>
            <View style={styles.wrap} accessibilityRole="radiogroup">
              {ORDENS.map((o) => (
                <Chip
                  key={o.id}
                  label={o.label}
                  selected={rascunho.ordem === o.id}
                  onPress={() => setRascunho((r) => ({ ...r, ordem: o.id }))}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Limpar"
              variant="secondary"
              style={styles.flex}
              onPress={() =>
                setRascunho((r) => ({
                  ...r,
                  periodo: FILTROS_PADRAO.periodo,
                  categoriaIds: FILTROS_PADRAO.categoriaIds,
                  ordem: FILTROS_PADRAO.ordem,
                }))
              }
            />
            <Button
              title="Ver resultados"
              style={styles.flex}
              onPress={() => {
                onApply(rascunho);
                onClose();
              }}
            />
          </View>
        </ContentContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(13,46,43,0.45)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, maxHeight: '85%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 12 },
  title: { marginBottom: 4 },
  scroll: { flexGrow: 0 },
  section: { marginTop: 16, marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  flex: { flex: 1 },
});
