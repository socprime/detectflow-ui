import { ShieldCheckIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { DefaultDialog, Label, MultiSelect } from '@socprime/react-ui';

interface PipelineOption {
  label: string;
  value: string;
}

interface ConfirmCorrelationPipelineDialogProps {
  isOpen: boolean;
  mode?: 'enable' | 'disable';
  threatCount: number;
  options: PipelineOption[];
  loading?: boolean;
  pipelinesLoading?: boolean;
  onClose: () => void;
  onConfirm: (pipelineIds: string[]) => void;
}

export const ConfirmCorrelationPipelineDialog: React.FC<ConfirmCorrelationPipelineDialogProps> = ({
  isOpen,
  mode = 'enable',
  threatCount,
  options,
  loading = false,
  pipelinesLoading = false,
  onClose,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setSelected(options.map(({ value }) => value));
    }
    wasOpen.current = isOpen;
  }, [isOpen, options]);

  return (
    <DefaultDialog
      isOpen={isOpen}
      className="sm:max-w-[550px]"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="text-success size-6" />
          <span>
            {mode === 'enable' ? 'Enable' : 'Disable'} {threatCount} monitored threat
            {threatCount === 1 ? '' : 's'}
          </span>
        </div>
      }
      hideFooter={false}
      classNameHeader="m-0"
      classNameTitle="text-m"
      loading={loading}
      disabled={selected.length === 0}
      onClose={onClose}
      onConfirm={() => onConfirm(selected)}
    >
      <div className="flex flex-col gap-4 px-6 pt-6">
        <p className="text-default text-xs">
          The selected threats are correlated in the pipelines you choose and can form new attack
          chains.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="correlation-pipeline" title="Correlation Pipeline" />
          <MultiSelect
            id="correlation-pipeline"
            name="correlation-pipeline"
            placeholder="Select Correlation Pipeline"
            className="bg-primary"
            dropdownClassName="w-[var(--radix-popover-trigger-width)]"
            badgeClassNames="text-default/80"
            variant="secondary"
            loading={pipelinesLoading}
            disabled={pipelinesLoading}
            maxSelection={25}
            value={selected}
            onChange={setSelected}
            options={options}
          />
        </div>
      </div>
    </DefaultDialog>
  );
};
