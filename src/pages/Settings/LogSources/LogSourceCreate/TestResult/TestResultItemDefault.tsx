import { parseData } from '../utils';

import { type RunTransformTestResult } from '@/models/providers';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TextTruncate,
} from '@socprime/react-ui';

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
    <AccordionItem className="min-w-0 overflow-hidden" value={`item-${index}`}>
      <AccordionTrigger
        chevronPosition={onlyRead ? undefined : 'left'}
        chevronVariant={onlyRead ? 'none' : 'section'}
        className="border-border text-subdued hover:bg-hover text-2xs relative min-w-0 overflow-hidden border-b text-left font-medium"
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
                <span className="text-subdued text-2xs break-all">{parseData(value)}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
