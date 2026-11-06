import { PlusIcon } from 'lucide-react';
import {
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormTrigger,
} from 'react-hook-form';
import type { DestinationSeverityOption, MatchingUpdateFormData } from '../useMatchingUpdate';
import { DestinationRow } from './DestinationRow';
import { MAX_DESTINATIONS, useDestinationsSection } from './useDestinationsSection';

import type { SegmentedControlOption } from '@/components/Form/SegmentedControl';
import { Button, HelperText, type SuggestionOption } from '@socprime/react-ui';

interface DestinationsSectionProps {
  control: Control<MatchingUpdateFormData>;
  errors: FieldErrors<MatchingUpdateFormData>;
  loading: boolean;
  topicOptions: SuggestionOption[];
  outputFormatOptions: SegmentedControlOption[];
  saveEventsOptions: SegmentedControlOption[];
  severityOptions: DestinationSeverityOption[];
  getValues: UseFormGetValues<MatchingUpdateFormData>;
  trigger: UseFormTrigger<MatchingUpdateFormData>;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  control,
  errors,
  loading,
  topicOptions,
  outputFormatOptions,
  saveEventsOptions,
  severityOptions,
  getValues,
  trigger,
}) => {
  const { fields, canAdd, canRemove, handleAdd, handleRemove, handleDuplicate } =
    useDestinationsSection({
      control,
      getValues,
      trigger,
    });

  return (
    <section className="border-border flex flex-col gap-4 border-t pt-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-default text-l font-medium">
          Destinations{' '}
          <span className="text-gray-chateau text-xs font-normal">
            ({fields.length}/{MAX_DESTINATIONS})
          </span>
        </h2>
        <Button
          type="button"
          variant="secondaryOutline"
          size="s"
          className="text-xs"
          disabled={loading || !canAdd}
          onClick={handleAdd}
        >
          <PlusIcon className="size-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <DestinationRow
            key={field.id}
            index={index}
            control={control}
            errors={errors}
            loading={loading}
            canRemove={canRemove}
            topicOptions={topicOptions}
            outputFormatOptions={outputFormatOptions}
            saveEventsOptions={saveEventsOptions}
            severityOptions={severityOptions}
            trigger={trigger}
            onRemove={handleRemove}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>
      <HelperText className="text-gray-chateau text-2xs">
        Choose how to format events in each destination topic and whether to retain events that do
        not match any of the defined rules.
      </HelperText>
    </section>
  );
};
