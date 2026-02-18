import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';
import { Button } from '../Button';
import { ConditionalContent } from '../ConditionalContent';
import { Skeleton } from '../Loading/Skeleton';

interface PageHeaderProps {
  loading?: boolean;
  title?: string;
  backLink?: string;
  description?: string;
  descriptionSize?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  loading,
  title,
  backLink,
  description,
  descriptionSize = 'md',
  className,
  children,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-6 max-lg:flex-wrap', className)}>
      <div className="flex items-center gap-2">
        {backLink && (
          <Link to={backLink}>
            <Button variant="icon" size="xs">
              <ArrowLeft size={20} />
            </Button>
          </Link>
        )}
        <div className="flex flex-1 flex-col gap-1">
          <ConditionalContent
            loading={!!loading}
            loadingContent={<Skeleton className="h-8 w-64" />}
            loadedContent={<h2 className="text-default text-xl font-medium break-all">{title}</h2>}
          />
          {description && (
            <p
              className={cn(
                'text-gray-chateau break-all',
                descriptionSize === 'sm' ? 'text-2xs' : 'text-sm',
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
};
