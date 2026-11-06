import { type TSeverity } from '@/utils';
import { Skeleton } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

interface ThreatMetadataGridProps {
  loading?: boolean;
  severity?: TSeverity;
  hostname?: string;
  username?: string;
  eventCount?: string | number;
  ruleCount?: string | number;
}

export const ThreatMetadata: React.FC<ThreatMetadataGridProps> = ({
  loading,
  severity,
  hostname,
  username,
  eventCount,
  ruleCount,
}) => {
  return (
    <div className="border-border rounded-lg border">
      <div className="flex">
        <div className="border-border flex flex-1 flex-col gap-1 border-r p-4">
          <div className="text-2xs text-subdued">Severity</div>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : severity ? (
            <div className="flex items-center gap-1.5">
              <Severity arrowClassName="size-5" severity={severity} />
              <span className="text-default text-sm">{severity}</span>
            </div>
          ) : (
            '-'
          )}
        </div>
        <div className="border-border flex flex-1 flex-col gap-1 border-r p-4">
          <div className="text-2xs text-subdued">Hostname</div>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : hostname ? (
            <div className="text-default text-sm">{hostname}</div>
          ) : (
            '-'
          )}
        </div>
        <div className="border-border flex flex-1 flex-col gap-1 border-r p-4">
          <div className="text-2xs text-subdued">Username</div>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : username ? (
            <div className="text-default text-sm">{username}</div>
          ) : (
            '-'
          )}
        </div>
        <div className="border-border flex flex-1 flex-col gap-1 border-r p-4">
          <div className="text-2xs text-subdued">Tagged Events</div>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : eventCount ? (
            <div className="text-default text-sm">{eventCount}</div>
          ) : (
            '-'
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="text-2xs text-subdued">Matched Rules</div>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : ruleCount ? (
            <div className="text-default text-sm">{ruleCount}</div>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
};
