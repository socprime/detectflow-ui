import { InfoIcon } from 'lucide-react';

import { type RunTransformTestResult } from '@/models/providers';
import { AccordionItem, AccordionTrigger, TextTruncate } from '@socprime/react-ui';

interface TestResultItemErrorProps {
  item: RunTransformTestResult;
  index: number;
}

export const TestResultItemError = ({ item, index }: TestResultItemErrorProps) => {
  return (
    <AccordionItem className="min-w-0 overflow-hidden" value={`item-${index}`}>
      <AccordionTrigger
        chevronVariant="none"
        className="border-border text-subdued hover:bg-hover text-2xs relative min-w-0 overflow-hidden border-b text-left font-medium"
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
