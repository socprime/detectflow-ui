import { Accordion } from '@/components/Accordion';
import { ScrollArea } from '@/components/ScrollArea/ScrollArea';
import { RunTransformTestResult } from '@/models/providers';
import { TestResultItemDefault } from './TestResultItemDefault';
import { TestResultItemError } from './TestResultItemError';

interface TestResultProps {
  parsed: RunTransformTestResult[];
}

export const TestResult: React.FC<TestResultProps> = ({ parsed }) => {
  if (!parsed || parsed.length === 0) {
    return (
      <div className="text-gray-chateau text-2xs style-italic">
        Click "Run Test" to see parsed events...
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="border-border bg-primary flex h-full min-h-0 flex-col overflow-hidden rounded-sm border"
    >
      <ScrollArea orientation="vertical" className="h-full w-full flex-1">
        {parsed?.map((item, index) =>
          item.success ? (
            <TestResultItemDefault item={item} index={index} onlyRead={!item?.parsed_data} />
          ) : (
            <TestResultItemError item={item} index={index} />
          ),
        )}
      </ScrollArea>
    </Accordion>
  );
};
