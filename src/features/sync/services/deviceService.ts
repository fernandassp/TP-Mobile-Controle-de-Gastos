import * as Device from 'expo-device';
import { Platform } from 'react-native';

import { getDeviceId } from './deviceIdService';
import { Device as DeviceInfo } from '../types/device';

export async function getDeviceInfo(
  userId: string
): Promise<DeviceInfo> {
  const deviceId = await getDeviceId();

  const platform =
    Platform.OS === 'android' ||
    Platform.OS === 'ios' ||
    Platform.OS === 'web'
      ? Platform.OS
      : 'web';

  return {
    id: deviceId,
    userId,
    platform,
    createdAt: new Date().toISOString(),
    lastSyncAt: null,
  };
}