import { PipelineResponse } from '@/models/providers/Types';

interface PipelineDescriptionProps {
  pipeline: PipelineResponse;
}

export const PipelineDescription = ({ pipeline }: PipelineDescriptionProps) => {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Source Topic:</span>
        <span className="text-default text-2xs">
          {pipeline?.source_topics.length ? pipeline?.source_topics.join(', ') : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Destination Topic:</span>
        <span className="text-default text-2xs">
          {pipeline?.destination_topic ? pipeline?.destination_topic : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Logsource:</span>
        <span className="text-default text-2xs">
          {pipeline?.log_source_name ? pipeline?.log_source_name : 'None'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Output Format:</span>
        <span className="text-default text-2xs">
          {pipeline?.apply_parser_to_output_events
            ? 'Apply Parser to Output Events'
            : 'Preserve Source Format'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-chateau text-2xs">Save Untagged Events:</span>
        <span className="text-default text-2xs">{pipeline?.save_untagged ? 'Yes' : 'No'}</span>
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
