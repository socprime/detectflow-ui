import { DatabaseIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { IntegrationForm } from './IntegrationForm';

import { EmptyState } from '@socprime/react-ui';

export const IntegrationUpdate = () => {
  const { integrationType } = useParams<{ integrationType: string }>();

  if (!integrationType) {
    return (
      <EmptyState
        Icon={DatabaseIcon}
        title="Missing Integration Type"
        description="No integration type specified. Please select an integration type first."
      />
    );
  }

  return <IntegrationForm integrationType={integrationType} />;
};
