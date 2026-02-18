import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { routeHelpers } from '@/models/router/routes';
import { ClockIcon, PlusIcon, Server, UploadIcon } from 'lucide-react';
import { ExternalRepositoryData } from './ExternalRepositoryData';

interface RepositoriesEmptyStateProps {
  loading?: boolean;
  repositoryType?: string;
  repositoryId?: string;
  onUpload?: () => void;
}

export const RepositoriesEmptyState: React.FC<RepositoriesEmptyStateProps> = ({
  loading,
  repositoryType,
  repositoryId,
  onUpload,
}) => {
  if (
    repositoryType === 'external' &&
    ExternalRepositoryData[repositoryId ?? '']?.isUnderDevelopment
  ) {
    return (
      <EmptyState
        Icon={ClockIcon}
        title="Coming Soon"
        description="We're working on adding support for this open-source repository. You'll be able to use it in one of the next versions"
      />
    );
  }

  return (
    <EmptyState
      Icon={Server}
      title="No Rules Yet"
      description="Get started by creating a new rule or uploading rules from YAML files."
      actions={
        repositoryId &&
        repositoryType === 'local' && (
          <div className="flex gap-2">
            <Button
              className="text-xs"
              size="l"
              variant="primary"
              to={routeHelpers.settingsRepositoriesRuleCreate(repositoryId)}
              loading={loading}
            >
              <PlusIcon className="size-4" />
              Add Rule
            </Button>
            <Button
              className="text-xs"
              size="l"
              variant="secondaryOutline"
              onClick={onUpload}
              loading={loading}
            >
              <UploadIcon className="size-4" />
              Upload
            </Button>
          </div>
        )
      }
    />
  );
};
