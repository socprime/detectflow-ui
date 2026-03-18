import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { TextTruncate } from '@/components/TextTruncate';
import { RunTransformTestResult } from '@/models/providers';
import { parseData } from '../utils';

interface TestResultItemDefaultProps {
  item: RunTransformTestResult;
  index: number;
  onlyRead?: boolean;
}

export const TestResultItemDefault = ({
  item,
  index,
  onlyRead = false,
}: TestResultItemDefaultProps) => {
  return (
    <AccordionItem
      key={`${item.source_data}-${index}`}
      value={`item-${index}`}
      className="min-w-0 overflow-hidden"
    >
      <AccordionTrigger
        chevronPosition={onlyRead ? undefined : 'left'}
        chevronClassName="[&_svg]:rotate-[-90deg]"
        className="border-border text-subdued hover:bg-hover text-2xs relative min-w-0 overflow-hidden border-b text-left font-medium [&[data-state=open]>svg]:rotate-[0deg]"
      >
        <TextTruncate
          className="w-0 min-w-0 flex-1"
          showCopy={item.success}
          showToggle={item.success}
        >
          {parseData(item.source_data)}
        </TextTruncate>
      </AccordionTrigger>
      {!onlyRead && (
        <AccordionContent className="min-w-0 overflow-hidden p-2">
          <div className="min-w-0 gap-1">
            {Object.entries(item?.parsed_data || {})?.map(([key, value]) => (
              <div key={key} className="flex gap-2 break-words">
                <span className="text-gray-chateau text-2xs min-w-25 font-medium">{key}:</span>
                <span className="text-subdued text-2xs break-all">
                  {parseData(value as string)}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
