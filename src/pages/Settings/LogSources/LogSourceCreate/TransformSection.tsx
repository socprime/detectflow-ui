import type { TopicEvent } from '@/models/providers';
import {
  Accordion,
  AccordionSection,
  Button,
  HelperText,
  Label,
  Tooltip,
} from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';
import { PlayIcon } from 'lucide-react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { TestResult } from './TestResult/TestResult';
import type { LogSourceBoolState, LogSourceFormData } from './useLogSourceCreate';
import { mapTopicEventsToResults, parseTestResult } from './utils';

import GetEventsIcon from '@/assets/svg/get-events.svg?react';

interface TransformSectionProps {
  control: Control<LogSourceFormData>;
  errors: FieldErrors<LogSourceFormData>;
  boolState: LogSourceBoolState;
  topicEvents: TopicEvent[];
  onViewEventSamples: () => void;
  onRunTransformTest: () => void;
}

export const TransformSection: React.FC<TransformSectionProps> = ({
  control,
  errors,
  boolState,
  topicEvents,
  onViewEventSamples,
  onRunTransformTest,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="transform-test">
      <AccordionSection
        value="transform-test"
        title="Transform"
        description="Define a parsing script using the available functions and regular expressions to extract the required fields from log events."
      >
        <div className="flex min-w-0 gap-4 p-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <Label className="text-silver text-xs">Parsing Script</Label>
                <p className="text-gray-chateau text-2xs">Define a parsing script</p>
              </div>
              <div className="flex gap-2">
                <Tooltip content="Get Events">
                  <Button
                    variant="secondaryOutline"
                    className="shrink-0 p-2.5 text-xs"
                    type="button"
                    onClick={onViewEventSamples}
                    disabled={boolState.isRunningTransformTest || boolState.isTopicEventsLoading}
                    loading={boolState.isTopicEventsLoading}
                  >
                    <GetEventsIcon className="-mb-1 size-4" />
                  </Button>
                </Tooltip>
                <Button
                  variant="secondaryOutline"
                  className="shrink-0 text-xs"
                  type="button"
                  onClick={onRunTransformTest}
                  disabled={boolState.isRunningTransformTest || boolState.isTopicEventsLoading}
                  loading={boolState.isRunningTransformTest}
                >
                  <PlayIcon className="size-4" />
                  Run Test
                </Button>
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
              <Controller
                name="parsing_script"
                control={control}
                rules={{
                  required: 'Parsing script is required',
                  validate: (value) => (!value.trim() ? 'Parsing script is required' : true),
                }}
                render={({ field }) => (
                  <Editor
                    className="bg-primary h-[calc(100vh-450px)]"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.parsing_script && (
                <HelperText className="text-critical text-2xs">
                  {errors.parsing_script.message}
                </HelperText>
              )}
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col">
              {boolState.isTopicEventsShow ? (
                <>
                  <span className="text-silver text-xs">Event Sample</span>
                  <p className="text-gray-chateau text-2xs">Raw events from the selected topics</p>
                </>
              ) : (
                <>
                  <span className="text-silver text-xs">Test Events</span>
                  <p className="text-gray-chateau text-2xs">
                    Preview the parsed output using sample events from the selected topics. Click
                    any raw event to inspect the parsed result.
                  </p>
                </>
              )}
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-0">
                <Controller
                  name="transform_test_result"
                  control={control}
                  render={({ field }) => (
                    <TestResult
                      parsed={
                        boolState.isTopicEventsShow
                          ? mapTopicEventsToResults(topicEvents)
                          : parseTestResult(field.value)
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>
    </Accordion>
  );
};
