import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Chip, CurrencyInput } from '../../components';
import type { DadosOrcamento } from '../../repositories/orcamentoRepository';
import { useTheme } from '../../theme';
import type { Categoria, MesReferencia, Orcamento } from '../../types';
import { Sheet } from '../common/Sheet';
import { PERCENTUAIS_ALERTA, PERCENTUAL_ALERTA_PADRAO, rotuloDoMes, type ErrosOrcamento } from './rules';

interface BudgetFormSheetProps {
  visible: boolean;
  orcamento?: Orcamento;
  mes: MesReferencia;
  categorias: Categoria[];
  categoriasComOrcamento: Set<string>;
  onSave: (dados: DadosOrcamento) => Promise<ErrosOrcamento>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

export function BudgetFormSheet({
  visible,
  orcamento,
  mes,
  categorias,
  categoriasComOrcamento,
  onSave,
  onDelete,
  onClose,
}: BudgetFormSheetProps) {
  const { colors } = useTheme();
  const editando = !!orcamento;

  const [categoriaId, setCategoriaId] = useState(orcamento?.categoriaId ?? '');
  const [valorLimite, setValorLimite] = useState(orcamento?.valorLimite ?? 0);
  const [percentualAlerta, setPercentualAlerta] = useState(orcamento?.percentualAlerta ?? PERCENTUAL_ALERTA_PADRAO);
  const [erros, setErros] = useState<ErrosOrcamento>({});
  const [salvando, setSalvando] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const disponiveis = categorias.filter((c) => c.id === orcamento?.categoriaId || !categoriasComOrcamento.has(c.id));
  const nomeCategoria = categorias.find((c) => c.id === orcamento?.categoriaId)?.nome ?? 'esta categoria';

  const salvar = async () => {
    setSalvando(true);
    try {
      setErros(await onSave({ categoriaId, mesReferencia: orcamento?.mesReferencia ?? mes, valorLimite, percentualAlerta }));
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    if (!onDelete) return;
    setSalvando(true);
    try {
      await onDelete();
    } finally {
      setSalvando(false);
    }
  };

  const footer = confirmarExclusao ? (
    <>
      <Button title="Cancelar" variant="secondary" style={styles.flex} onPress={() => setConfirmarExclusao(false)} />
      <Button title="Excluir" variant="danger" style={styles.flex} loading={salvando} onPress={excluir} />
    </>
  ) : (
    <>
      {editando && onDelete ? (
        <Button title="Excluir" variant="secondary" style={styles.flex} onPress={() => setConfirmarExclusao(true)} />
      ) : null}
      <Button title={editando ? 'Salvar' : 'Criar orçamento'} style={styles.flex} loading={salvando} onPress={salvar} />
    </>
  );

  return (
    <Sheet visible={visible} title={editando ? 'Editar orçamento' : 'Novo orçamento'} onClose={onClose} footer={footer}>
      {confirmarExclusao ? (
        <View style={[styles.confirm, { backgroundColor: colors.negativeBg }]}>
          <Ionicons name="trash-outline" size={22} color={colors.negative} />
          <AppText variant="body" style={styles.flex}>
            Excluir o orçamento de {nomeCategoria}? Os lançamentos não são afetados.
          </AppText>
        </View>
      ) : (
        <View style={styles.form}>
          <AppText variant="caption">{rotuloDoMes(orcamento?.mesReferencia ?? mes)}</AppText>

          <View>
            <AppText variant="overline" style={styles.section}>
              Categoria
            </AppText>
            {disponiveis.length > 0 ? (
              <View style={styles.wrap} accessibilityRole="radiogroup">
                {disponiveis.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.nome}
                    icon={c.icone}
                    selected={categoriaId === c.id}
                    onPress={() => {
                      setCategoriaId(c.id);
                      if (erros.categoria) setErros((e) => ({ ...e, categoria: undefined }));
                    }}
                  />
                ))}
              </View>
            ) : (
              <AppText variant="caption">Todas as categorias de despesa já têm orçamento neste mês.</AppText>
            )}
            {erros.categoria ? <MensagemErro texto={erros.categoria} /> : null}
          </View>

          <CurrencyInput
            label="Limite do mês"
            value={valorLimite}
            onChangeValue={(v) => {
              setValorLimite(v);
              if (erros.valorLimite) setErros((e) => ({ ...e, valorLimite: undefined }));
            }}
            error={erros.valorLimite}
          />

          <View>
            <AppText variant="overline" style={styles.section}>
              Avisar quando chegar a
            </AppText>
            <View style={styles.wrap} accessibilityRole="radiogroup">
              {PERCENTUAIS_ALERTA.map((p) => (
                <Chip key={p} label={`${p}%`} selected={percentualAlerta === p} onPress={() => setPercentualAlerta(p)} />
              ))}
            </View>
            {erros.percentualAlerta ? <MensagemErro texto={erros.percentualAlerta} /> : null}
            <AppText variant="caption" style={styles.hint}>
              Você também é avisado ao atingir 100% do limite.
            </AppText>
          </View>
        </View>
      )}
    </Sheet>
  );
}

function MensagemErro({ texto }: { texto: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.error} accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
      <AppText variant="caption" color="error">
        {texto}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: 18, paddingTop: 4 },
  section: { marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { marginTop: 8 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  confirm: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 14, alignItems: 'flex-start' },
});
