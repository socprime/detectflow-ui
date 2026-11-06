import { api } from '@/models/providers';
import type { ConfigSchema } from '@/models/providers/Types/responses/integrations';

const PROFILE_NAMES_FETCH_LIMIT = 100;
const isArrayConfigProperty = (type: string) => type === 'array';
const isBooleanConfigProperty = (type: string) => type === 'boolean';

export const normalizeProfileName = (name: string): string => name.trim().toLowerCase();

export const configValueToFormString = (value: unknown, type: string): string => {
  if (value == null || value === '') {
    return '';
  }

  if (isArrayConfigProperty(type) && Array.isArray(value)) {
    return value.map(String).join(', ');
  }

  return String(value);
};

export const parseFormValueForConfig = (
  value: string,
  type: string,
): string | string[] | boolean => {
  if (isBooleanConfigProperty(type)) {
    return value === 'true';
  }

  if (!isArrayConfigProperty(type)) {
    return value;
  }

  if (!value.trim()) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const buildFormValuesFromConfig = (
  schema?: ConfigSchema | null,
  config?: Record<string, unknown>,
): Record<string, string> => {
  const values: Record<string, string> = {};

  if (!schema?.properties) {
    return values;
  }

  for (const [key, prop] of Object.entries(schema.properties)) {
    const raw = config?.[key];

    values[key] =
      raw !== undefined && raw !== null
        ? configValueToFormString(raw, prop.type)
        : configValueToFormString(prop.default, prop.type);
  }

  return values;
};

export const serializeConfigForApi = (
  config: Record<string, string>,
  schema: ConfigSchema | null,
): Record<string, unknown> => {
  if (!schema) {
    return config;
  }

  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => {
      const propType = schema.properties[key]?.type ?? 'string';
      return [key, parseFormValueForConfig(value, propType)];
    }),
  );
};

export async function fetchPlatformProfileNames(
  integrationType: string,
  excludeIntegrationId?: string,
): Promise<Set<string>> {
  const response = await api.settings.integrations.getList({
    integration_type: integrationType,
    limit: PROFILE_NAMES_FETCH_LIMIT,
    offset: 0,
  });

  return new Set(
    response.data
      .filter((profile) => profile.id !== excludeIntegrationId)
      .map((profile) => normalizeProfileName(profile.name)),
  );
}
