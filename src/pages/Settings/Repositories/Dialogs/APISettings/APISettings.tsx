import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { DefaultDialog } from '@/components/Dialog/DefaultDialog';
import { HelperText, Input, Label } from '@/components/Form';
import { useAPISettings } from './useAPISettings';
import { apiKeyValidation } from './validationForm';

export interface APISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APISettings: React.FC<APISettingsProps> = ({ isOpen, onClose }) => {
  const { loading, handleCancel, register, handleSubmit, handleFormSubmit, errors } =
    useAPISettings({
      isOpen,
      onClose,
    });

  return (
    <DefaultDialog
      className="sm:max-w-[500px]"
      isOpen={isOpen}
      onClose={onClose}
      title="API Settings"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="space-y-4 px-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apiKey" className="text-silver text-xs">
              SOC Prime Platform API Key
            </Label>
            <div className="relative">
              <Input
                className="bg-primary h-10 pr-10 text-xs"
                id="apiKey"
                autoComplete="api-key"
                {...register('apiKey', apiKeyValidation)}
              />
            </div>
            {errors.apiKey && (
              <HelperText className="text-2xs text-critical">{errors.apiKey.message}</HelperText>
            )}
            <p className="text-2xs text-gray-chateau">
              Your API key will be used to authenticate requests to the SOC Prime Platform for
              synchronizing your cloud repositories.{' '}
              <a
                className="text-success underline hover:no-underline"
                href="https://tdm.socprime.com/platform-settings/api/"
                target="_blank"
              >
                Create API Key
              </a>
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="text-xs"
            type="button"
            onClick={handleCancel}
            variant="secondaryOutline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="text-xs"
            onClick={handleSubmit(handleFormSubmit)}
            type="submit"
            variant="primary"
            loading={loading}
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </DefaultDialog>
  );
};
