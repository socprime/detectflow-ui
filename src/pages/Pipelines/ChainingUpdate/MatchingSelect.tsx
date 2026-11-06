import { OverflowList } from '@/components/OverflowList';
import { Badge, BaseMultiSelect, Checkbox } from '@socprime/react-ui';

interface MatchingSelectProps {
  loading: boolean;
  field: { value: string[]; onChange: (value: string[]) => void };
  pipelineOptions: PipelineOption[];
}

interface PipelineOption {
  label: string;
  value: string;
  correlations?: { id: string; name: string }[];
}

export const MatchingSelect = ({ loading, field, pipelineOptions }: MatchingSelectProps) => {
  return (
    <BaseMultiSelect
      id="pipeline_ids"
      name="pipeline_ids"
      placeholder="Search matching pipelines"
      className="bg-primary"
      dropdownClassName="w-[var(--radix-popover-trigger-width)]"
      loading={loading}
      disabled={loading}
      value={field.value || []}
      options={pipelineOptions}
      renderOption={(pipeline, { selected }) => (
        <div className="flex min-w-0 flex-auto gap-2">
          <Checkbox checked={selected} tabIndex={-1} className="pointer-events-none" />
          <div className="flex min-w-0 flex-auto flex-col">
            <span className="min-w-0 truncate">{pipeline.label}</span>
            {pipeline.correlations && pipeline.correlations.length > 0 && (
              <div className="text-2xs text-dark-gray flex min-w-0 items-baseline gap-1">
                <span className="shrink-0">In:</span>
                <OverflowList
                  items={pipeline.correlations}
                  getKey={(correlation) => correlation.id}
                  renderItem={(correlation) => correlation.name}
                  separator=", "
                  className="gap-1"
                  overflowClassName="text-default"
                />
              </div>
            )}
          </div>
        </div>
      )}
      getOptionValue={(option) => option.value}
      renderValue={(selectedOptions, { remove }) =>
        selectedOptions.map((option) => (
          <Badge key={option.value} variant="secondary" onRemove={() => remove(option.value)}>
            {option.label}
          </Badge>
        ))
      }
      onChange={field.onChange}
    />
  );
};
