export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

let currentStatus: SyncStatus = 'offline';

const listeners = new Set<(status: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function setSyncStatus(status: SyncStatus): void {
  if (currentStatus === status) return;

  currentStatus = status;

  listeners.forEach((listener) => listener(currentStatus));
}

export function subscribeToSyncStatus(
  listener: (status: SyncStatus) => void
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}