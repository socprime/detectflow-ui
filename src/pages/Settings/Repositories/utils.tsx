import { RepositoryType } from '@/models/providers/Types/Response';
import { FolderIcon } from 'lucide-react';
import { ExternalRepositoryData } from './ExternalRepositoryData';
import { SocPrimeIcon } from './Icons';

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
      return ExternalRepositoryData[id]?.icon({ className: classes }) || null;
    default:
      return null;
  }
};
