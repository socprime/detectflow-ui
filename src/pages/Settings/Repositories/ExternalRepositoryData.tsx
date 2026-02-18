import { JSX } from 'react';
import { ElasticIcon, SentinelIcon, SigmaIcon, SplunkIcon } from './Icons';

export const ExternalRepositoryData: Record<
  string,
  {
    name: string;
    icon: (props: { className?: string }) => JSX.Element;
    isUnderDevelopment: boolean;
  }
> = {
  'f3fbb73f-6cee-54cd-b3eb-f68d127a27ab': {
    name: 'SigmaHQ',
    icon: ({ className }: { className?: string }) => <SigmaIcon className={className} />,
    isUnderDevelopment: false,
  },
  '2cc3a20b-7773-5103-b5f7-ee86c8f76682': {
    name: 'Splunk (GitHub)',
    icon: ({ className }: { className?: string }) => <SplunkIcon className={className} />,
    isUnderDevelopment: true,
  },
  '3130c761-5464-5492-ba09-3c81852e7d45': {
    name: 'Elastic (GitHub)',
    icon: ({ className }: { className?: string }) => <ElasticIcon className={className} />,
    isUnderDevelopment: true,
  },
  '37c375d5-597f-5a9b-90c9-5d84d470370c': {
    name: 'Microsoft Azure Sentinel (GitHub)',
    icon: ({ className }: { className?: string }) => <SentinelIcon className={className} />,
    isUnderDevelopment: true,
  },
};
