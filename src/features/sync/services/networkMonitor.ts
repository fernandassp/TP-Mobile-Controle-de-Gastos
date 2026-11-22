import NetInfo, {
  NetInfoState,
} from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
};

export function subscribeToNetworkChanges(
  callback: (status: NetworkStatus) => void
) {
  return NetInfo.addEventListener((state: NetInfoState) => {
    callback({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
    });
  });
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  const state = await NetInfo.fetch();

  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
  };
}