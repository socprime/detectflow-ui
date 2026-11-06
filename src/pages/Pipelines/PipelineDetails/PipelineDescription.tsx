import { PipelineResponse } from '@/models/providers/Types';
import type { PipelineDestination } from '@/models/providers/Types/responses/pipelines';

interface PipelineDescriptionProps {
  pipeline: PipelineResponse;
}

export const PipelineDescription = ({ pipeline }: PipelineDescriptionProps) => {
  const OUTPUT_MODE_LABELS: Record<PipelineDestination['output_mode'], string> = {
    all_events: 'All',
    matched_only: 'Tagged',
    unmatched_only: 'Untagged',
  };

  const destinations: PipelineDestination[] = pipeline?.destinations ?? [];

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Source Topic:</span>
        <span className="text-default text-2xs">
          {pipeline?.source_topics.length ? pipeline?.source_topics.join(', ') : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Destinations:</span>
        <span className="text-default text-2xs">
          {destinations.length
            ? destinations
                .map(
                  (d) =>
                    `${d.topic || 'None'} (${OUTPUT_MODE_LABELS[d.output_mode]}, ${
                      d.apply_parser_to_output_events ? 'Parsed' : 'Source Format'
                    })`,
                )
                .join(', ')
            : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Logsource:</span>
        <span className="text-default text-2xs">
          {pipeline?.log_source_name ? pipeline?.log_source_name : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Filters:</span>
        <span className="text-default text-2xs">
          {pipeline?.filters.length ? pipeline?.filters.join(', ') : 'None'}
        </span>
      </div>
    </div>
  );
};
