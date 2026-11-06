import { FolderIcon } from 'lucide-react';
import { ExternalRepositoryData } from './ExternalRepositoryData';

import GitlabIcon from '@/assets/svg/gitlab.svg?react';
import HOSIcon from '@/assets/svg/hos.svg?react';
import SocPrimeIcon from '@/assets/svg/soc-prime.svg?react';
import type { RepositoryType } from '@/models/providers/Types/responses/repositories';
import { cn } from '@/utils';

interface GetRepositoryIconProps {
  id: string;
  type: RepositoryType;
  isActive?: boolean;
  className?: string;
}

export const getRepositoryIcon = ({
  id,
  type,
  isActive = false,
  className,
}: GetRepositoryIconProps) => {
  const classes = `${isActive ? 'text-success' : 'text-gray-chateau'} ${className}`;

  switch (type) {
    case 'api':
      return <SocPrimeIcon className={cn(classes, '-mb-1')} />;
    case 'local':
      return <FolderIcon className={classes} />;
    case 'external':
      return ExternalRepositoryData[id]?.icon(classes) || null;
    case 'hos':
      return <HOSIcon className={classes} />;
    case 'gitlab':
      return <GitlabIcon className={classes} />;
    default:
      return null;
  }
};
