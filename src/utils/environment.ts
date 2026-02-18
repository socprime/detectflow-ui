import {
  getCurrentEnvironment,
  getEnvironmentDomain,
  isValidDomain,
  type Environment,
} from '@/config/environment';

export interface BuildExternalUrlParams {
  path: string;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  environment?: Environment;
  useHttps?: boolean;
}

export const buildExternalUrl = (params: BuildExternalUrlParams): string => {
  const { path, queryParams = {}, environment, useHttps = true } = params;

  if (!path || typeof path !== 'string') {
    throw new Error('Path must be a non-empty string');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const domain = getEnvironmentDomain(environment);
  const protocol = useHttps ? 'https' : 'http';
  const baseUrl = `${protocol}://${domain}${normalizedPath}`;

  if (!isValidDomain(domain, environment)) {
    throw new Error(
      `Domain ${domain} is not allowed for environment ${environment || getCurrentEnvironment()}`,
    );
  }

  const queryString = buildQueryStringEncoded(queryParams);

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const buildQueryStringEncoded = (
  params: Record<string, string | number | boolean | null | undefined>,
): string => {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(String(key));
      const encodedValue = encodeURIComponent(String(value));
      return `${encodedKey}=${encodedValue}`;
    });

  return entries.join('&');
};

export const isSafeUrl = (url: string, environment?: Environment): boolean => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    return isValidDomain(domain, environment);
  } catch {
    return false;
  }
};

export const getEnvironmentInfo = () => {
  const environment = getCurrentEnvironment();
  const domain = getEnvironmentDomain(environment);

  return {
    environment,
    domain,
    isLocal: environment === 'local',
    isDev: environment === 'dev',
    isProd: environment === 'prod',
  };
};
