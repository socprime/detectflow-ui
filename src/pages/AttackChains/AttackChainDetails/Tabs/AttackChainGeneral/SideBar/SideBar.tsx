import { Building2Icon, GlobeIcon, ShieldIcon, UsersIcon } from 'lucide-react';
import type { ViewInSiemState } from '../../../hooks/useViewInSiem';
import { ViewInSiemControl } from '../ViewInSiem';

import { AttackChainDetailResponse } from '@/models/providers/Types';
import { formatDate } from '@/utils';
import { Badge, ConditionalContent, Skeleton } from '@socprime/react-ui';

interface SideBarProps {
  loading?: boolean;
  data?: AttackChainDetailResponse;
  viewInSiem: ViewInSiemState;
}

export const SideBar: React.FC<SideBarProps> = ({ data, loading, viewInSiem }) => {
  const badgeClasses = 'bg-hover/40 px-2.5 py-1 cursor-default';

  return (
    <ConditionalContent
      loading={!!loading}
      loadingContent={
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-full" rows={10} />
        </div>
      }
      loadedContent={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-gray-chateau text-2xs font-normal">
              Query all related events in your SIEM to investigate this attack chain in depth.
            </p>
            <ViewInSiemControl viewInSiem={viewInSiem} scope="chain" variant="button" />
          </div>
          {data?.techniques && data?.techniques?.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Techniques & Subtechniques</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.techniques?.map(({ name, code }) => (
                  <Badge className={badgeClasses} key={code} variant="outline" title={code}>
                    {name} ({code})
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.threat_actors && data?.threat_actors?.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <UsersIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Threat Actors</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.threat_actors?.map(({ id, name }) => (
                  <Badge className={badgeClasses} key={id} variant="outline" title={name}>
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.first_seen && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Building2Icon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">First Seen</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={badgeClasses} variant="outline">
                  {formatDate(data?.first_seen, 'full')}
                </Badge>
              </div>
            </div>
          )}
          {data?.last_seen && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <GlobeIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Last Seen</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={badgeClasses} variant="outline">
                  {formatDate(data?.last_seen, 'full')}
                </Badge>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
