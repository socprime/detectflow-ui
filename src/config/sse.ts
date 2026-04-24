import { API_BASE_URL } from './environment';

export const dashboardSSEConfig = {
  streamUrl: `${API_BASE_URL}/dashboard/stream`,
  snapshotUrl: `${API_BASE_URL}/dashboard/snapshot`,
  enabled: true,
  reconnect: true,
  reconnectInterval: 3000,
  reconnectAttempts: 10,
};
