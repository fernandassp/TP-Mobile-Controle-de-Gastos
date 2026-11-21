import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Chip, Input } from '../../components';
import type { DadosCategoria } from '../../repositories/categoriaRepository';
import { useTheme } from '../../theme';
import type { Categoria, IconName, TipoLancamento } from '../../types';
import { Sheet } from '../common/Sheet';
import { CORES_CATEGORIA, ICONES_CATEGORIA, NOME_MAX, type ErrosCategoria } from './rules';

interface CategoryFormSheetProps {
  visible: boolean;
  categoria?: Categoria;
  tipoInicial: TipoLancamento;
  onSave: (dados: DadosCategoria) => Promise<ErrosCategoria>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

const TIPOS: { id: TipoLancamento; label: string }[] = [
  { id: 'despesa', label: 'Despesa' },
  { id: 'receita', label: 'Receita' },
];

export function CategoryFormSheet({ visible, categoria, tipoInicial, onSave, onDelete, onClose }: CategoryFormSheetProps) {
  const { colors } = useTheme();
  const editando = !!categoria;

  const [nome, setNome] = useState(categoria?.nome ?? '');
  const [tipo, setTipo] = useState<TipoLancamento>(categoria?.tipo ?? tipoInicial);
  const [cor, setCor] = useState(categoria?.cor ?? CORES_CATEGORIA[0]);
  const [icone, setIcone] = useState<IconName>(categoria?.icone ?? ICONES_CATEGORIA[0]);
  const [erros, setErros] = useState<ErrosCategoria>({});
  const [salvando, setSalvando] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const salvar = async () => {
    setSalvando(true);
    try {
      const resultado = await onSave({ nome, tipo, cor, icone });
      setErros(resultado);
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
      <Button title={editando ? 'Salvar' : 'Criar categoria'} style={styles.flex} loading={salvando} onPress={salvar} />
    </>
  );

  return (
    <Sheet visible={visible} title={editando ? 'Editar categoria' : 'Nova categoria'} onClose={onClose} footer={footer}>
      {confirmarExclusao ? (
        <View style={[styles.confirm, { backgroundColor: colors.negativeBg }]}>
          <Ionicons name="trash-outline" size={22} color={colors.negative} />
          <AppText variant="body" style={styles.flex}>
            Excluir “{categoria?.nome}”? Ela não aparece mais para novos lançamentos e orçamentos, mas os lançamentos
            antigos continuam com esse nome.
          </AppText>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.preview}>
            <View style={[styles.previewIcon, { backgroundColor: cor }]}>
              <Ionicons name={icone} size={26} color="#FFFFFF" />
            </View>
            <AppText variant="bodyStrong" numberOfLines={1} style={styles.flex}>
              {nome.trim() || 'Nome da categoria'}
            </AppText>
          </View>

          <Input
            label="Nome"
            placeholder="Ex.: Academia"
            value={nome}
            onChangeText={(t) => {
              setNome(t);
              if (erros.nome) setErros({});
            }}
            maxLength={NOME_MAX}
            error={erros.nome}
            autoFocus={!editando}
            returnKeyType="done"
          />

          <View>
            <AppText variant="overline" style={styles.section}>
              Tipo
            </AppText>
            {editando ? (
              <AppText variant="caption">
                {tipo === 'despesa' ? 'Despesa' : 'Receita'} · o tipo não pode ser alterado depois de criado.
              </AppText>
            ) : (
              <View style={styles.wrap} accessibilityRole="radiogroup">
                {TIPOS.map((t) => (
                  <Chip key={t.id} label={t.label} selected={tipo === t.id} onPress={() => setTipo(t.id)} />
                ))}
              </View>
            )}
          </View>

          <View>
            <AppText variant="overline" style={styles.section}>
              Cor
            </AppText>
            <View style={styles.wrap} accessibilityRole="radiogroup">
              {CORES_CATEGORIA.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCor(c)}
                  accessibilityRole="radio"
                  accessibilityLabel={`Cor ${c}`}
                  accessibilityState={{ checked: cor === c }}
                  style={[styles.swatch, { backgroundColor: c, borderColor: cor === c ? colors.title : 'transparent' }]}
                >
                  {cor === c ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <AppText variant="overline" style={styles.section}>
              Ícone
            </AppText>
            <View style={styles.wrap} accessibilityRole="radiogroup">
              {ICONES_CATEGORIA.map((i) => {
                const selecionado = icone === i;
                return (
                  <Pressable
                    key={i}
                    onPress={() => setIcone(i)}
                    accessibilityRole="radio"
                    accessibilityLabel={`Ícone ${i.replace('-outline', '')}`}
                    accessibilityState={{ checked: selecionado }}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: selecionado ? colors.mint : colors.bg2,
                        borderColor: selecionado ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    <Ionicons name={i} size={22} color={selecionado ? colors.onMint : colors.title} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: 18, paddingTop: 4 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  iconOption: { width: 48, height: 48, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  confirm: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 14, alignItems: 'flex-start' },
});
