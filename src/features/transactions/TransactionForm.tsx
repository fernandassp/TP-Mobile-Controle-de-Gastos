import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, CurrencyInput, Input } from '../../components';
import { radius, useTheme } from '../../theme';
import type { Categoria, TipoLancamento } from '../../types';

export interface TransactionFormValues {
  tipo: TipoLancamento;
  valor: number;
  descricao: string;
  categoriaId: string;
  dataIso: string;
}

interface TransactionFormProps {
  initialValues?: Partial<TransactionFormValues>;
  categorias: Categoria[];
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  deleting?: boolean;
}

function getRelativeIsoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export function TransactionForm({
  initialValues,
  categorias,
  submitLabel,
  submitting = false,
  onSubmit,
  onDelete,
  deleting = false,
}: TransactionFormProps) {
  const { colors } = useTheme();

  const [tipo, setTipo] = useState<TipoLancamento>(initialValues?.tipo ?? 'despesa');
  const [valor, setValor] = useState<number>(initialValues?.valor ?? 0);
  const [descricao, setDescricao] = useState<string>(initialValues?.descricao ?? '');
  const [categoriaId, setCategoriaId] = useState<string>(initialValues?.categoriaId ?? '');
  const [dataIso, setDataIso] = useState<string>(initialValues?.dataIso ?? new Date().toISOString());

  const [errors, setErrors] = useState<{
    valor?: string;
    descricao?: string;
    categoriaId?: string;
    dataIso?: string;
  }>({});

  const categoriasFiltradas = useMemo(
    () => categorias.filter((c) => !c.excluido && c.tipo === tipo),
    [categorias, tipo],
  );

  useEffect(() => {
    if (!categoriasFiltradas.some((c) => c.id === categoriaId)) {
      setCategoriaId(categoriasFiltradas[0]?.id ?? '');
    }
  }, [categoriasFiltradas, categoriaId]);

  const handleSelectTipo = (novoTipo: TipoLancamento) => {
    setTipo(novoTipo);
    setErrors((prev) => ({ ...prev, categoriaId: undefined }));
  };

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};

    if (!valor || valor <= 0) {
      nextErrors.valor = 'Digite um valor maior que R$ 0,00.';
    }
    if (!descricao.trim()) {
      nextErrors.descricao = 'Informe uma descrição para o lançamento.';
    }
    if (!categoriaId) {
      nextErrors.categoriaId = 'Escolha uma categoria.';
    }
    if (!dataIso.trim() || Number.isNaN(Date.parse(dataIso))) {
      nextErrors.dataIso = 'Data inválida.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({
      tipo,
      valor,
      descricao: descricao.trim(),
      categoriaId,
      dataIso: new Date(dataIso).toISOString(),
    });
  };

return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.section}>
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          Tipo de lançamento
        </AppText>
        <View style={styles.segmented}>
          {(['despesa', 'receita'] as const).map((item) => {
            const active = tipo === item;
            const activeBg = item === 'despesa' ? colors.danger : colors.positive;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => handleSelectTipo(item)}
                style={[
                  styles.segmentBtn,
                  {
                    backgroundColor: active ? activeBg : colors.soft,
                    borderColor: active ? activeBg : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={item === 'despesa' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
                  size={18}
                  color={active ? '#FFFFFF' : colors.text}
                />
                <AppText variant="bodyStrong" color={active ? '#FFFFFF' : 'text'}>
                  {item === 'despesa' ? 'Despesa' : 'Receita'}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <CurrencyInput
          label="Valor"
          value={valor}
          onChangeValue={(v) => {
            setValor(v);
            if (errors.valor) setErrors((prev) => ({ ...prev, valor: undefined }));
          }}
          error={errors.valor}
          containerStyle={styles.field}
        />

        <Input
          label="Descrição"
          placeholder="Ex.: Supermercado, Salário, Farmácia..."
          value={descricao}
          onChangeText={(text) => {
            setDescricao(text);
            if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: undefined }));
          }}
          error={errors.descricao}
          maxLength={120}
          containerStyle={styles.field}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          Categoria
        </AppText>
        {categoriasFiltradas.length === 0 ? (
          <AppText variant="caption" color="textSecondary">
            Nenhuma categoria de {tipo} disponível.
          </AppText>
        ) : (
          <View style={styles.categoriesGrid}>
            {categoriasFiltradas.map((cat) => {
              const selected = cat.id === categoriaId;
              return (
                <Pressable
                  key={cat.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setCategoriaId(cat.id);
                    if (errors.categoriaId) setErrors((prev) => ({ ...prev, categoriaId: undefined }));
                  }}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: selected ? colors.soft : colors.bg2,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icone}
                    size={18}
                    color={selected ? colors.primary : cat.cor || colors.text}
                  />
                  <AppText
                    variant="caption"
                    color={selected ? 'primary' : 'text'}
                    numberOfLines={1}
                    style={styles.catLabel}
                  >
                    {cat.nome}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        )}
        {errors.categoriaId ? (
          <AppText variant="caption" color="error" style={styles.errorText}>
            {errors.categoriaId}
          </AppText>
        ) : null}

        <View style={styles.field}>
          <AppText variant="caption" color="textSecondary" style={styles.label}>
            Atalho de data
          </AppText>
          <View style={styles.quickDates}>
            <Button
              title="Hoje"
              variant="secondary"
              fullWidth={false}
              onPress={() => setDataIso(getRelativeIsoDate(0))}
            />
            <Button
              title="Ontem"
              variant="secondary"
              fullWidth={false}
              onPress={() => setDataIso(getRelativeIsoDate(1))}
            />
          </View>
          <Input
            label="Data e hora (ISO)"
            value={dataIso}
            onChangeText={(text) => {
              setDataIso(text);
              if (errors.dataIso) setErrors((prev) => ({ ...prev, dataIso: undefined }));
            }}
            error={errors.dataIso}
            containerStyle={styles.field}
          />
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || deleting}
        />

        {onDelete ? (
          <Button
            title="Excluir lançamento"
            variant="danger"
            onPress={onDelete}
            loading={deleting}
            disabled={submitting || deleting}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 96,
    gap: 16,
  },
  section: { padding: 16 },
  label: { marginBottom: 8 },
  segmented: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  segmentBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  field: { marginTop: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  catLabel: { maxWidth: 120 },
  errorText: { marginTop: 6 },
  quickDates: { flexDirection: 'row', gap: 10 },
  actions: { gap: 12, marginTop: 4 },
});