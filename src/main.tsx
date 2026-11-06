import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './models/router/router';
import { initializeAuth } from './store';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/Toaster';

import './assets/scss/index.scss';

initializeAuth();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
    <Toaster />
  </ErrorBoundary>,
);
