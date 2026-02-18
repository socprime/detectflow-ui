import { TooltipContent, TooltipParent, TooltipTrigger } from './TooltipLayout';

interface TooltipProps extends React.ComponentProps<typeof TooltipParent> {
  className?: string;
  children: React.ReactNode;
  content: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className, ...props }) => {
  return (
    <TooltipParent {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={className}>{content}</TooltipContent>
    </TooltipParent>
  );
};
