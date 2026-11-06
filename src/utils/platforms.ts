import { DatabaseIcon, PlugIcon, ShieldCheckIcon } from 'lucide-react';

import ElasticIcon from '@/assets/svg/elastic.svg?react';
import GithubIcon from '@/assets/svg/github.svg?react';
import GitLabIcon from '@/assets/svg/gitlab.svg?react';
import SentinelIcon from '@/assets/svg/sentinel.svg?react';
import SocPrimeIcon from '@/assets/svg/soc-prime.svg?react';
import SplunkIcon from '@/assets/svg/splunk.svg?react';

export const getPlatformIcon = (type: string): React.FC<{ className?: string }> => {
  switch (type) {
    case 'socprime':
      return SocPrimeIcon;
    case 'microsoft_sentinel':
      return SentinelIcon;
    case 'aidr_bastion':
      return ShieldCheckIcon;
    case 'datalake':
      return DatabaseIcon;
    case 'llm_firewall':
      return ShieldCheckIcon;
    case 'github':
      return GithubIcon;
    case 'gitlab':
      return GitLabIcon;
    case 'splunk':
      return SplunkIcon;
    case 'elastic':
      return ElasticIcon;
    default:
      return PlugIcon;
  }
};

export const getCategoryName = (category: string): string => {
  switch (category) {
    case 'soc_prime':
      return 'SOC Prime';
    case 'siem':
      return 'SIEM';
    case 'edr_bastion':
      return 'EDR';
    case 'datalake':
      return 'Data Lake';
    case 'llm_firewall':
      return 'LLM Firewall';
    case 'git_hosting':
      return 'Git Hosting';
    default:
      return category;
  }
};
