import { useMemo } from 'react';
import type { ViewInSiemState } from '../../../hooks/useViewInSiem';
import { createTechniqueRuleColumns } from './columns';
import { TechniqueTable } from './TechniqueTable';

import type { Technique } from '@/models/providers/Types/responses/attackChains';
import { formatDate } from '@/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@socprime/react-ui';

interface TechniquesProps {
  techniques: Technique[];
  viewInSiem: ViewInSiemState;
  attackChainId: string;
  returnTo: string;
}

export const Techniques: React.FC<TechniquesProps> = ({
  techniques,
  viewInSiem,
  attackChainId,
  returnTo,
}) => {
  const columns = useMemo(
    () => createTechniqueRuleColumns({ attackChainId, returnTo, viewInSiem }),
    [attackChainId, returnTo, viewInSiem],
  );

  return (
    <>
      <Accordion
        className="flex flex-col gap-3"
        type="multiple"
        defaultValue={[`technique-${techniques[0]?.code}`]}
      >
        {techniques?.map((technique) => (
          <AccordionItem
            className="border-border bg-secondary hover:bg-hover/50 items-center rounded-sm border last:border-b-1"
            value={`technique-${technique.code}`}
            key={`technique-${technique.code}`}
          >
            <AccordionTrigger chevronPosition="right" className="items-center p-4">
              <div className="flex w-full items-center gap-6">
                <div className="flex flex-5 flex-col gap-2">
                  <h5 className="text-gray-chateau text-2xs font-normal uppercase">
                    {technique.code}
                  </h5>
                  <p className="text-default text-xs font-normal">{technique.name}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h5 className="text-gray-chateau text-2xs font-normal uppercase">
                    Matched Rules
                  </h5>
                  <p className="text-default text-2xs font-normal">{technique.rules.length}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h5 className="text-gray-chateau text-2xs font-normal uppercase">First Seen</h5>
                  <p className="text-default text-2xs font-normal whitespace-nowrap">
                    {formatDate(technique.first_seen, 'full')}
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h5 className="text-gray-chateau text-2xs font-normal uppercase">Last Seen</h5>
                  <p className="text-default text-2xs font-normal whitespace-nowrap">
                    {formatDate(technique.last_seen, 'full')}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-border border-t">
              <TechniqueTable rules={technique.rules} columns={columns} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
