import { Badge, BadgeProps } from '@/components/Badge/Badge';

import type { Topic, TopicPipeline } from '@/models/providers/Types/Response';
import type { ColumnDef } from '@tanstack/react-table';

type PipelineConfig = {
  variant: BadgeProps['variant'];
  className: BadgeProps['className'];
  label: string;
};

const PIPELINE_CONFIG: Record<TopicPipeline['type'], PipelineConfig> = {
  source: { variant: 'lightBlue', className: 'text-light-blue', label: 'Source' },
  destination: { variant: 'purple', className: 'text-purple', label: 'Destination' },
  unused: { variant: 'secondary', className: 'text-gray-chateau', label: 'Unused' },
};

const PipelineBadge = ({ pipeline }: { pipeline: TopicPipeline }) => {
  const config = PIPELINE_CONFIG[pipeline.type];

  if (!config) {
    return null;
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {pipeline.name}
      {config.label && <span className="text-3xs"> ({config.label})</span>}
    </Badge>
  );
};

export const columns: ColumnDef<Topic>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { width: '280px' },
    cell: ({ row }) => <span className="text-default text-xs">{row.getValue('name')}</span>,
  },
  {
    header: 'Pipeline',
    accessorKey: 'pipelines',
    cell: ({ row }) => {
      const pipelines = row.original.pipelines;

      if (!pipelines?.length) {
        return <span className="text-gray-chateau text-xs">-</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {pipelines.map((pipeline) => (
            <PipelineBadge key={pipeline.id} pipeline={pipeline} />
          ))}
        </div>
      );
    },
  },
];
