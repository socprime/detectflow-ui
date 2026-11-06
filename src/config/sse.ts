import { API_BASE_URL } from './environment';

export const dashboardSSEConfig = {
  streamUrl: `${API_BASE_URL}/dashboard/stream`,
  snapshotUrl: `${API_BASE_URL}/dashboard/snapshot`,
  enabled: true,
  reconnect: true,
  reconnectInterval: 3000,
  reconnectAttempts: 10,
};

export const correlationDashboardSSEConfig = {
  streamUrl: `${API_BASE_URL}/correlation_dashboard/stream`,
  reconnect: true,
  reconnectInterval: 3000,
  reconnectAttempts: 10,
};

export const attackChainsSSEConfig = {
  streamUrl: `${API_BASE_URL}/attack_chains/chains/stream`,
  invalidationEventName: 'attack_chains_changed',
  enabled: true,
  reconnect: true,
  reconnectInterval: 3000,
  reconnectAttempts: 10,
};

