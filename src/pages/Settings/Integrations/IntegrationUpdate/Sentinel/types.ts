export interface PresetOption {
  label: string;
  value: string;
}

export interface SentinelFormValues {
  staging_enabled: boolean;
  staging_period_value: number;
  staging_period_unit: string;
  staging_run_frequency: string;
  staging_total_hits_limit: number;
  staging_unique_hosts_limit: number;
  staging_unique_users_limit: number;
  preset: string;
}

export const sentinelFormDefaults: SentinelFormValues = {
  staging_enabled: true,
  staging_period_value: 1,
  staging_period_unit: 'hours',
  staging_run_frequency: 'hour-by-hour',
  staging_total_hits_limit: 0,
  staging_unique_hosts_limit: 0,
  staging_unique_users_limit: 0,
  preset: '',
};
