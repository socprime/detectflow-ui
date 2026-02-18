import { AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { TextTruncate } from '@/components/TextTruncate';
import { RunTransformTestResult } from '@/models/providers';
import { InfoIcon } from 'lucide-react';

interface TestResultItemErrorProps {
  item: RunTransformTestResult;
  index: number;
}

export const TestResultItemError = ({ item, index }: TestResultItemErrorProps) => {
  return (
    <AccordionItem
      key={`${item.source_data}-${index}`}
      value={`item-${index}`}
      className="min-w-0 overflow-hidden"
    >
      <AccordionTrigger
        chevronPosition={undefined}
        chevronClassName="[&_svg]:rotate-[0deg]"
        className="border-border text-subdued hover:bg-hover text-2xs relative min-w-0 overflow-hidden border-b text-left font-medium [&[data-state=open]>svg]:rotate-[0deg]"
      >
        <InfoIcon className="text-critical-light no-rotate size-4" />
        <TextTruncate className="w-0 min-w-0 flex-1" showCopy showToggle>
          {item.source_data}
        </TextTruncate>
        <span className="text-critical-light text-3xs absolute right-1 bottom-0.5">
          Parsing error
        </span>
      </AccordionTrigger>
    </AccordionItem>
  );
};
