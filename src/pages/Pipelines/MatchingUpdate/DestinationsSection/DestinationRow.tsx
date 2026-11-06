import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HelperText,
  Label,
  Separator,
  type SuggestionOption,
  Suggestions,
} from '@socprime/react-ui';
import { ChevronDownIcon, CopyIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormTrigger,
  useWatch,
} from 'react-hook-form';
import type { DestinationSeverityOption, MatchingUpdateFormData } from '../useMatchingUpdate';
import { validateDastination } from './validate';

import { SegmentedControl, type SegmentedControlOption } from '@/components/Form/SegmentedControl';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';

interface DestinationRowProps {
  index: number;
  control: Control<MatchingUpdateFormData>;
  errors: FieldErrors<MatchingUpdateFormData>;
  loading: boolean;
  canRemove: boolean;
  topicOptions: SuggestionOption[];
  outputFormatOptions: SegmentedControlOption[];
  saveEventsOptions: SegmentedControlOption[];
  severityOptions: DestinationSeverityOption[];
  trigger: UseFormTrigger<MatchingUpdateFormData>;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
}

export const DestinationRow: React.FC<DestinationRowProps> = ({
  index,
  control,
  errors,
  loading,
  canRemove,
  topicOptions,
  outputFormatOptions,
  saveEventsOptions,
  severityOptions,
  trigger,
  onRemove,
  onDuplicate,
}) => {
  const rowErrors = errors.destinations?.[index];
  const labelId = (name: string) => `dest-label-${name}-${index}`;
  const outputMode = useWatch({
    control,
    name: `destinations.${index}.output_mode`,
  });
  const isSeverityEnabled = outputMode === 'matched_only';
  const severityDisabled = loading || !isSeverityEnabled;

  return (
    <div className="flex flex-wrap items-start gap-4 max-lg:flex-col not-first:[&_[data-slot=topic-label]]:lg:hidden">
      <div className="flex min-w-[280px] flex-1 flex-col gap-2 max-lg:w-full">
        <Label className="text-silver text-xs" id={labelId('topic')} data-slot="topic-label">
          Destination Topic *
        </Label>
        <Controller
          name={`destinations.${index}.topic`}
          control={control}
          rules={{
            validate: validateDastination.topic,
          }}
          render={({ field }) => (
            <Suggestions
              className="bg-primary"
              dropdownClassName="w-[var(--radix-popover-trigger-width)]"
              placeholder="Search and select destination topic..."
              id={`destination-topic-${index}`}
              options={topicOptions}
              value={field.value || ''}
              onChange={(val) => {
                field.onChange(val);
                void trigger('destinations');
              }}
              disabled={loading}
              loading={loading}
            />
          )}
        />
        {rowErrors?.topic && (
          <HelperText className="text-critical text-2xs">{rowErrors.topic.message}</HelperText>
        )}
      </div>
      <div className="flex gap-4 max-lg:w-full max-lg:flex-wrap max-lg:justify-between">
        <div className="flex w-fit shrink-0 flex-col gap-2">
          <Label className="text-silver text-xs" id={labelId('format')} data-slot="topic-label">
            Output Format
          </Label>
          <div className="flex items-center gap-4">
            <Controller
              name={`destinations.${index}.apply_parser_to_output_events`}
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  id={`output-format-${index}`}
                  options={outputFormatOptions}
                  value={String(field.value ?? false)}
                  onChange={(val) => field.onChange(val === 'true')}
                  disabled={loading}
                  ariaLabelledBy={labelId('format')}
                  ariaLabel="Output Format"
                />
              )}
            />
            <div className="h-6">
              <Separator className="h-full w-px max-lg:hidden" orientation="vertical" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs" id={labelId('save')} data-slot="topic-label">
            Save Events
          </Label>
          <div className="flex items-center gap-4">
            <Controller
              name={`destinations.${index}.output_mode`}
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  id={`save-events-${index}`}
                  options={saveEventsOptions}
                  value={field.value ?? 'all_events'}
                  onChange={(val) => field.onChange(val)}
                  disabled={loading}
                  ariaLabelledBy={labelId('save')}
                  ariaLabel="Save Events"
                />
              )}
            />
            <div className="h-6">
              <Separator className="h-full w-px max-lg:hidden" orientation="vertical" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs" id={labelId('severity')} data-slot="topic-label">
            Severity
          </Label>
          <div className="flex items-center gap-4">
            <Controller
              name={`destinations.${index}.severities`}
              control={control}
              render={({ field }) => {
                const selected = field.value ?? [];
                const isAll = selected.length === 0;
                const triggerLabel = isAll
                  ? 'All'
                  : severityOptions
                      .filter((option) => selected.includes(option.value))
                      .map((option) => option.label)
                      .join(', ');

                const handleToggle = (optionValue: (typeof severityOptions)[number]['value']) => {
                  const next = selected.includes(optionValue)
                    ? selected.filter((value) => value !== optionValue)
                    : [...selected, optionValue];

                  field.onChange(next.length === severityOptions.length ? [] : next);
                };

                return (
                  <DisabledTooltip
                    className="cursor-not-allowed"
                    disabled={!isSeverityEnabled}
                    content={
                      !isSeverityEnabled
                        ? 'Select Tagged for Saved Events to enable this filter'
                        : undefined
                    }
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={severityDisabled}>
                        <button
                          type="button"
                          id={`destination-severity-${index}`}
                          aria-labelledby={labelId('severity')}
                          disabled={severityDisabled}
                          className={`border-border bg-primary text-default focus-visible:border-success focus-visible:ring-success/40 data-[state=open]:border-success data-[state=open]:ring-success/40 flex h-9 min-w-[150px] items-center justify-between gap-2 rounded-md border px-3 text-xs font-normal whitespace-nowrap outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-[2px]${!isSeverityEnabled ? ' pointer-events-none' : ''}`}
                        >
                          <span>{triggerLabel}</span>
                          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="border-border bg-secondary min-w-[var(--radix-dropdown-menu-trigger-width)]"
                        align="start"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuCheckboxItem
                            className="font-regular text-xs"
                            checked={isAll}
                            onCheckedChange={() => field.onChange([])}
                            onSelect={(event) => event.preventDefault()}
                          >
                            All
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {severityOptions.map((option) => (
                            <DropdownMenuCheckboxItem
                              key={option.value}
                              className="font-regular text-xs"
                              checked={selected.includes(option.value)}
                              onCheckedChange={() => handleToggle(option.value)}
                              onSelect={(event) => event.preventDefault()}
                            >
                              {option.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DisabledTooltip>
                );
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={loading}>
                <Button type="button" variant="icon" size="s" aria-label="Destination actions">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-border bg-secondary w-40" align="end">
                <DropdownMenuItem className="text-xs" onSelect={() => onDuplicate(index)}>
                  <CopyIcon className="size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-critical hover:text-critical text-xs"
                  disabled={!canRemove}
                  onSelect={() => onRemove(index)}
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
