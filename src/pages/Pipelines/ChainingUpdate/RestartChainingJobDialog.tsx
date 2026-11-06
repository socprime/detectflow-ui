import { DefaultDialog } from '@socprime/react-ui';
import { AlertTriangleIcon } from 'lucide-react';

interface RestartChainingJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RestartChainingJobDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: RestartChainingJobDialogProps) => {
  return (
    <DefaultDialog
      className="sm:max-w-[550px]"
      isOpen={isOpen}
      title={
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="text-warning size-6" />
          <span>Restart correlation job?</span>
        </div>
      }
      hideFooter={false}
      classNameHeader="m-0"
      classNameTitle="text-m"
      confirmText="Apply & Restart"
      confirmVariant="primary"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div className="flex flex-col gap-4 px-6 pt-6">
        <p className="text-default text-xs">
          Changing resources or the topic list restarts the correlation job (about 30 seconds of
          downtime).
        </p>
        <p className="text-default text-xs">
          Note: removing a topic cold-starts the job — buffered, not yet closed attack chains will
          be lost.
        </p>
      </div>
    </DefaultDialog>
  );
};
