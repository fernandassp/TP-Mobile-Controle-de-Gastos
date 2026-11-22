
import { View, Text, StyleSheet } from 'react-native';

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

type Props = {
  status: SyncStatus;
};

const statusConfig = {
  synced: {
    icon: '☁️',
    message: 'Sincronizado',
    color: '#16A34A',
  },
  syncing: {
    icon: '🔄',
    message: 'Sincronizando...',
    color: '#D97706',
  },
  offline: {
    icon: '☁️',
    message: 'Sem conexão',
    color: '#DC2626',
  },
  error: {
    icon: '⚠️',
    message: 'Falha na sincronização',
    color: '#DC2626',
  },
};

export function SyncStatusIndicator({ status }: Props) {
  const current = statusConfig[status];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{current.icon}</Text>
      <Text style={[styles.text, { color: current.color }]}>
        {current.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
