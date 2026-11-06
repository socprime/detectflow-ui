import { Control } from 'react-hook-form';
import type { PresetOption, SentinelFormValues } from '../types';
import { AdditionalSettings } from './AdditionalSettingsContent';
import { DataSchemaValidation } from './DataSchemaValidationContent';
import { Staging } from './StagingContent';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@socprime/react-ui';

interface IntegrationAccordionProps {
  control: Control<SentinelFormValues>;
  loading: boolean;
  isConnected: boolean;
  presets: PresetOption[];
  presetsLoading: boolean;
}

const TRIGGER_CLASSNAME =
  'bg-secondary hover:bg-hover/60 items-center justify-between gap-4 px-6 py-4';

const ITEM_CLASSNAME = 'border-border bg-primary overflow-hidden rounded-sm border';

const CONTENT_CLASSNAME = 'border-border bg-secondary border-t';

export const IntegrationAccordion: React.FC<IntegrationAccordionProps> = ({
  control,
  loading,
  isConnected,
  presets,
  presetsLoading,
}) => {
  return (
    <Accordion
      className="flex flex-col gap-6"
      type="multiple"
      defaultValue={['data-schema-validation']}
    >
      <AccordionItem value="data-schema-validation" className={ITEM_CLASSNAME}>
        <AccordionTrigger className={TRIGGER_CLASSNAME} chevronPosition="right">
          <div className="flex flex-col gap-2">
            <h6 className="text-default text-sm font-medium">Data Schema Validation</h6>
            <p className="text-gray-chateau text-2xs font-normal">
              Automatically map stock detection rule fields to the actual data schema
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className={CONTENT_CLASSNAME}>
          <DataSchemaValidation isConnected={isConnected} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="staging" className={ITEM_CLASSNAME}>
        <AccordionTrigger className={TRIGGER_CLASSNAME} chevronPosition="right">
          <div className="flex flex-col gap-2">
            <h6 className="text-default text-sm font-medium">Staging</h6>
            <p className="text-gray-chateau text-2xs font-normal">
              Set up criteria to test all detection rules before they get to production. Testing is
              done by running a corresponding query in your SIEM according to the schedule below. If
              the set number of hits and unique users/hosts is not exceeded, the rule is considered
              ready for deployment
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className={CONTENT_CLASSNAME}>
          <Staging control={control} loading={loading} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="additional-settings" className={ITEM_CLASSNAME}>
        <AccordionTrigger className={TRIGGER_CLASSNAME} chevronPosition="right">
          <div className="flex flex-col gap-2">
            <h6 className="text-default text-sm font-medium">Additional Settings</h6>
            <p className="text-gray-chateau text-2xs font-normal">
              Configure Presets for this Integration
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className={CONTENT_CLASSNAME}>
          <AdditionalSettings control={control} presets={presets} presetsLoading={presetsLoading} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
