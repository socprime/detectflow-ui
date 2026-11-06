export const INTEGRATION_FILTER_ALL = 'all' as const;

export const INTEGRATION_CATEGORY = {
  SOC_PRIME: 'soc_prime',
  SIEM: 'siem',
  EDR: 'aidr_bastion',
  DATA_LAKE: 'datalake',
  LLM_FIREWALL: 'llm_firewall',
  GIT_HOSTING: 'git_hosting',
} as const;

export const INTEGRATION_TYPE = {
  SOCPRIME_TDM: 'socprime_tdm',
  MICROSOFT_SENTINEL: 'microsoft_sentinel',
} as const;

export const INTEGRATION_STATUS = {
  CONNECTED: 'connected',
} as const;
