export type Device = {
  id: string;
  userId: string;
  platform: 'android' | 'ios' | 'web';
  createdAt: string;
  lastSyncAt: string | null;
};