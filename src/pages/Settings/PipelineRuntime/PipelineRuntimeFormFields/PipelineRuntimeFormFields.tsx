import { HelperText, Input, Label } from '@/components/Form';
import { Tooltip } from '@/components/Tooltip';
import { InfoIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RuntimeTooltipLayout } from './RuntimeTooltipLayout';
import { usePipelineRuntimeFormFields } from './usePipelineRuntimeFormFields';

export interface PipelineRuntimeFormFieldsProps {
  isReadOnly?: boolean;
  errors: UseFormReturn<any>['formState']['errors'];
  register: UseFormReturn<any>['register'];
}

export const PipelineRuntimeFormFields: React.FC<PipelineRuntimeFormFieldsProps> = ({
  isReadOnly = false,
  errors,
  register,
}: PipelineRuntimeFormFieldsProps) => {
  const { loading, parameters } = usePipelineRuntimeFormFields();
  const defaultTooltipText =
    'To edit this parameter, you need an Admin role. You can always override this parameter for a specific pipeline in its settings.';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex basis-1/2 flex-col gap-2">
          <Label htmlFor="parallelism" className="text-silver text-xs">
            Parallelism
            <Tooltip
              className="max-w-[350px]"
              content={<RuntimeTooltipLayout {...parameters.parallelism!} />}
            >
              <InfoIcon className="text-gray-chateau size-4" />
            </Tooltip>
          </Label>
          <Input
            id="parallelism"
            placeholder="Enter parallelism"
            className="bg-primary"
            loading={loading}
            disabled={isReadOnly}
            aria-invalid={!!errors.parallelism}
            tooltip={isReadOnly ? defaultTooltipText : undefined}
            {...register('parallelism', {
              required: 'Please, enter the parallelism',
              valueAsNumber: true,
            })}
          />
          {errors.parallelism && (
            <HelperText className="text-critical text-2xs">
              {errors.parallelism.message as string}
            </HelperText>
          )}
        </div>
        <div className="flex basis-1/2 flex-col gap-2">
          <Label htmlFor="taskmanager_memory_mb" className="text-silver text-xs">
            TaskManager Memory, MB
            <Tooltip
              className="max-w-[350px]"
              content={<RuntimeTooltipLayout {...parameters.taskmanagerMemoryMb!} />}
            >
              <InfoIcon className="text-gray-chateau size-4" />
            </Tooltip>
          </Label>
          <Input
            id="taskmanager_memory_mb"
            placeholder="Enter TaskManager Memory"
            className="bg-primary"
            loading={loading}
            aria-invalid={!!errors.taskmanager_memory_mb}
            disabled={isReadOnly}
            tooltip={isReadOnly ? defaultTooltipText : undefined}
            {...register('taskmanager_memory_mb', {
              required: 'Please, enter the TaskManager Memory',
              valueAsNumber: true,
            })}
          />
          {errors.taskmanager_memory_mb && (
            <HelperText className="text-critical text-2xs">
              {errors.taskmanager_memory_mb.message as string}
            </HelperText>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex basis-1/2 flex-col gap-2">
          <Label htmlFor="taskmanager_cpu" className="text-silver text-xs">
            TaskManager CPU, cores
            <Tooltip
              className="max-w-[350px]"
              content={<RuntimeTooltipLayout {...parameters.taskmanagerCpu!} />}
            >
              <InfoIcon className="text-gray-chateau size-4" />
            </Tooltip>
          </Label>
          <Input
            id="taskmanager_cpu"
            placeholder="Enter TaskManager CPU"
            className="bg-primary"
            loading={loading}
            aria-invalid={!!errors.taskmanager_cpu}
            disabled={isReadOnly}
            tooltip={isReadOnly ? defaultTooltipText : undefined}
            {...register('taskmanager_cpu', {
              required: 'Please, enter the TaskManager CPU',
              valueAsNumber: true,
            })}
          />
          {errors.taskmanager_cpu && (
            <HelperText className="text-critical text-2xs">
              {errors.taskmanager_cpu.message as string}
            </HelperText>
          )}
        </div>
        <div className="flex basis-1/2 flex-col gap-2">
          <Label htmlFor="window_size_sec" className="text-silver text-xs">
            Window Size, sec
            <Tooltip
              className="max-w-[350px]"
              content={<RuntimeTooltipLayout {...parameters.windowSizeSec!} />}
            >
              <InfoIcon className="text-gray-chateau size-4" />
            </Tooltip>
          </Label>
          <Input
            id="window_size_sec"
            placeholder="Enter Window Size"
            className="bg-primary"
            loading={loading}
            aria-invalid={!!errors.window_size_sec}
            disabled={isReadOnly}
            tooltip={isReadOnly ? defaultTooltipText : undefined}
            {...register('window_size_sec', {
              required: 'Please, enter the Window Size',
              valueAsNumber: true,
            })}
          />
          {errors.window_size_sec && (
            <HelperText className="text-critical text-2xs">
              {errors.window_size_sec.message as string}
            </HelperText>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex basis-1/2 flex-col gap-2">
          <Label htmlFor="checkpoint_interval_sec" className="text-silver text-xs">
            Checkpoint Interval, sec
            <Tooltip
              className="max-w-[350px]"
              content={<RuntimeTooltipLayout {...parameters.checkpointIntervalSec!} />}
            >
              <InfoIcon className="text-gray-chateau size-4" />
            </Tooltip>
          </Label>
          <Input
            id="checkpoint_interval_sec"
            placeholder="Enter Checkpoint Interval"
            className="bg-primary"
            loading={loading}
            aria-invalid={!!errors.checkpoint_interval_sec}
            disabled={isReadOnly}
            tooltip={isReadOnly ? defaultTooltipText : undefined}
            {...register('checkpoint_interval_sec', {
              required: 'Please, enter the Checkpoint Interval',
              valueAsNumber: true,
            })}
          />
          {errors.checkpoint_interval_sec && (
            <HelperText className="text-critical text-2xs">
              {errors.checkpoint_interval_sec.message as string}
            </HelperText>
          )}
        </div>
        <div className="flex basis-1/2" />
      </div>
    </div>
  );
};
