export type Environment = 'local' | 'dev' | 'prod';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const ALLOWED_DOMAINS: Record<Environment, readonly string[]> = {
  local: ['tdm.socprime.com'],
  dev: ['tdm.socprime.com'],
  prod: ['tdm.socprime.com'],
} as const;

export const ENVIRONMENT_DOMAINS: Record<Environment, string> = {
  local: 'tdm.socprime.com',
  dev: 'tdm.socprime.com',
  prod: 'tdm.socprime.com',
} as const;

export const getCurrentEnvironment = (): Environment => {
  const envVar = import.meta.env.VITE_ENVIRONMENT_STAGE?.toLowerCase().trim();
  if (envVar && ['local', 'dev', 'prod'].includes(envVar)) {
    return envVar as Environment;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();

    if (
      hostname.includes('tdm.socprime.com') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      return 'dev';
    }

    if (hostname.includes('tdm.socprime.com')) {
      return 'prod';
    }
  }

  return 'local';
};

export const isValidDomain = (domain: string, environment?: Environment): boolean => {
  const env = environment || getCurrentEnvironment();
  const allowedDomains = ALLOWED_DOMAINS[env];

  const normalizedDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  return allowedDomains.includes(normalizedDomain);
};

export const getEnvironmentDomain = (environment?: Environment): string => {
  const env = environment || getCurrentEnvironment();
  return ENVIRONMENT_DOMAINS[env];
};
