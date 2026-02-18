import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/utils';

interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {}
interface DialogTriggerProps extends React.ComponentProps<typeof DialogPrimitive.Trigger> {}
interface DialogPortalProps extends React.ComponentProps<typeof DialogPrimitive.Portal> {}
interface DialogCloseProps extends React.ComponentProps<typeof DialogPrimitive.Close> {}
interface DialogOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {}
interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  hideCloseButton?: boolean;
}
interface DialogHeaderProps extends React.ComponentProps<'div'> {}
interface DialogFooterProps extends React.ComponentProps<'div'> {}
interface DialogTitleProps extends React.ComponentProps<typeof DialogPrimitive.Title> {}
interface DialogDescriptionProps extends React.ComponentProps<typeof DialogPrimitive.Description> {}

export const Dialog: React.FC<DialogProps> = ({ ...props }) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ ...props }) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

export const DialogPortal: React.FC<DialogPortalProps> = ({ ...props }) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

export const DialogClose: React.FC<DialogCloseProps> = ({ ...props }) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

export const DialogOverlay: React.FC<DialogOverlayProps> = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Overlay data-slot="dialog-overlay" asChild {...props}>
      <motion.div
        className={cn('fixed inset-0 z-50 bg-black/50', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </DialogPrimitive.Overlay>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  className,
  children,
  hideCloseButton = false,
  ...props
}) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="dialog-content" asChild {...props}>
        <motion.div
          className={cn(
            'bg-background fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg sm:max-w-lg',
            className,
          )}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
          {!hideCloseButton && (
            <DialogPrimitive.Close className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground btn btn--icon dark:text-subdued light:text-dark hover:bg-hover dark:hover:text-success absolute top-6 right-4 h-6 w-6 rounded-xs border-transparent px-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'border-border mb-6 flex flex-col gap-2 border-b p-6 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  );
};

export const DialogFooter: React.FC<DialogFooterProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'border-border mt-6 flex flex-col-reverse gap-2 border-t p-6 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, ...props }) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};
