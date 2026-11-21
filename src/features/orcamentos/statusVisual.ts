import type { ThemeColors } from '../../theme';
import type { IconName, StatusOrcamento } from '../../types';

export function statusVisual(status: StatusOrcamento, colors: ThemeColors) {
  const mapa: Record<StatusOrcamento, { label: string; color: string; bg: string; icon: IconName }> = {
    ok: { label: 'Dentro do limite', color: colors.positive, bg: colors.positiveBg, icon: 'checkmark-circle-outline' },
    atencao: { label: 'Perto do limite', color: colors.warning, bg: colors.warningBg, icon: 'warning-outline' },
    estourado: { label: 'Limite estourado', color: colors.negative, bg: colors.negativeBg, icon: 'alert-circle-outline' },
  };
  return mapa[status];
}
