import { cn } from '@/utils/mergeClass';
import { Tooltip } from '@socprime/react-ui';

interface DisabledTooltipProps {
  className?: string;
  children: React.ReactNode;
  content?: string;
  disabled?: boolean;
}

export const DisabledTooltip: React.FC<DisabledTooltipProps> = ({
  className,
  children,
  content,
  disabled,
}) => {
  const localContent = content || 'This functionality is not available under your Viewer role';

  if (disabled) {
    return (
      <Tooltip content={localContent}>
        <span className={cn('inline-flex', className)}>{children}</span>
      </Tooltip>
    );
  }

  return content ? <Tooltip content={content}>{children}</Tooltip> : <>{children}</>;
};
