import {
  type Control,
  useFieldArray,
  type UseFormGetValues,
  type UseFormTrigger,
} from 'react-hook-form';
import { EMPTY_DESTINATION, type MatchingUpdateFormData } from '../useMatchingUpdate';

export const MAX_DESTINATIONS = 10;

interface UseDestinationsSectionProps {
  control: Control<MatchingUpdateFormData>;
  getValues: UseFormGetValues<MatchingUpdateFormData>;
  trigger: UseFormTrigger<MatchingUpdateFormData>;
}

export const useDestinationsSection = ({
  control,
  getValues,
  trigger,
}: UseDestinationsSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'destinations',
  });

  const canRemove = fields.length > 1;
  const canAdd = fields.length < MAX_DESTINATIONS;

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }
    append({ ...EMPTY_DESTINATION, severities: [] });
  };

  const handleRemove = (index: number) => {
    if (!canRemove) {
      return;
    }
    remove(index);
    void trigger('destinations');
  };

  const handleDuplicate = (index: number) => {
    if (!canAdd) {
      return;
    }
    const source = getValues(`destinations.${index}`);
    if (!source) {
      return;
    }
    append({
      ...source,
      severities: source.severities ? [...source.severities] : [],
    });
    void trigger('destinations');
  };

  return {
    fields,
    canAdd,
    canRemove,
    handleAdd,
    handleRemove,
    handleDuplicate,
    getValues,
    trigger,
  };
};
