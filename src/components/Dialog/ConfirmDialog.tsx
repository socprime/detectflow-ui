import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: React.ReactNode;
  loading?: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-secondary sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-default">{title}</DialogTitle>
          <DialogDescription className="sr-only">{message}</DialogDescription>
        </DialogHeader>
        <div className="text-subdued px-6 text-xs">{message}</div>
        <DialogFooter className="gap-2">
          <Button
            className="text-xs"
            type="button"
            onClick={onClose}
            variant="secondaryOutline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="text-xs"
            type="button"
            onClick={onConfirm}
            variant="criticalOutline"
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
