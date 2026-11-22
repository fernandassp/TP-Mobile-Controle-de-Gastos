import { useEffect, useState } from 'react';

import {
  NetworkStatus,
  subscribeToNetworkChanges,
} from '../services/networkMonitor';

export function useNetworkStatus(): NetworkStatus | null {
  const [networkStatus, setNetworkStatus] =
    useState<NetworkStatus | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNetworkChanges(setNetworkStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  return networkStatus;
}