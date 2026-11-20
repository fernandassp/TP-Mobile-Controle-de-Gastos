import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';

/** Chame uma vez no layout raiz e só renderize o app quando retornar true. */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  // Se a fonte falhar, o app segue com a fonte do sistema.
  return loaded || !!error;
}
