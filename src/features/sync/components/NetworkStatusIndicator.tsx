
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function NetworkStatusIndicator() {
  const networkStatus = useNetworkStatus();

  let iconName: keyof typeof Ionicons.glyphMap = 'cloud-outline';
  let color = '#D97706';

  if (networkStatus) {
    if (
      !networkStatus.isConnected ||
      networkStatus.isInternetReachable === false
    ) {
      iconName = 'cloud-offline-outline';
      color = '#DC2626';
    } else if (networkStatus.isInternetReachable === true) {
      iconName = 'cloud-done-outline';
      color = '#16A34A';
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
