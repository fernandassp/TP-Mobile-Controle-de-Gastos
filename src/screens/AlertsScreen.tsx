import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, EmptyState } from '../components';
import { useAlertas, type AlertaDetalhado } from '../hooks/useAlertas';
import { useTheme } from '../theme';
import { dayLabel, formatTime } from '../utils/format';

interface AlertsScreenProps {
  onBack?: () => void;
}

export default function AlertsScreen({ onBack }: AlertsScreenProps) {
  const { colors } = useTheme();
  const { itens, naoLidos, marcarComoLido, marcarTodosComoLidos } = useAlertas();
  const now = useMemo(() => new Date(), []);

  const renderItem = ({ item }: { item: AlertaDetalhado }) => {
    const { alerta } = item;
    const limite = alerta.nivel === 'limite';
    const cor = limite ? colors.negative : colors.warning;
    const data = new Date(alerta.dataHora);
    return (
      <Pressable
        onPress={() => marcarComoLido(alerta.id)}
        accessibilityRole="button"
        accessibilityLabel={`${alerta.lido ? '' : 'Não lido. '}${item.titulo}. ${alerta.mensagem}`}
        accessibilityHint={alerta.lido ? undefined : 'Marca como lido'}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Card style={[styles.card, !alerta.lido && { borderColor: cor, borderWidth: 1.5 }]}>
          <View style={[styles.icon, { backgroundColor: limite ? colors.negativeBg : colors.warningBg }]}>
            <Ionicons name={limite ? 'alert-circle-outline' : 'warning-outline'} size={22} color={cor} />
          </View>
          <View style={styles.flex}>
            <AppText variant="bodyStrong" color={alerta.lido ? 'text' : cor}>
              {item.titulo}
            </AppText>
            <AppText variant="body">{alerta.mensagem}</AppText>
            <AppText variant="caption" style={styles.date}>
              {dayLabel(data, now)} · {formatTime(data)}
            </AppText>
          </View>
          {!alerta.lido ? <View style={[styles.dot, { backgroundColor: cor }]} /> : null}
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        data={itens}
        keyExtractor={(i) => i.alerta.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 92 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {onBack ? (
              <Pressable
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar para Orçamentos"
                hitSlop={8}
                style={styles.back}
              >
                <Ionicons name="chevron-back" size={22} color={colors.title} />
                <AppText variant="bodyStrong" color="title">
                  Orçamentos
                </AppText>
              </Pressable>
            ) : null}
            <View style={styles.titleRow}>
              <AppText variant="h1">Alertas</AppText>
              {naoLidos > 0 ? (
                <Pressable onPress={marcarTodosComoLidos} accessibilityRole="button" hitSlop={8}>
                  <AppText variant="bodyStrong" color="primaryText">
                    Marcar todos como lidos
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <EmptyState
              icon="notifications-outline"
              title="Nenhum alerta"
              description="Você é avisado aqui quando os gastos de uma categoria chegam perto do limite do orçamento."
            />
          </Card>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1, gap: 2 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { gap: 8, marginBottom: 14 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, alignSelf: 'flex-start', marginLeft: -6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  card: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1.5, borderColor: 'transparent' },
  icon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  date: { marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  separator: { height: 10 },
  emptyCard: { paddingVertical: 0 },
});
