import { RepositoryType } from '@/models/providers/Types/Response';

interface GetColorClassForRepositoryTypeProps {
  type?: RepositoryType;
}

export const getColorClassForRepositoryType = ({ type }: GetColorClassForRepositoryTypeProps) => {
  switch (type) {
    case 'api':
      return 'text-light-blue/80';
    case 'local':
      return 'text-purple/80';
    case 'external':
      return 'text-success/80';
    default:
      return 'text-gray-chateau/80';
  }
};

export const getBadgeVariantForRepositoryType = ({ type }: GetColorClassForRepositoryTypeProps) => {
  switch (type) {
    case 'api':
      return 'lightBlue';
    case 'local':
      return 'purple';
    case 'external':
      return 'success';
    default:
      return 'secondary';
  }
};
