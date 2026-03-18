import SocPrimeIcon from '@/assets/svg/soc-prime.svg?react';
import { RepositoryType } from '@/models/providers/Types/Response';
import { FolderIcon } from 'lucide-react';
import { ExternalRepositoryData } from './ExternalRepositoryData';

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
      return <SocPrimeIcon className={classes} />;
    case 'local':
      return <FolderIcon className={classes} />;
    case 'external':
      return ExternalRepositoryData[id]?.icon(classes) || null;
    default:
      return null;
  }
};
