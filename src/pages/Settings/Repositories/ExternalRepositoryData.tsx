import ElasticIcon from '@/assets/svg/elastic.svg?react';
import SentinelIcon from '@/assets/svg/sentinel.svg?react';
import SigmaIcon from '@/assets/svg/sigma.svg?react';
import SplunkIcon from '@/assets/svg/splunk.svg?react';
import { cn } from '@/utils';
import { JSX } from 'react';

interface ExternalRepositoryData {
  name: string;
  icon: (className: string) => JSX.Element;
  isUnderDevelopment: boolean;
}

export const ExternalRepositoryData: Record<string, ExternalRepositoryData> = {
  'f3fbb73f-6cee-54cd-b3eb-f68d127a27ab': {
    name: 'SigmaHQ',
    icon: (className) => <SigmaIcon className={cn('size-4', className)} />,
    isUnderDevelopment: false,
  },
  '2cc3a20b-7773-5103-b5f7-ee86c8f76682': {
    name: 'Splunk (GitHub)',
    icon: (className) => <SplunkIcon className={cn('size-4', className)} />,
    isUnderDevelopment: true,
  },
  '3130c761-5464-5492-ba09-3c81852e7d45': {
    name: 'Elastic (GitHub)',
    icon: (className) => <ElasticIcon className={cn('size-4', className)} />,
    isUnderDevelopment: true,
  },
  '37c375d5-597f-5a9b-90c9-5d84d470370c': {
    name: 'Microsoft Azure Sentinel (GitHub)',
    icon: (className) => <SentinelIcon className={cn('size-4', className)} />,
    isUnderDevelopment: true,
  },
};
