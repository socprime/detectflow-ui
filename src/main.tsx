import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/Toast';
import { router } from './models/router/router';
import { initializeAuth } from './store';

import './index.scss';

initializeAuth();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
    <Toaster />
  </ErrorBoundary>,
);
