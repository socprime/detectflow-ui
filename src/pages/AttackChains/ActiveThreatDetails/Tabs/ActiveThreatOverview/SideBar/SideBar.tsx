import {
  Building2Icon,
  CalendarIcon,
  GlobeIcon,
  LayersIcon,
  ShieldIcon,
  Users2Icon,
} from 'lucide-react';

import { ActiveThreatDetail } from '@/models/providers';
import { cn, formatDate } from '@/utils';
import { Badge, ConditionalContent, Skeleton } from '@socprime/react-ui';

interface SideBarProps {
  className?: string;
  data?: ActiveThreatDetail;
  loading?: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ data, className, loading }) => {
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
        <div className={cn('flex flex-col gap-5', className)}>
          {data?.techniques && data?.techniques?.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Techniques & Subtechniques</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.techniques?.map(({ id, name }) => (
                  <Badge className={badgeClasses} variant="outline" key={id}>
                    {name} ({id})
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.threat_actors && data?.threat_actors?.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Users2Icon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Threat Actors</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.threat_actors?.map(({ id, name }) => (
                  <Badge className={badgeClasses} variant="outline" key={id}>
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.created && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Release Date</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={badgeClasses} variant="outline">
                  {formatDate(data?.created, 'datetime')}
                </Badge>
              </div>
            </div>
          )}
          {data?.industries && data?.industries?.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Building2Icon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Affected Industries</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.industries?.map((industry) => (
                  <Badge className={badgeClasses} variant="outline" key={industry}>
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.geographies && data?.geographies?.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <GlobeIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Affected Geographies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.geographies?.map((region) => (
                  <Badge className={badgeClasses} variant="outline" key={region}>
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data?.threat_types && data?.threat_types?.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <LayersIcon className="text-default size-3.5" />
                <h4 className="text-default text-2xs uppercase">Threat Type</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.threat_types?.map((type) => (
                  <Badge className={badgeClasses} variant="outline" key={type}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
