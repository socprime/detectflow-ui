import { createBrowserRouter, Navigate } from 'react-router-dom';
import * as LazyPages from './lazyPages';
import { routes } from './routes';
import { lazyChild, lazyChildren, LazyWrapper } from './utils';

import { App } from '@/App';
import { RouterErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { redirectToPath } from '@/utils';

export const router = createBrowserRouter([
  {
    path: routes.login,
    element: <LazyWrapper children={<LazyPages.Login />} />,
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: routes.changePassword,
    element: <LazyWrapper children={<LazyPages.ChangePassword />} />,
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={routes.pipelines} replace />,
      },
      lazyChild(routes.pipelines, LazyPages.Pipelines),
      ...lazyChildren([routes.matchingCreate, routes.matchingEdit], LazyPages.MatchingUpdate),
      ...lazyChildren([routes.chainingCreate, routes.chainingEdit], LazyPages.ChainingUpdate),
      lazyChild(routes.pipelineDetails, LazyPages.PipelineDetails),
      {
        path: routes.accountSettings,
        element: <LazyWrapper children={<LazyPages.AccountSettings />} />,
        children: [
          {
            index: true,
            element: <Navigate to={routes.accountSettingsAccount} replace />,
          },
          lazyChild(routes.accountSettingsAccount, LazyPages.Account),
        ],
      },
      {
        path: routes.repositories,
        element: <LazyWrapper children={<LazyPages.Repositories />} />,
        children: [
          {
            index: true,
            element: <LazyWrapper children={<LazyPages.RepositoriesContent />} />,
          },
          lazyChild(routes.repositoriesHOS, LazyPages.HOSRules),
        ],
      },
      lazyChild(routes.repositoriesHOSRule, LazyPages.RuleHOS),
      ...lazyChildren([routes.repositoriesRule, routes.pipelineDetailsRule], LazyPages.Rule),
      ...lazyChildren(
        [
          routes.repositoriesRuleEdit,
          routes.pipelineDetailsRuleEdit,
          routes.repositoriesRuleCreate,
        ],
        LazyPages.RuleEdit,
      ),
      {
        path: routes.settings,
        element: <LazyWrapper children={<LazyPages.Settings />} />,
        children: [
          {
            index: true,
            element: <Navigate to={routes.settingsTopics} replace />,
          },
          lazyChild(routes.settingsTopics, LazyPages.Topics),
          lazyChild(routes.settingsLogSources, LazyPages.LogSources),
          ...lazyChildren(
            [routes.settingsLogSourcesCreate, routes.settingsLogSourceEdit],
            LazyPages.LogSourceCreate,
          ),
          lazyChild(routes.settingsIntegrations, LazyPages.Integrations),
          ...lazyChildren(
            [routes.settingsIntegrationsEdit, routes.settingsIntegrationsAdd],
            LazyPages.IntegrationUpdate,
          ),
          lazyChild(routes.settingsFilters, LazyPages.Filters),
          ...lazyChildren(
            [routes.settingsFilterEdit, routes.settingsFilterCreate],
            LazyPages.FilterCreate,
          ),
          lazyChild(routes.settingsAuditLogs, LazyPages.AuditLogs),
          lazyChild(routes.settingsUserManagement, LazyPages.UserManagement),
          lazyChild(routes.settingsPipelineRuntime, LazyPages.PipelineRuntime),
          lazyChild(routes.settingsSystemStatus, LazyPages.SystemStatus),
          lazyChild(routes.settingsPresets, LazyPages.Presets),
          ...lazyChildren(
            [routes.settingsPresetCreate, routes.settingsPresetEdit],
            LazyPages.PresetCreate,
          ),
        ],
      },
      lazyChild(routes.attackChains, LazyPages.AttackChains),
      lazyChild(routes.attackChainCorrelationPipelineDetails, LazyPages.ChainingUpdate),
      {
        path: routes.attackChainDetails,
        element: <LazyWrapper children={<LazyPages.AttackChainDetails />} />,
        children: [
          {
            index: true,
            loader: redirectToPath(routes.attackChainGeneral),
          },
          lazyChild(routes.attackChainGeneral, LazyPages.AttackChainGeneral),
          lazyChild(routes.attackChainSigmaRule, LazyPages.AttackChainHOSRules),
        ],
      },
      {
        path: routes.activeThreatDetails,
        element: <LazyWrapper children={<LazyPages.ActiveThreatDetails />} />,
        children: [
          {
            index: true,
            loader: redirectToPath(routes.activeThreatOverview),
          },
          lazyChild(routes.activeThreatOverview, LazyPages.ActiveThreatOverview),
          lazyChild(routes.activeThreatAttackFlow, LazyPages.ActiveThreatAttackFlow),
          lazyChild(routes.activeThreatDetections, LazyPages.ActiveThreatDetections),
        ],
      },
      lazyChild(routes.activeThreatSigmaRule, LazyPages.RuleHOS),
      lazyChild(routes.activeThreatDetection, LazyPages.Rule),
      lazyChild(routes.attackChainRule, LazyPages.Rule),
    ],
  },
]);
