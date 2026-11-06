import type { FlinkDefaultsParameters } from '@/models/providers/Types/responses/pipelines';

interface RuntimeTooltipLayoutProps extends FlinkDefaultsParameters {}

export const RuntimeTooltipLayout: React.FC<RuntimeTooltipLayoutProps> = ({ ...props }) => {
  const { description, tips } = props;

  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-default text-xs font-semibold">{description}</h6>
      <div className="flex flex-col gap-1">
        <div className="text-2xs text-gray-chateau">Tips:</div>
        <ul className="list-inside list-disc gap-1">
          {tips.map((tip, index) => (
            <li key={index} className="text-2xs text-subdued">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
