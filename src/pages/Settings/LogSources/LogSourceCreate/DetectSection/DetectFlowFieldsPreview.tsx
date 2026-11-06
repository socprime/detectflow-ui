import { useMemo } from 'react';
import { type Control, useWatch } from 'react-hook-form';
import type { LogSourceFormData } from '../useLogSourceCreate';
import {
  DETECT_FLOW_HOSTNAME_FIELDS_KEY,
  DETECT_FLOW_TIMESTAMP_FIELDS_KEY,
  formatDetectFlowFieldsDisplay,
  parseDetectFlowArrayField,
} from '../utils';

import { HelperText, Input, Label } from '@socprime/react-ui';

interface DetectFlowFieldsPreviewProps {
  control: Control<LogSourceFormData>;
}

const DETECT_FLOW_FIELDS_PLACEHOLDER = 'Preview unavailable';

export const DetectFlowFieldsPreview: React.FC<DetectFlowFieldsPreviewProps> = ({ control }) => {
  const mapping = useWatch({ control, name: 'mapping' }) ?? '';

  const hostnameFieldsDisplay = useMemo(
    () =>
      formatDetectFlowFieldsDisplay(
        parseDetectFlowArrayField(mapping, DETECT_FLOW_HOSTNAME_FIELDS_KEY),
      ),
    [mapping],
  );
  const timestampFieldsDisplay = useMemo(
    () =>
      formatDetectFlowFieldsDisplay(
        parseDetectFlowArrayField(mapping, DETECT_FLOW_TIMESTAMP_FIELDS_KEY),
      ),
    [mapping],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="hostname-fields" className="text-silver text-xs">
          Hostname Fields
        </Label>
        <Input
          id="hostname-fields"
          className="bg-primary focus-visible:border-border text-xs focus-visible:ring-0"
          readOnly
          value={hostnameFieldsDisplay}
          placeholder={DETECT_FLOW_FIELDS_PLACEHOLDER}
        />
        <HelperText className="text-gray-chateau text-2xs">
          Parsed from <code className="text-2xs">{DETECT_FLOW_HOSTNAME_FIELDS_KEY}</code> in Mapping
          (YAML). Edit there to change.
        </HelperText>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="timestamp-fields" className="text-silver text-xs">
          Timestamp Fields
        </Label>
        <Input
          id="timestamp-fields"
          className="bg-primary focus-visible:border-border text-xs focus-visible:ring-0"
          readOnly
          value={timestampFieldsDisplay}
          placeholder={DETECT_FLOW_FIELDS_PLACEHOLDER}
        />
        <HelperText className="text-gray-chateau text-2xs">
          Parsed from <code className="text-2xs">{DETECT_FLOW_TIMESTAMP_FIELDS_KEY}</code> in
          Mapping (YAML). Edit there to change.
        </HelperText>
      </div>
    </div>
  );
};
