import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import type { PipelineInfo } from '@/models/providers/Types/Response';
import { AlertCircleIcon } from 'lucide-react';

interface CannotDeleteRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryName: string;
  pipelines: PipelineInfo[];
}

export const CannotDeleteRepositoryDialog: React.FC<CannotDeleteRepositoryDialogProps> = ({
  isOpen,
  onClose,
  repositoryName,
  pipelines,
}) => {
  const pipelineWord = pipelines.length === 1 ? 'pipeline' : 'pipelines';
  const thisWord = pipelines.length === 1 ? 'this pipeline' : 'these pipelines';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-secondary sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-default text-l flex items-center gap-2">
            <AlertCircleIcon className="text-warning size-4" />
            Cannot Delete Repository
          </DialogTitle>
          <DialogDescription className="sr-only">
            Repository cannot be deleted because it is in use
          </DialogDescription>
        </DialogHeader>
        <div className="text-subdued space-y-2 px-6 text-xs break-all">
          <p>
            Repository <span className="text-success">"{repositoryName}"</span> cannot be deleted
            because it is currently used in the following {pipelineWord}:
          </p>
          <ul className="text-gray-chateau marker:text-success list-inside list-disc py-2 pl-4 marker:text-base">
            {pipelines.map((pipeline) => (
              <li key={pipeline.id}>{pipeline.name}</li>
            ))}
          </ul>
          <p>Please remove this repository from {thisWord} before deleting it.</p>
        </div>
        <DialogFooter>
          <Button className="text-xs" type="button" onClick={onClose} variant="primary">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
