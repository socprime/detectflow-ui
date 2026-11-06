import { AlertTriangleIcon, ShieldCheckIcon } from 'lucide-react';

import { DefaultDialog } from '@socprime/react-ui';

export type CorrelationPipelineDialogVariant = 'block' | 'unblock' | 'suppress';

interface CorrelationPipelineDialogProps {
  isOpen: boolean;
  variant: CorrelationPipelineDialogVariant;
  threatName: string;
  pipelineName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VARIANT_CONTENT: Record<
  CorrelationPipelineDialogVariant,
  { title: string; confirmText: string }
> = {
  block: {
    title: 'Block threat in all pipelines?',
    confirmText: 'Block',
  },
  unblock: {
    title: 'Unblock threat for all pipelines?',
    confirmText: 'Unblock',
  },
  suppress: {
    title: 'Suppress threat from Correlation?',
    confirmText: 'Suppress',
  },
};

export const CorrelationPipelineDialog: React.FC<CorrelationPipelineDialogProps> = ({
  isOpen,
  variant,
  threatName,
  pipelineName,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const { title, confirmText } = VARIANT_CONTENT[variant];

  const description =
    variant === 'suppress'
      ? `${threatName} stops being correlated in ${pipelineName ?? 'this pipeline'}, so no new attack chains are formed for it here. Existing chains stay.`
      : variant === 'block'
        ? `${threatName} is removed from monitoring in all chaining pipelines and will not be monitored in pipelines created in the future.`
        : `${threatName} will be enabled in all existing chaining pipelines and in pipelines created in the future.`;

  return (
    <DefaultDialog
      isOpen={isOpen}
      className="sm:max-w-[550px]"
      title={
        <div className="flex items-center gap-2">
          {variant === 'unblock' ? (
            <ShieldCheckIcon className="text-success size-6" />
          ) : (
            <AlertTriangleIcon className="text-warning size-6" />
          )}
          <span>{title}</span>
        </div>
      }
      hideFooter={false}
      classNameHeader="m-0"
      classNameTitle="text-m"
      loading={loading}
      confirmText={confirmText}
      confirmVariant={variant === 'unblock' ? 'primary' : 'criticalOutline'}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div className="flex flex-col gap-4 px-6 pt-6">
        <p className="text-default text-xs">{description}</p>
      </div>
    </DefaultDialog>
  );
};
