export const PIPELINES_TAB_PARAM = 'tab';

export const PIPELINES_TABS = {
  matching: 'matching',
  chaining: 'chaining',
} as const;

export type PipelinesTabValue = (typeof PIPELINES_TABS)[keyof typeof PIPELINES_TABS];

export const PIPELINES_DEFAULT_TAB: PipelinesTabValue = PIPELINES_TABS.matching;

const PIPELINES_TAB_VALUES: readonly PipelinesTabValue[] = Object.values(PIPELINES_TABS);

export const isPipelinesTabValue = (value: unknown): value is PipelinesTabValue =>
  typeof value === 'string' && (PIPELINES_TAB_VALUES as readonly string[]).includes(value);
