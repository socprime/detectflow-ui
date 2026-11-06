import { Tooltip } from '@socprime/react-ui';

type TooltipProps = React.ComponentProps<typeof Tooltip>;

interface ConditionalTooltipProps extends Omit<TooltipProps, 'content'> {
  content?: React.ReactNode;
}

const isEmptyContent = (content: React.ReactNode): boolean => {
  if (content === null || content === undefined || content === false) {
    return true;
  }

  if (typeof content === 'string') {
    return content.trim().length === 0;
  }

  if (Array.isArray(content)) {
    return content.length === 0 || content.every(isEmptyContent);
  }

  return false;
};

export const ConditionalTooltip: React.FC<ConditionalTooltipProps> = ({
  content,
  children,
  ...tooltipProps
}) => {
  if (isEmptyContent(content)) {
    return <>{children}</>;
  }

  return (
    <Tooltip content={content} {...tooltipProps}>
      {children}
    </Tooltip>
  );
};
