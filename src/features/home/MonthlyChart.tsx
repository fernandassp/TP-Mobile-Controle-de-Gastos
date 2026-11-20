import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AppText } from '../../components';
import { fonts, useTheme } from '../../theme';
import { formatBRL } from '../../utils/format';

interface MonthlyChartProps {
  rotulos: string[];
  valores: number[];
  selecionado: number;
  onSelecionar: (index: number) => void;
}

const CHART_HEIGHT = 150;
const LABELS_HEIGHT = 28;
const PADDING_LEFT = 16; // no Chart Kit, "paddingRight" do style é o recuo da esquerda
const PADDING_TOP = 28;
const HIT = 44;
const TIP_WIDTH = 124;

/** Gráfico de linha "Gastos mês a mês" (RF07). Toque num mês para ver o valor. */
export function MonthlyChart({ rotulos, valores, selecionado, onSelecionar }: MonthlyChartProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const n = valores.length;
  const max = Math.max(...valores, 0);

  const stepX = n > 0 ? (width - PADDING_LEFT) / n : 0;
  const dotX = (i: number) => Math.floor(PADDING_LEFT + stepX * i);
  const dotY = (v: number) => (CHART_HEIGHT / 4) * 3 * (1 - (max > 0 ? v / max : 0)) + PADDING_TOP;

  const valorSelecionado = valores[selecionado] ?? 0;
  const tipLeft = Math.min(Math.max(0, dotX(selecionado) - TIP_WIDTH / 2), Math.max(0, width - TIP_WIDTH));
  const tipTop = Math.max(0, dotY(valorSelecionado) - 38);

  return (
    <View onLayout={(e) => setWidth(Math.floor(e.nativeEvent.layout.width))} style={{ height: CHART_HEIGHT + LABELS_HEIGHT }}>
      {width > 0 ? (
        <>
          <LineChart
            data={{ labels: rotulos, datasets: [{ data: valores }] }}
            width={width}
            height={CHART_HEIGHT}
            fromZero
            bezier
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            withShadow
            style={{ paddingRight: PADDING_LEFT, paddingTop: PADDING_TOP }}
            chartConfig={{
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              fillShadowGradient: colors.primary,
              fillShadowGradientFrom: colors.primary,
              fillShadowGradientFromOpacity: 0.25,
              fillShadowGradientToOpacity: 0,
              color: () => colors.primary,
              labelColor: () => colors.textSecondary,
              propsForDots: { r: '4', strokeWidth: '2', stroke: colors.card },
              propsForBackgroundLines: { strokeWidth: 0 },
              decimalPlaces: 0,
            }}
            getDotColor={(_, i) => (i === selecionado ? colors.title : colors.primary)}
          />

          {/* Balão com o valor do mês selecionado */}
          <View
            pointerEvents="none"
            style={[styles.tip, { top: tipTop, left: tipLeft, width: TIP_WIDTH, backgroundColor: colors.title }]}
          >
            <AppText variant="caption" color={colors.card} style={styles.tipText} numberOfLines={1}>
              {rotulos[selecionado]} · {formatBRL(valorSelecionado)}
            </AppText>
          </View>

          {/* Rótulos dos meses e áreas de toque de 44 px */}
          {rotulos.map((rotulo, i) => (
            <Pressable
              key={rotulo + i}
              onPress={() => onSelecionar(i)}
              accessibilityRole="button"
              accessibilityLabel={`${rotulo}: ${formatBRL(valores[i])}`}
              accessibilityState={{ selected: i === selecionado }}
              style={[styles.hit, { left: dotX(i) - HIT / 2, width: HIT }]}
            >
              <AppText
                variant="caption"
                color={i === selecionado ? 'title' : 'textSecondary'}
                style={{ fontFamily: i === selecionado ? fonts.bodySemi : fonts.body, fontSize: 12 }}
              >
                {rotulo}
              </AppText>
            </Pressable>
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tip: { position: 'absolute', borderRadius: 10, paddingVertical: 4, alignItems: 'center' },
  tipText: { fontWeight: '600' },
  hit: { position: 'absolute', top: 0, bottom: 0, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 },
});