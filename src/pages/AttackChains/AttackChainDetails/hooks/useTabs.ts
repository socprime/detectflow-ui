import { LayoutGridIcon } from 'lucide-react';
import { generatePath, matchPath, useLocation, useParams, useSearchParams } from 'react-router-dom';

import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';
import { routes } from '@/models/router/routes';
import { useAttackChainsStore } from '@/store';
import { buildUrl, getQueryParamsAsObject } from '@/utils';
import { AsideTab } from '@socprime/react-ui';

export const useTabs = () => {
  const [searchParams] = useSearchParams();
  const queryParams = getQueryParamsAsObject(searchParams);
  const { attackChainId = '' } = useParams<{ attackChainId: string }>();
  const detail = useAttackChainsStore((state) => state.detail);
  const { pathname } = useLocation();

  const generalTab: AsideTab[] = [
    {
      id: routes.attackChainGeneral,
      label: 'General',
      icon: LayoutGridIcon,
      to: buildUrl(generatePath(routes.attackChainGeneral, { attackChainId }), queryParams),
    },
  ];

  const tabs: AsideTab[] = [
    ...generalTab,
    {
      id: routes.attackChainSigmaRule,
      label: 'Higher Order Sigma Rule',
      icon: SigmaLineIcon,
      to: buildUrl(generatePath(routes.attackChainSigmaRule, { attackChainId }), queryParams),
    },
  ];

  const activeTabId = tabs.find((tab) => matchPath(tab.id, pathname))?.id;

  return {
    activeTabId,
    tabs: detail?.chain_type === 'HOS' ? tabs : generalTab,
  };
};
