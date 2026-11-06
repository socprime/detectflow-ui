import { useReturnTo } from '@/hooks';
import { AttackChainDetailResponse } from '@/models/providers/Types/responses/attackChains';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils/format';
import { withReturnTo } from '@/utils/queryParams';
import { Accordion, AccordionItem, AccordionTrigger } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';
import { Link } from 'react-router-dom';

interface ActiveThreatLinkProps {
  data?: AttackChainDetailResponse['active_threat'];
}

export const ActiveThreatLink = ({ data }: ActiveThreatLinkProps) => {
  const returnTo = useReturnTo();

  if (!data) {
    return null;
  }

  return (
    <Link to={withReturnTo(routeHelpers.activeThreatDetails(data?.tdm_id ?? ''), returnTo)}>
      <Accordion className="flex flex-col gap-3" type="single" value="attack-chain-general">
        <AccordionItem
          className="border-border bg-secondary hover:bg-hover/50 items-center rounded-sm border last:border-b-1"
          value="attack-chain-general"
        >
          <AccordionTrigger
            chevronPosition="right"
            className="group cursor-pointer items-center p-4 py-3 [&>svg]:-rotate-90!"
          >
            <div className="flex w-full items-center gap-6">
              <div className="flex flex-5 flex-col gap-2">
                <h5 className="text-gray-chateau text-2xs font-normal uppercase">
                  Monitored Threat
                </h5>
                <div className="group-hover:text-success text-xs font-normal">
                  {data?.severity && <Severity severity={data?.severity} />}
                  {data?.name}
                </div>
              </div>
              <div className="flex flex-3 flex-col gap-2">
                <h5 className="text-gray-chateau text-2xs font-normal uppercase">Type</h5>
                <p className="text-default text-2xs font-normal">
                  {data?.threat_types?.map((threat) => threat).join(', ') ?? '-'}
                </p>
              </div>
              <div className="flex flex-0 flex-col gap-2">
                <h5 className="text-gray-chateau text-2xs font-normal uppercase">Released</h5>
                <p className="text-default text-2xs font-normal whitespace-nowrap">
                  {data?.created ? formatDate(data?.created, 'datetime') : '-'}
                </p>
              </div>
            </div>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </Link>
  );
};
