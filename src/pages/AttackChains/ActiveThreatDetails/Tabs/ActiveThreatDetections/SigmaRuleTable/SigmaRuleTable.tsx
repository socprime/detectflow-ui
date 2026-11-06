import { useSigmaRuleTable } from './useSigmaRuleTable';

import type { ActiveThreatHighOrderSigma } from '@/models/providers/Types/responses/activeThreats';
import { EmptyState, TableWrap } from '@socprime/react-ui';

export interface SigmaRuleTableProps {
  activeThreatId?: string;
  data?: ActiveThreatHighOrderSigma[];
  loading?: boolean;
}

export const SigmaRuleTable = ({ activeThreatId, data = [], loading }: SigmaRuleTableProps) => {
  const { table, columns } = useSigmaRuleTable({ data, activeThreatId });

  return (
    <div className="border-border flex flex-col rounded-sm border">
      <h3 className="text-default border-border border-b px-3 py-3 text-sm font-semibold uppercase">
        Higher Order Sigma Rules
      </h3>
      <TableWrap
        className="rounded-none border-none"
        table={table}
        columns={columns}
        data={data}
        loading={loading}
        emptyContent={
          <EmptyState
            classNameContent="h-full pt-8 pb-0"
            title="Not Applicable"
            description="This threat item does not include a Higher Order Sigma Rule because the nature of the adversary activity does not allow for correlation"
          />
        }
      />
    </div>
  );
};
