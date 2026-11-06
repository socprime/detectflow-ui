export const ATTACK_CHAINS_TAB_PARAM = 'tab';

export const ATTACK_CHAINS_TABS = {
  attackChains: 'attack-chains',
  monitoredThreats: 'monitored-threats',
  monitoredVectors: 'monitored-vectors',
} as const;

export type AttackChainsTabValue = (typeof ATTACK_CHAINS_TABS)[keyof typeof ATTACK_CHAINS_TABS];

export const ATTACK_CHAINS_DEFAULT_TAB: AttackChainsTabValue = ATTACK_CHAINS_TABS.attackChains;

export const ATTACK_CHAINS_TAB_VALUES: readonly AttackChainsTabValue[] =
  Object.values(ATTACK_CHAINS_TABS);

export const isAttackChainsTabValue = (value: unknown): value is AttackChainsTabValue =>
  typeof value === 'string' && (ATTACK_CHAINS_TAB_VALUES as readonly string[]).includes(value);
