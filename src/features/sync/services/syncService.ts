import { getNetworkStatus } from './networkMonitor';
import { setSyncStatus } from './syncStatusStore';

export async function checkSyncAvailability(): Promise<boolean> {
  const network = await getNetworkStatus();

  const isOnline =
    network.isConnected &&
    network.isInternetReachable !== false;

  if (!isOnline) {
    setSyncStatus('offline');
    return false;
  }

  return true;
}

export async function startSync(): Promise<boolean> {
  const canSync = await checkSyncAvailability();

  if (!canSync) {
    return false;
  }

  setSyncStatus('syncing');

  return true;
}

export function finishSync(): void {
  setSyncStatus('synced');
}

export function failSync(): void {
  setSyncStatus('error');
}