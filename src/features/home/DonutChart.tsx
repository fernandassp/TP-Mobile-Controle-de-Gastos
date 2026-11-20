import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export interface DonutSlice {
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  trackColor: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

/** Gráfico de rosca em SVG, com conteúdo (ex.: total) no centro. */
export function DonutChart({ slices, trackColor, size = 120, strokeWidth = 18, children }: DonutChartProps) {
  const center = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acumulado = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} importantForAccessibility="no-hide-descendants">
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle cx={center} cy={center} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
          {total > 0 &&
            slices.map((s, i) => {
              const len = (s.value / total) * circumference;
              const circle = (
                <Circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={r}
                  stroke={s.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${len} ${circumference - len}`}
                  strokeDashoffset={-acumulado}
                />
              );
              acumulado += len;
              return circle;
            })}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
