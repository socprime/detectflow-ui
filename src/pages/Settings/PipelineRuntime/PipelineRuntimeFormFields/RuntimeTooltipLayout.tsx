import { FlinkDefaultsParameters } from "@/models/providers/Types/Response";

interface RuntimeTooltipLayoutProps extends FlinkDefaultsParameters {}

export const RuntimeTooltipLayout: React.FC<RuntimeTooltipLayoutProps> = ({...props}) => {
  const { description, tips } = props;

  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-default font-semibold text-xs">{description}</h6>
      <div className="flex flex-col gap-1">
        <div className="text-2xs text-gray-chateau">Tips:</div>
        <ul className="list-disc list-inside gap-1">
          {tips.map((tip, index) => (
            <li key={index} className="text-2xs text-subdued">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};