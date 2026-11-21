import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  percentual: number;
  color: string;
  marcador?: number;
  accessibilityLabel?: string;
}

export function ProgressBar({ percentual, color, marcador, accessibilityLabel }: ProgressBarProps) {
  const { colors } = useTheme();
  const largura = Math.max(0, Math.min(100, percentual));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(largura) }}
      style={[styles.track, { backgroundColor: colors.soft }]}
    >
      <View style={[styles.fill, { width: `${largura}%`, backgroundColor: color }]} />
      {marcador && marcador < 100 ? (
        <View style={[styles.marker, { left: `${marcador}%`, backgroundColor: colors.card }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 5, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', borderRadius: 5 },
  marker: { position: 'absolute', top: 0, bottom: 0, width: 2, marginLeft: -1 },
});
