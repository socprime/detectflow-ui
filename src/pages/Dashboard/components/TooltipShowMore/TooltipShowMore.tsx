import { Tooltip } from '@/components/Tooltip';

interface ContentData {
  id: string;
  name: string;
}

interface TooltipShowMoreProps {
  data: ContentData[];
  children: React.ReactNode;
}

export const TooltipShowMore: React.FC<TooltipShowMoreProps> = ({ data, children }) => {
  return (
    <Tooltip
      content={
        <ul className="list-inside list-disc gap-1">
          {data.map((item) => (
            <li className="text-2xs text-default" key={item.id}>
              {item.name}
            </li>
          ))}
        </ul>
      }
    >
      <div className="h-full w-full">{children}</div>
    </Tooltip>
  );
};
