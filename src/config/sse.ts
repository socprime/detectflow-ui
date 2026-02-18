const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const SSE_ENABLED = import.meta.env.VITE_SSE_ENABLED !== 'false';
const SSE_RECONNECT = import.meta.env.VITE_SSE_RECONNECT !== 'false';
const SSE_RECONNECT_INTERVAL = Number(import.meta.env.VITE_SSE_RECONNECT_INTERVAL) || 3000;
const SSE_RECONNECT_ATTEMPTS = Number(import.meta.env.VITE_SSE_RECONNECT_ATTEMPTS) || 10;

export const getSSEStreamUrl = (): string => {
  return `${API_BASE_URL}/dashboard/stream`;
};

export const getSSESnapshotUrl = (): string => {
  return `${API_BASE_URL}/dashboard/snapshot`;
};

export const dashboardSSEConfig = {
  enabled: SSE_ENABLED,
  streamUrl: getSSEStreamUrl(),
  snapshotUrl: getSSESnapshotUrl(),
  reconnect: SSE_RECONNECT,
  reconnectInterval: SSE_RECONNECT_INTERVAL,
  reconnectAttempts: SSE_RECONNECT_ATTEMPTS,
};
