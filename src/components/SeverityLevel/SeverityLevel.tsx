import { levelToSeverity, TLevel } from '@/utils';
import { Badge, Tooltip } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

interface SeverityLevelProps {
  severity: TLevel;
  arrowClassName?: string;
}

export const SeverityLevel: React.FC<SeverityLevelProps> = ({
  severity,
  arrowClassName = 'size-5',
}) => {
  if (!severity?.trim()) {
    return null;
  }
  const normalizedSeverity = levelToSeverity(severity);

  return (
    <Tooltip className="capitalize" content={normalizedSeverity}>
      <span className="inline-flex">
        {severity ? (
          <Severity arrowClassName={arrowClassName} severity={normalizedSeverity} />
        ) : (
          <Badge className="text-2xs text-gray-chateau rounded-xs capitalize" variant="secondary">
            Unknown
          </Badge>
        )}
      </span>
    </Tooltip>
  );
};
