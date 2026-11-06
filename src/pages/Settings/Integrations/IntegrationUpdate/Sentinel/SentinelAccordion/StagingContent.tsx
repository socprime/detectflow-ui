import { Control, Controller, useWatch } from 'react-hook-form';
import type { SentinelFormValues } from '../types';

import { HelperText, InputNumber, Label, SelectDefault, Switch } from '@socprime/react-ui';

interface StagingProps {
  control: Control<SentinelFormValues>;
  loading: boolean;
}

export const Staging: React.FC<StagingProps> = ({ control, loading }) => {
  const stagingEnabled = useWatch({ control, name: 'staging_enabled', defaultValue: true });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex basis-1/2 items-center gap-3">
        <Controller
          name="staging_enabled"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Switch
              disabled={loading}
              id="staging-enabled"
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <div className="flex flex-col gap-1">
          <Label htmlFor="staging-enabled" className="text-default text-sm">
            Enable Staging
          </Label>
          <HelperText className="text-gray-chateau text-2xs">
            Test all detection rules before they can be deployed
          </HelperText>
        </div>
      </div>
      {stagingEnabled !== false && (
        <>
          <div className="flex gap-6">
            <div className="flex basis-1/2 flex-col gap-2">
              <Label htmlFor="staging-period" className="text-subdued text-xs font-medium">
                Period
              </Label>
              <div className="relative flex flex-1">
                <Controller
                  name="staging_period_value"
                  control={control}
                  defaultValue={1}
                  render={({ field: periodField }) => (
                    <InputNumber
                      ref={periodField.ref}
                      parentClassName="flex-1"
                      id="staging-period"
                      className="bg-primary h-10 rounded-r-none pr-30"
                      placeholder="Enter number"
                      min={1}
                      step={1}
                      value={periodField.value ?? 1}
                      onValueChange={periodField.onChange}
                    />
                  )}
                />
                <Controller
                  name="staging_period_unit"
                  control={control}
                  defaultValue="hours"
                  render={({ field: unitField }) => (
                    <SelectDefault
                      id="staging-period-unit"
                      className="bg-primary h-10 w-28 rounded-l-none border-l-0"
                      placeholder="Select"
                      value={unitField.value ?? 'hours'}
                      onChange={unitField.onChange}
                      options={[
                        { label: 'Hours', value: 'hours' },
                        { label: 'Days', value: 'days' },
                        { label: 'Weeks', value: 'weeks' },
                      ]}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex basis-1/2 flex-col gap-2">
              <Label htmlFor="staging-run-frequency" className="text-subdued text-xs font-medium">
                Run Frequency
              </Label>
              <Controller
                name="staging_run_frequency"
                control={control}
                defaultValue="hour-by-hour"
                render={({ field: freqField }) => (
                  <SelectDefault
                    id="staging-run-frequency"
                    className="bg-primary h-10"
                    placeholder="Select"
                    value={freqField.value ?? 'hour-by-hour'}
                    onChange={freqField.onChange}
                    options={[
                      { label: 'Hour by hour', value: 'hour-by-hour' },
                      { label: 'Day by day', value: 'day-by-day' },
                      { label: 'Week by week', value: 'week-by-week' },
                    ]}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex basis-1/2 flex-col gap-2">
              <Label htmlFor="staging-hits-limit" className="text-subdued text-xs font-medium">
                Total Hits Limit
              </Label>
              <Controller
                name="staging_total_hits_limit"
                control={control}
                defaultValue={0}
                render={({ field: hitsField }) => (
                  <InputNumber
                    ref={hitsField.ref}
                    id="staging-hits-limit"
                    className="bg-primary h-10"
                    placeholder="Enter Number"
                    min={0}
                    step={1}
                    value={hitsField.value ?? 0}
                    onValueChange={hitsField.onChange}
                  />
                )}
              />
            </div>
            <div className="flex basis-1/2 flex-col gap-2">
              <Label
                htmlFor="staging-unique-hosts-limit"
                className="text-subdued text-xs font-medium"
              >
                Unique Hosts Limit
              </Label>
              <Controller
                name="staging_unique_hosts_limit"
                control={control}
                defaultValue={0}
                render={({ field: hostsField }) => (
                  <InputNumber
                    ref={hostsField.ref}
                    id="staging-unique-hosts-limit"
                    className="bg-primary h-10"
                    placeholder="Enter Number"
                    min={0}
                    step={1}
                    value={hostsField.value ?? 0}
                    onValueChange={hostsField.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="staging-unique-users-limit"
              className="text-subdued text-xs font-medium"
            >
              Unique Users Limit
            </Label>
            <Controller
              name="staging_unique_users_limit"
              control={control}
              defaultValue={0}
              render={({ field: usersField }) => (
                <InputNumber
                  ref={usersField.ref}
                  id="staging-unique-users-limit"
                  className="bg-primary h-10"
                  placeholder="Enter Number"
                  min={0}
                  step={1}
                  value={usersField.value ?? 0}
                  onValueChange={usersField.onChange}
                />
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};
