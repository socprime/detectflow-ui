import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { cn } from '@/utils';
import { XIcon } from 'lucide-react';

interface DefaultDialogProps {
  isOpen: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
  scrollable?: boolean;
  scrollAreaClassName?: string;
  titleDescription?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const DefaultDialog: React.FC<DefaultDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  title,
  children,
  loading = false,
  className,
  hideFooter = true,
  scrollable = false,
  scrollAreaClassName = '',
  titleDescription,
}) => {
  const content = scrollable ? (
    <ScrollArea className={cn('max-h-[calc(100vh-8rem)]', scrollAreaClassName)}>
      <div className="pr-4">{children}</div>
    </ScrollArea>
  ) : (
    children
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'border-border bg-secondary sm:max-w-[500px]',
          scrollable && 'flex flex-col',
          className,
        )}
        hideCloseButton
      >
        <DialogHeader className={scrollable ? 'shrink-0' : ''}>
          <DialogTitle className="text-default">{title}</DialogTitle>
          <DialogDescription className="sr-only">{titleDescription}</DialogDescription>
        </DialogHeader>
        <Button className="absolute top-6 right-4" variant="icon" size="xxs" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
        <div className={cn(scrollable && 'min-h-0 flex-1')}>{content}</div>
        {!hideFooter && (
          <DialogFooter className={cn('gap-2', scrollable && 'shrink-0')}>
            {onClose && (
              <Button
                className="text-xs"
                type="button"
                onClick={onClose}
                variant="secondaryOutline"
                disabled={loading}
              >
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button
                className="text-xs"
                type="button"
                onClick={onConfirm}
                variant="primary"
                loading={loading}
              >
                {confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
