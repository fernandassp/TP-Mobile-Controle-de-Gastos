import { Ionicons } from '@expo/vector-icons';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, useTheme } from '../theme';
import { AppText } from './AppText';

export interface ToastOptions {
  type?: 'success' | 'error';
  message: string;
  /** Texto de ação opcional, ex.: "Desfazer". */
  actionLabel?: string;
  onAction?: () => void;
  /** Duração em ms. Padrão: 4000 (6000 quando há ação). */
  duration?: number;
}

interface ToastApi {
  show: (options: ToastOptions) => void;
  success: (message: string, extra?: Omit<ToastOptions, 'type' | 'message'>) => void;
  error: (message: string, extra?: Omit<ToastOptions, 'type' | 'message'>) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Coloque uma vez no layout raiz, dentro do SafeAreaProvider:
 *   <ToastProvider>{children}</ToastProvider>
 * `bottomOffset` é a altura da barra de abas, para o toast não ficar por cima dela.
 */
export function ToastProvider({ children, bottomOffset = 96 }: { children: ReactNode; bottomOffset?: number }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [progress]);

  const show = useCallback(
    (options: ToastOptions) => {
      if (timer.current) clearTimeout(timer.current);
      setToast(options);
      AccessibilityInfo.announceForAccessibility(options.message);
      Animated.timing(progress, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timer.current = setTimeout(hide, options.duration ?? (options.actionLabel ? 6000 : 4000));
    },
    [hide, progress],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      hide,
      success: (message, extra) => show({ ...extra, type: 'success', message }),
      error: (message, extra) => show({ ...extra, type: 'error', message }),
    }),
    [show, hide],
  );

  const isError = toast?.type === 'error';

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Animated.View
        pointerEvents={toast ? 'box-none' : 'none'}
        style={[
          styles.wrap,
          {
            bottom: insets.bottom + bottomOffset,
            opacity: progress,
            transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
          },
        ]}
      >
        {toast ? (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.toast, { backgroundColor: isError ? colors.toastError : colors.toast }]}
          >
            <Ionicons
              name={isError ? 'alert-circle-outline' : 'checkmark-circle-outline'}
              size={22}
              color={isError ? '#FFFFFF' : '#72D0C4'}
            />
            <AppText variant="body" color="#FFFFFF" style={styles.message}>
              {toast.message}
            </AppText>
            {toast.actionLabel ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  toast.onAction?.();
                  hide();
                }}
                style={styles.action}
              >
                <AppText variant="bodyStrong" color="#72D0C4">
                  {toast.actionLabel}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: {
    width: '100%',
    maxWidth: 560,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  message: { flex: 1, fontWeight: '500' },
  action: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' },
});
