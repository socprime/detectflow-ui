import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import React, { ComponentType, ErrorInfo, useCallback } from 'react';
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../Button';

interface Error {
  message: string;
  stack: string;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleBack = useCallback(() => window.location.reload(), []);

  return (
    <div className="bg-primary flex min-h-screen w-full items-center justify-center p-8">
      <div className="flex w-full max-w-[600px] flex-col items-center justify-center text-center">
        <div className="bg-critical/10 mb-8 flex h-24 w-24 items-center justify-center rounded-full">
          <AlertCircle size={48} className="text-critical" />
        </div>
        <h1 className="text-default mb-4 text-xl font-semibold">Something went wrong</h1>
        <p className="text-subdued text-m mb-8 leading-relaxed">
          Sorry for the inconvenience. An unexpected error occurred. Please try reloading the page.
        </p>
        {error && (
          <details className="border-border bg-secondary mb-8 w-full rounded-md border p-4 text-left">
            <summary className="text-default hover:text-subdued cursor-pointer p-2 text-sm font-medium select-none">
              Details of the error
            </summary>
            <div className="border-border mt-4 border-t pt-4">
              <p className="text-default mb-4 text-sm">
                <strong className="text-critical">Помилка:</strong> {error.message}
              </p>
              {error.stack && (
                <pre className="border-border bg-primary text-subdued overflow-x-auto rounded-xs border p-4 font-mono text-xs break-all whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="l"
            onClick={resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Try again
          </Button>
          <Button
            variant="secondaryOutline"
            size="l"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, info: ErrorInfo) => void;
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const handleBack = useCallback(() => window.location.reload(), []);

  return (
    <ReactErrorBoundary
      FallbackComponent={(fallback as ComponentType<FallbackProps>) || ErrorFallback}
      onError={(error, info) => onError?.(error as Error, info)}
      onReset={handleBack}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export function RouterErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  const handleBack = useCallback(() => window.location.reload(), []);
  const handleReset = useCallback(() => {
    navigate(0);
  }, [navigate]);

  return (
    <div className="bg-primary flex min-h-screen w-full items-center justify-center p-8">
      <div className="flex w-full max-w-[600px] flex-col items-center justify-center text-center">
        <div className="bg-critical/10 mb-8 flex h-24 w-24 items-center justify-center rounded-full">
          <AlertCircle size={48} className="text-critical" />
        </div>
        <h1 className="text-default mb-4 text-xl font-semibold">Something went wrong</h1>
        <p className="text-subdued text-m mb-8 leading-relaxed">
          Sorry for the inconvenience. An unexpected error occurred. Please try reloading the page.
        </p>
        {error && (
          <details className="border-border bg-secondary mb-8 w-full rounded-md border p-4 text-left">
            <summary className="text-default hover:text-subdued cursor-pointer p-2 text-sm font-medium select-none">
              Details of the error
            </summary>
            <div className="border-border mt-4 border-t pt-4">
              <p className="text-default mb-4 text-sm">
                <strong className="text-critical">Error:</strong>{' '}
                {error instanceof Error ? error.message : String(error)}
              </p>
              {error instanceof Error && error.stack && (
                <pre className="border-border bg-primary text-subdued overflow-x-auto rounded-xs border p-4 font-mono text-xs break-all whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="l"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Try again
          </Button>
          <Button
            variant="secondaryOutline"
            size="l"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
