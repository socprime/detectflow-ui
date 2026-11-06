import { Control, Controller } from 'react-hook-form';
import type { PresetOption, SentinelFormValues } from '../types';

import { Label, SelectDefault } from '@socprime/react-ui';

interface AdditionalSettingsProps {
  control: Control<SentinelFormValues>;
  presets: PresetOption[];
  presetsLoading: boolean;
}

export const AdditionalSettings: React.FC<AdditionalSettingsProps> = ({
  control,
  presets,
  presetsLoading,
}) => {
  return (
    <div className="flex flex-col gap-2 p-6">
      <Label htmlFor="presets" className="text-subdued text-xs font-medium">
        Presets
      </Label>
      <Controller
        name="preset"
        control={control}
        render={({ field }) => (
          <SelectDefault
            id="presets"
            loading={presetsLoading}
            disabled={presetsLoading}
            className="bg-primary h-10"
            options={presets}
            placeholder="Select Preset"
            value={field.value ?? ''}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
};
