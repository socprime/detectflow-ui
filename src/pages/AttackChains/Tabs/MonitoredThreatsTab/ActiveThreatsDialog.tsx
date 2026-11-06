import { TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { renderDescriptionWithPipelineAddLink } from './utils';

import { ActiveThreatListItem } from '@/models/providers';
import { routeHelpers } from '@/models/router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DefaultDialog,
  ScrollArea,
} from '@socprime/react-ui';

interface ActiveThreatsDialogProps {
  isOpen: boolean;
  threat?: ActiveThreatListItem;
  onClose: () => void;
}

export const ActiveThreatsDialog: React.FC<ActiveThreatsDialogProps> = ({
  isOpen,
  threat,
  onClose,
}) => {
  return (
    <DefaultDialog
      isOpen={isOpen}
      onClose={onClose}
      className="bg-primary top-auto bottom-10 translate-y-0 overflow-hidden sm:max-w-[700px]"
      title={
        <span className="flex flex-col gap-2">
          <span className="text-dark-gray text-2xs font-medium uppercase">Issues Navigator</span>
          <span className="text-default text-xs font-semibold">{threat?.name}</span>
        </span>
      }
      classNameHeader="border-none px-5 py-3 m-0"
    >
      <Accordion type="multiple">
        {!!threat?.rule_check_results?.unsupported_rules?.length && (
          <AccordionItem className="bg-secondary" value="item-1">
            <AccordionTrigger
              chevronPosition="left"
              chevronVariant="section"
              className="border-border hover:bg-hover/50 border-t px-4 py-2"
            >
              <div className="text-subdued flex flex-1 items-center justify-between gap-2">
                <span className="text-2xs font-medium uppercase">Sigma Not Supported</span>
                <span className="text-3xs font-normal">
                  {threat?.rule_check_results?.unsupported_rules?.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-border bg-primary border-t py-2 pr-2 pl-7">
              <ScrollArea className="max-h-50">
                <div className="flex flex-col gap-2">
                  {threat?.rule_check_results?.unsupported_rules?.map((rule) => (
                    <div className="flex items-center gap-2" key={rule.rule_id}>
                      <TriangleAlertIcon className="text-yellow/80 size-3.5" />
                      <span className="flex flex-col gap-1">
                        <span className="text-default text-2xs font-medium">{rule.rule_name}</span>
                        <span className="text-3xs text-dark-gray font-normal">
                          {rule.description}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}
        {!!threat?.rule_check_results?.not_connected_rules?.length && (
          <AccordionItem className="bg-secondary" value="item-2">
            <AccordionTrigger
              chevronPosition="left"
              chevronVariant="section"
              className="text-2xs text-subdued border-border hover:bg-hover/50 border-t px-4 py-2 uppercase"
            >
              <div className="text-subdued flex flex-1 items-center justify-between gap-2">
                <span className="text-2xs font-medium uppercase">
                  Not Connected to any pipeline
                </span>
                <span className="text-3xs font-normal">
                  {threat?.rule_check_results?.not_connected_rules?.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-border bg-primary border-t py-2 pr-2 pl-7">
              <ScrollArea className="max-h-50">
                <div className="flex flex-col gap-2">
                  {threat?.rule_check_results?.not_connected_rules?.map((rule) => (
                    <div className="flex items-center gap-2" key={rule.rule_id}>
                      <TriangleAlertIcon className="text-yellow/80 size-3.5" />
                      <span className="flex flex-col gap-1">
                        <span className="text-default text-2xs font-medium">{rule.rule_name}</span>
                        <span className="text-3xs text-dark-gray font-normal">
                          {renderDescriptionWithPipelineAddLink(rule.description)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}
        {!!threat?.rule_check_results?.disabled_rules?.length && (
          <AccordionItem className="bg-secondary" value="item-3">
            <AccordionTrigger
              chevronPosition="left"
              chevronVariant="section"
              className="border-border hover:bg-hover/50 border-t px-4 py-2"
            >
              <div className="text-subdued flex flex-1 items-center justify-between gap-2">
                <span className="text-2xs font-medium uppercase">Detection rule disabled</span>
                <span className="text-3xs font-normal">
                  {threat?.rule_check_results?.disabled_rules?.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-border bg-primary border-t py-2 pr-2 pl-7">
              <ScrollArea className="max-h-50">
                <div className="flex flex-col gap-2">
                  {threat?.rule_check_results?.disabled_rules?.map((rule) => (
                    <div className="flex items-center gap-2" key={rule.rule_id}>
                      <TriangleAlertIcon className="text-yellow/80 size-3.5" />
                      <span className="text-default flex flex-col gap-1 font-normal">
                        <span className="flex flex-col gap-1">
                          <span className="text-default text-2xs font-medium">
                            {rule.rule_name}
                          </span>
                          <span className="text-3xs text-dark-gray font-normal">
                            {rule.description ??
                              'This detection has been disabled in the following pipelines: '}
                            {rule.pipelines.map((pipeline) => (
                              <Link
                                to={routeHelpers.pipelineDetails(pipeline.id)}
                                className="text-3xs text-success hover:underline"
                                key={pipeline.id}
                                target="_blank"
                              >
                                {pipeline.name}
                              </Link>
                            ))}
                          </span>
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </DefaultDialog>
  );
};
