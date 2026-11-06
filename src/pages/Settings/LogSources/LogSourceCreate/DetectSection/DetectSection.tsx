import { PlayIcon, SparklesIcon } from 'lucide-react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { TestResult } from '../TestResult/TestResult';
import type { LogSourceBoolState, LogSourceFormData } from '../useLogSourceCreate';
import { parseTestResult } from '../utils';
import { DetectFlowFieldsPreview } from './DetectFlowFieldsPreview';

import { RepositoryTreeMultiSelect } from '@/components/Form/RepositoryTreeMultiSelect';
import { RepositoriesData } from '@/models/providers';
import {
  Accordion,
  AccordionSection,
  Button,
  HelperText,
  Label,
  Tooltip,
} from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';

import PasteFieldsIcon from '@/assets/svg/past-fields.svg?react';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';

interface DetectSectionProps {
  control: Control<LogSourceFormData>;
  errors: FieldErrors<LogSourceFormData>;
  repositoriesList: RepositoriesData[];
  loading: boolean;
  loadingSigmaFields: boolean;
  boolState: LogSourceBoolState;
  onPasteFieldsFromRepositories: () => void;
  onOpenAIGenerateDialog: () => void;
  onRunDirectTest: () => void;
}

export const DetectSection: React.FC<DetectSectionProps> = ({
  control,
  errors,
  repositoriesList,
  loading,
  loadingSigmaFields,
  boolState,
  onPasteFieldsFromRepositories,
  onOpenAIGenerateDialog,
  onRunDirectTest,
}) => {
  const { isViewer } = usePermissions();

  return (
    <Accordion type="single" collapsible>
      <AccordionSection
        value="preview-parse-test"
        title="Detect"
        description="Configure additional field mappings required to align events with Sigma rules from the selected repositories."
      >
        <div className="flex min-h-0 flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-silver text-xs">Test Repositories</span>
            <Controller
              name="test_repository_ids"
              control={control}
              rules={{
                validate: (selections) =>
                  !selections?.length ? 'Repositories are required' : true,
              }}
              render={({ field }) => (
                <RepositoryTreeMultiSelect
                  id="repository-ids"
                  name="test_repository_ids"
                  className="bg-primary"
                  dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                  repositories={repositoriesList}
                  loading={loading}
                  disabled={loading}
                  maxDisplay={10}
                  placeholder="Select repositories..."
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.test_repository_ids && (
              <HelperText className="text-critical text-2xs">
                {errors.test_repository_ids.message}
              </HelperText>
            )}
            <HelperText className="text-gray-chateau text-2xs">
              Choose repositories with Sigma rules for test field mappings. Unique fields from these
              rules will be extracted and used for additional field mappings.
            </HelperText>
          </div>
          <div className="flex min-w-0 gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <Label className="text-silver text-xs">Mapping (YAML)</Label>
                  <p className="text-gray-chateau text-2xs">
                    Define field mappings for detection rules
                  </p>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Paste fields from Repositories">
                    <Button
                      variant="secondaryOutline"
                      className="shrink-0 p-2.5 text-xs"
                      type="button"
                      onClick={onPasteFieldsFromRepositories}
                      disabled={boolState.isRunningDirectTest || loadingSigmaFields}
                      loading={loadingSigmaFields}
                    >
                      <PasteFieldsIcon className="size-4" />
                    </Button>
                  </Tooltip>
                  <DisabledTooltip
                    disabled={isViewer}
                    content={
                      isViewer
                        ? 'This functionality is not available under your Viewer role'
                        : 'AI Generate'
                    }
                  >
                    <Button
                      variant="secondaryOutline"
                      className="shrink-0 p-2.5 text-xs"
                      type="button"
                      onClick={onOpenAIGenerateDialog}
                      disabled={isViewer || boolState.isRunningDirectTest || loadingSigmaFields}
                      loading={boolState.isRunningDirectTest}
                    >
                      <SparklesIcon className="size-4" />
                    </Button>
                  </DisabledTooltip>
                  <Button
                    variant="secondaryOutline"
                    className="shrink-0 text-xs"
                    type="button"
                    onClick={onRunDirectTest}
                    disabled={boolState.isRunningDirectTest || loadingSigmaFields}
                    loading={boolState.isRunningDirectTest}
                  >
                    <PlayIcon className="size-4" />
                    Run Test
                  </Button>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Controller
                  name="mapping"
                  control={control}
                  rules={{
                    required: 'Mapping is required',
                    validate: (value) => (!value.trim() ? 'Mapping is required' : true),
                  }}
                  render={({ field }) => (
                    <Editor
                      className="bg-primary h-[calc(100vh-450px)]"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.mapping && (
                  <HelperText className="text-critical text-2xs">
                    {errors.mapping.message}
                  </HelperText>
                )}
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-col">
                <Label className="text-silver text-xs">Preview Parsed Results</Label>
                <p className="text-gray-chateau text-2xs">
                  Preview the parsed output using sample events from the selected topics. Click any
                  raw event to inspect the parsed result.
                </p>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-0">
                  <Controller
                    name="preview_parse_result"
                    control={control}
                    render={({ field }) => <TestResult parsed={parseTestResult(field.value)} />}
                  />
                </div>
              </div>
            </div>
          </div>
          <DetectFlowFieldsPreview control={control} />
        </div>
      </AccordionSection>
    </Accordion>
  );
};
