import { FileTextIcon, LayoutGridIcon } from 'lucide-react';
import { generatePath, matchPath, useLocation, useParams, useSearchParams } from 'react-router-dom';

import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';
import { Alert } from '@/components/Alert';
import { routes } from '@/models/router/routes';
import { useActiveThreatsStore } from '@/store';
import { buildUrl, getQueryParamsAsObject } from '@/utils';
import { AsideTab } from '@socprime/react-ui';

export const useTabs = () => {
  const [searchParams] = useSearchParams();
  const queryParams = getQueryParamsAsObject(searchParams);
  const { activeThreatId = '' } = useParams<{ activeThreatId: string }>();
  const data = useActiveThreatsStore((state) => state.detail);
  const { pathname } = useLocation();

  const tabs: AsideTab[] = [
    {
      id: routes.activeThreatOverview,
      label: 'Overview',
      icon: LayoutGridIcon,
      to: buildUrl(generatePath(routes.activeThreatOverview, { activeThreatId }), queryParams),
    },
    {
      id: routes.activeThreatDetections,
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          Detections
          {data?.rule_check_results_count ? <Alert count={data?.rule_check_results_count} /> : null}
        </div>
      ),
      icon: FileTextIcon,
      to: buildUrl(generatePath(routes.activeThreatDetections, { activeThreatId }), queryParams),
    },
    {
      id: routes.activeThreatAttackFlow,
      label: 'Attack Flow',
      icon: SigmaLineIcon,
      to: buildUrl(generatePath(routes.activeThreatAttackFlow, { activeThreatId }), queryParams),
    },
  ];

  const activeTabId = tabs.find((tab) => matchPath(tab.id, pathname))?.id;

  return {
    tabs,
    activeTabId,
  };
};
