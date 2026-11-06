import { useDetectionsTable } from './useDetectionsTable';

import type { ActiveThreatRule } from '@/models/providers/Types/responses/activeThreats';
import type { RuleCheckResults } from '@/models/providers/Types/responses/attackChains';
import { TableWrap } from '@socprime/react-ui';

export interface DetectionsTableProps {
  activeThreatId?: string;
  loading?: boolean;
  data?: ActiveThreatRule[];
  ruleCheckResults?: RuleCheckResults;
}

export const DetectionsTable: React.FC<DetectionsTableProps> = ({
  activeThreatId,
  data = [],
  loading,
  ruleCheckResults,
}) => {
  const { table, columns } = useDetectionsTable({ data, activeThreatId, ruleCheckResults });

  return (
    <div className="border-border flex-col rounded-sm border">
      <h3 className="text-default border-border border-b px-3 py-3 text-sm font-semibold uppercase">
        Detections
      </h3>
      <TableWrap
        className="rounded-none border-none"
        table={table}
        columns={columns}
        data={data}
        loading={loading}
      />
    </div>
  );
};
