import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { FC } from 'react';
import { SchemaFields } from '../SchemaFields';
import { ConnectionSection } from '../ThreatDetectionMarketplace/ConnectionSection';
import { useIntegrationForm } from './useIntegrationForm';

import { useReturnLink } from '@/hooks';
import { useModal } from '@/hooks/useModal';
import { routes } from '@/models/router';
import {
  Button,
  ConditionalContent,
  ConfirmDeleteDialog,
  PageHeader,
  Skeleton,
} from '@socprime/react-ui';

interface IntegrationFormProps {
  integrationType: string;
}

export const IntegrationForm: FC<IntegrationFormProps> = ({ integrationType }) => {
  const {
    mode,
    loading,
    errors,
    isValid,
    isDirty,
    configSchema,
    sensitiveFields,
    integrationDetail,
    integrationTypeDetail,
    featureConfig,
    connectionStatus,
    isChecking,
    isConnected,
    control,
    register,
    handleSubmit,
    handleFormSubmit,
    handleCheckConnection,
    handleDeleteIntegration,
  } = useIntegrationForm(integrationType);
  const { isOpen, openModal, closeModal } = useModal();
  const { ExtraSections } = featureConfig;
  const backLink = useReturnLink({ fallback: routes.settingsIntegrations });

  return (
    <section className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        <PageHeader
          loading={loading}
          title={
            mode === 'add'
              ? `Add ${integrationTypeDetail?.display_name ?? 'Integration'} Profile`
              : (integrationDetail?.name ?? '')
          }
          description={
            mode === 'add' ? 'Create New Integration Profile' : 'Edit Integration Profile'
          }
          backLink={backLink}
        >
          <Button
            className="text-xs"
            size="l"
            variant="secondaryOutline"
            to={routes.settingsIntegrations}
            loading={loading}
          >
            Cancel
          </Button>
          <Button
            className="text-xs"
            size="l"
            variant="primary"
            type="submit"
            disabled={!isValid || !isDirty}
            loading={loading}
          >
            {mode === 'add' ? <PlusIcon className="size-4" /> : <SaveIcon className="size-4" />}
            {mode === 'add' ? 'Create' : 'Update'}
          </Button>
        </PageHeader>

        <ConnectionSection
          title="API Connection"
          description={
            featureConfig.connectionDescription ?? integrationTypeDetail?.description ?? ''
          }
          disabled={isChecking || !isValid}
          connectionStatus={featureConfig.supportsConnectionCheck ? connectionStatus : undefined}
          onCheckConnection={
            featureConfig.supportsConnectionCheck ? handleCheckConnection : undefined
          }
        >
          <div className="flex flex-col gap-4">
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-10 w-full" rows={4} />}
              loadedContent={
                configSchema && (
                  <SchemaFields
                    mode={mode}
                    control={control}
                    schema={configSchema}
                    sensitiveFields={sensitiveFields}
                    register={register}
                    errors={errors}
                    validationRules={featureConfig.validationRules}
                  />
                )
              }
            />
          </div>
        </ConnectionSection>

        {ExtraSections && <ExtraSections mode={mode} loading={loading} isConnected={isConnected} />}
      </form>

      {mode === 'edit' && (
        <div className="flex justify-end">
          <Button
            disabled={loading}
            size="l"
            className="gap-2 text-xs"
            variant="criticalOutline"
            type="button"
            onClick={openModal}
          >
            <TrashIcon className="size-4" />
            Delete
          </Button>
        </div>
      )}

      {isOpen && (
        <ConfirmDeleteDialog
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={handleDeleteIntegration}
          title="Delete Integration"
          message={<span className="break-all">{integrationDetail?.name || 'this integration'}</span>}
        />
      )}
    </section>
  );
};
