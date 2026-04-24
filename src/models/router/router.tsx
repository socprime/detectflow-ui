import { App } from '@/App';
import { RouterErrorBoundary } from '@/components/ErrorBoundary';
import { SpinnerSquare } from '@/components/Loading';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import { AccountSettings } from '@/pages/AccountSettings';
import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { routes } from './routes';

const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const ChangePassword = lazy(() =>
  import('@/pages/ChangePassword').then((m) => ({ default: m.ChangePassword })),
);
const Account = lazy(() =>
  import('@/pages/AccountSettings/Account').then((m) => ({ default: m.Account })),
);
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Pipelines = lazy(() => import('@/pages/Pipelines').then((m) => ({ default: m.Pipelines })));
const PipelineCreate = lazy(() =>
  import('@/pages/Pipelines/PipelineCreate').then((m) => ({ default: m.PipelineCreate })),
);
const PipelineDetails = lazy(() =>
  import('@/pages/Pipelines/PipelineDetails').then((m) => ({ default: m.PipelineDetails })),
);
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));
const AuditLogs = lazy(() =>
  import('@/pages/Settings/AuditLogs').then((m) => ({ default: m.AuditLogs })),
);
const Filters = lazy(() =>
  import('@/pages/Settings/Filters').then((m) => ({ default: m.Filters })),
);
const FilterCreate = lazy(() =>
  import('@/pages/Settings/Filters/FilterCreate').then((m) => ({ default: m.FilterCreate })),
);
const LogSources = lazy(() =>
  import('@/pages/Settings/LogSources').then((m) => ({ default: m.LogSources })),
);
const LogSourceCreate = lazy(() =>
  import('@/pages/Settings/LogSources/LogSourceCreate').then((m) => ({
    default: m.LogSourceCreate,
  })),
);
const Repositories = lazy(() =>
  import('@/pages/Settings/Repositories').then((m) => ({ default: m.Repositories })),
);
const Rule = lazy(() =>
  import('@/pages/Settings/Repositories/Rule').then((m) => ({ default: m.Rule })),
);
const RuleEdit = lazy(() =>
  import('@/pages/Settings/Repositories/Rule/RuleEdit').then((m) => ({ default: m.RuleEdit })),
);
const Topics = lazy(() => import('@/pages/Settings/Topics').then((m) => ({ default: m.Topics })));
const UserManagement = lazy(() =>
  import('@/pages/Settings/UserManagement').then((m) => ({ default: m.UserManagement })),
);
const PipelineRuntime = lazy(() =>
  import('@/pages/Settings/PipelineRuntime').then((m) => ({ default: m.PipelineRuntime })),
);
const SystemStatus = lazy(() =>
  import('@/pages/Settings/SystemStatus').then((m) => ({ default: m.SystemStatus })),
);
const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<SpinnerSquare />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: routes.login,
    element: <LazyWrapper children={<Login />} />,
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: routes.changePassword,
    element: <LazyWrapper children={<ChangePassword />} />,
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
        path: routes.accountSettings,
        element: <LazyWrapper children={<AccountSettings />} />,
        errorElement: <RouterErrorBoundary />,
        children: [
          {
            index: true,
            element: <Navigate to={routes.accountSettingsAccount} replace />,
          },
          {
            path: routes.accountSettingsAccount,
            element: <LazyWrapper children={<Account />} />,
          },
        ],
      },
      {
        index: true,
        element: <LazyWrapper children={<Dashboard />} />,
      },
      {
        path: routes.pipelines,
        element: <LazyWrapper children={<Pipelines />} />,
      },
      {
        path: routes.pipelineCreate,
        element: <LazyWrapper children={<PipelineCreate />} />,
      },
      {
        path: routes.pipelineEdit,
        element: <LazyWrapper children={<PipelineCreate />} />,
      },
      {
        path: routes.pipelineDetails,
        element: <LazyWrapper children={<PipelineDetails />} />,
      },
      {
        path: routes.settings,
        element: <LazyWrapper children={<Settings />} />,
        children: [
          {
            index: true,
            element: <Navigate to={routes.settingsRepositories} replace />,
          },
          {
            path: routes.settingsRepositories,
            element: <LazyWrapper children={<Repositories />} />,
          },
          {
            path: routes.settingsRepositoriesRule,
            element: <LazyWrapper children={<Rule />} />,
          },
          {
            path: routes.settingsRepositoriesRuleEdit,
            element: <LazyWrapper children={<RuleEdit />} />,
          },
          {
            path: routes.settingsRepositoriesRuleCreate,
            element: <LazyWrapper children={<RuleEdit />} />,
          },
          {
            path: routes.settingsTopics,
            element: <LazyWrapper children={<Topics />} />,
          },
          {
            path: routes.settingsLogSources,
            element: <LazyWrapper children={<LogSources />} />,
          },
          {
            path: routes.settingsLogSourcesCreate,
            element: <LazyWrapper children={<LogSourceCreate />} />,
          },
          {
            path: routes.settingsFilters,
            element: <LazyWrapper children={<Filters />} />,
          },
          {
            path: routes.settingsFilterEdit,
            element: <LazyWrapper children={<FilterCreate />} />,
          },
          {
            path: routes.settingsFilterCreate,
            element: <LazyWrapper children={<FilterCreate />} />,
          },
          {
            path: routes.settingsAuditLogs,
            element: <LazyWrapper children={<AuditLogs />} />,
          },
          {
            path: routes.settingsUserManagement,
            element: <LazyWrapper children={<UserManagement />} />,
          },
          {
            path: routes.settingsPipelineRuntime,
            element: <LazyWrapper children={<PipelineRuntime />} />,
          },
          {
            path: routes.settingsSystemStatus,
            element: <LazyWrapper children={<SystemStatus />} />,
          },
        ],
      },
    ],
  },
]);
