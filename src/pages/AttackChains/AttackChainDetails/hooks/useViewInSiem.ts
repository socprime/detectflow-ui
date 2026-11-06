import { toast } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';

import { usePermissions } from '@/hooks';
import { api, ApiError } from '@/models/providers';
import type { ConnectedIntegrationProfile } from '@/models/providers/Types/responses/integrations';
import { useIntegrationsStore } from '@/store';


export type ViewInSiemState = ReturnType<typeof useViewInSiem>;

export const useViewInSiem = (chainId?: string) => {
  const [profiles, setProfiles] = useState<ConnectedIntegrationProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const fetchViewInSiem = useIntegrationsStore((state) => state.fetchViewInSiem);
  const viewInSiemLoading = useIntegrationsStore((state) => state.viewInSiemLoading);
  const { isViewer } = usePermissions();

  useEffect(() => {
    if (!chainId) {
      setProfiles([]);
      return;
    }

    let cancelled = false;

    const loadProfiles = async () => {
      setProfilesLoading(true);

      try {
        const [typesResponse, integrationsResponse] = await Promise.all([
          api.settings.integrations.getTypes(),
          api.settings.integrations.getList({ limit: 100 }),
        ]);

        const supportedTypes = new Set(
          typesResponse.data
            .filter((type) => type.capabilities.includes('view_in_siem'))
            .map((type) => type.integration_type),
        );

        const viewInSiemProfiles = integrationsResponse.data.filter((profile) =>
          supportedTypes.has(profile.integration_type),
        );

        if (!cancelled) {
          setProfiles(viewInSiemProfiles);
        }
      } catch {
        if (!cancelled) {
          setProfiles([]);
        }
      } finally {
        if (!cancelled) {
          setProfilesLoading(false);
        }
      }
    };

    void loadProfiles();

    return () => {
      cancelled = true;
    };
  }, [chainId]);

  const openInSiem = useCallback(
    async (integrationId: string, sigmaRuleId?: string) => {
      if (!chainId) {
        return;
      }

      try {
        const viewInSiemResult = await fetchViewInSiem(integrationId, {
          chain_id: chainId,
          ...(sigmaRuleId ? { sigma_rule_id: sigmaRuleId } : {}),
        });

        if (!viewInSiemResult.status) {
          toast.error(viewInSiemResult.message || 'Failed to open SIEM view');
          return;
        }

        if (!viewInSiemResult.url) {
          toast.error(viewInSiemResult.message || 'SIEM link is not available');
          return;
        }

        window.open(viewInSiemResult.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        const message = error instanceof ApiError ? error.message : 'Failed to open SIEM view';
        toast.error(message);
      }
    },
    [chainId],
  );

  const isDisabled = !chainId || profilesLoading || profiles.length === 0 || isViewer;
  const isBusy = profilesLoading || viewInSiemLoading;

  return {
    profiles,
    profilesLoading,
    viewInSiemLoading,
    isDisabled,
    isBusy,
    hasMultipleProfiles: profiles.length > 1,
    singleProfile: profiles.length === 1 ? profiles[0] : null,
    openInSiem,
  };
};
