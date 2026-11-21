import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, Chip, EmptyState, useToast } from '../components';
import { CategoryFormSheet } from '../features/categorias/CategoryFormSheet';
import { categoriasAtivas, podeEditar } from '../features/categorias/rules';
import { useCategorias } from '../hooks/useCategorias';
import { useTheme } from '../theme';
import type { Categoria, TipoLancamento } from '../types';

const TIPOS: { id: TipoLancamento; label: string }[] = [
  { id: 'despesa', label: 'Despesas' },
  { id: 'receita', label: 'Receitas' },
];

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const { categorias, salvar, excluir } = useCategorias();
  const [tipo, setTipo] = useState<TipoLancamento>('despesa');
  const [form, setForm] = useState<{ aberto: boolean; categoria?: Categoria; versao: number }>({ aberto: false, versao: 0 });

  const doTipo = useMemo(() => categoriasAtivas(categorias, tipo), [categorias, tipo]);
  const personalizadas = doTipo.filter((c) => !c.padrao);
  const padrao = doTipo.filter((c) => c.padrao);

  const abrirNova = () => setForm((f) => ({ aberto: true, versao: f.versao + 1 }));
  const fechar = () => setForm((f) => ({ ...f, aberto: false }));

  const linha = (c: Categoria, i: number, total: number) => {
    const editavel = podeEditar(c);
    return (
      <Pressable
        key={c.id}
        disabled={!editavel}
        onPress={() => setForm((f) => ({ aberto: true, categoria: c, versao: f.versao + 1 }))}
        accessibilityRole={editavel ? 'button' : undefined}
        accessibilityLabel={editavel ? `${c.nome}, editar` : `${c.nome}, categoria padrão`}
        style={({ pressed }) => [
          styles.row,
          {
            borderBottomColor: colors.border,
            borderBottomWidth: i < total - 1 ? StyleSheet.hairlineWidth : 0,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: c.cor }]}>
          <Ionicons name={c.icone} size={20} color="#FFFFFF" />
        </View>
        <AppText variant="body" numberOfLines={1} style={styles.flex}>
          {c.nome}
        </AppText>
        {editavel ? (
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        ) : (
          <View style={[styles.tag, { backgroundColor: colors.soft }]}>
            <AppText variant="caption">Padrão</AppText>
          </View>
        )}
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
          <AppText variant="h1">Categorias</AppText>
          <Chip role="button" icon="add" label="Nova" height={44} onPress={abrirNova} />
        </View>

        <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Tipo">
          {TIPOS.map((t) => (
            <Chip key={t.id} label={t.label} selected={tipo === t.id} onPress={() => setTipo(t.id)} />
          ))}
        </View>

        <AppText variant="overline" style={styles.section} accessibilityRole="header">
          Suas categorias
        </AppText>
        <Card style={styles.listCard}>
          {personalizadas.length > 0 ? (
            personalizadas.map((c, i) => linha(c, i, personalizadas.length))
          ) : (
            <EmptyState
              icon="pricetags-outline"
              title="Nenhuma categoria sua"
              description={`Crie categorias de ${tipo} do seu jeito, com nome, cor e ícone.`}
              actionLabel="Criar categoria"
              actionVariant="secondary"
              onAction={abrirNova}
            />
          )}
        </Card>

        <AppText variant="overline" style={styles.section} accessibilityRole="header">
          Padrão do app
        </AppText>
        <Card style={styles.listCard}>{padrao.map((c, i) => linha(c, i, padrao.length))}</Card>
      </ScrollView>

      <CategoryFormSheet
        key={form.versao}
        visible={form.aberto}
        categoria={form.categoria}
        tipoInicial={tipo}
        onClose={fechar}
        onSave={async (dados) => {
          try {
            const erros = await salvar(dados, form.categoria?.id);
            if (Object.keys(erros).length === 0) {
              fechar();
              toast.success(form.categoria ? 'Categoria atualizada.' : 'Categoria criada.');
            }
            return erros;
          } catch {
            toast.error('Não foi possível salvar a categoria.');
            return {};
          }
        }}
        onDelete={async () => {
          if (!form.categoria) return;
          try {
            await excluir(form.categoria.id);
            fechar();
            toast.success('Categoria excluída.');
          } catch {
            toast.error('Não foi possível excluir a categoria.');
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  section: { marginHorizontal: 4, marginTop: 6, marginBottom: -6 },
  listCard: { paddingVertical: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 8 },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 100 },
});
