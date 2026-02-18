import { Button } from '@/components/Button';
import { LucideProps } from 'lucide-react';

interface EmptyStateProps {
  Icon?: React.FC<LucideProps>;
  title?: string;
  description?: string;
  path?: string;
  action?: React.ReactNode;
  actions?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  Icon,
  title,
  description,
  path,
  action,
  actions,
}) => {
  return (
    <div className="bg-background flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-16">
        {Icon && (
          <div className="bg-success/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <Icon size={48} className="text-success" />
          </div>
        )}
        {title && <h3 className="text-default mb-3 text-2xl font-semibold">{title}</h3>}
        {description && (
          <p className="text-gray-chateau mb-8 max-w-md text-center text-xs">{description}</p>
        )}
        {path && (
          <Button to={path} variant="primary" size="l">
            {action}
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
};
