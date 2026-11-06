import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useReturnTo } from '@/hooks';
import type { LogSource } from '@/models/providers/Types/responses/logSources';
import { routeHelpers } from '@/models/router';
import { cn, withReturnTo } from '@/utils';

interface LogSourcesCardProps {
  className?: string;
  logSource: LogSource;
}

export const LogSourcesCard: React.FC<LogSourcesCardProps> = ({ logSource, className }) => {
  const returnTo = useReturnTo();

  return (
    <Link
      className={cn(
        'border-border bg-secondary hover:border-success flex flex-col gap-2 rounded-lg border p-6 text-xs transition-all hover:shadow-lg',
        className,
      )}
      to={withReturnTo(routeHelpers.settingsLogSourceEdit(logSource.id), returnTo)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-success/10 rounded-lg p-3">
            <FileText className="text-success" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="text-default line-clamp-1 truncate text-sm font-semibold break-all whitespace-normal"
              title={logSource.name}
            >
              {logSource.name}
            </h3>
            <p className="text-gray-chateau truncate font-normal">Generic</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
