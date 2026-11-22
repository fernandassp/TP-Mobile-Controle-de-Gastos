import { useEffect, useState } from 'react';

import {
  getSyncStatus,
  subscribeToSyncStatus,
  SyncStatus,
} from '../services/syncStatusStore';

export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus);

  useEffect(() => {
    return subscribeToSyncStatus(setStatus);
  }, []);

  return status;
}