import { Button } from '@socprime/react-ui';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import React, { ComponentType, ErrorInfo, ReactNode, useCallback } from 'react';
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useNavigate, useRouteError } from 'react-router-dom';

interface Error {
  message: string;
  stack: string;
}

interface ErrorFallbackViewProps {
  message: string;
  stack?: string | null;
  onRetry: () => void;
  retryLabel: string;
  retryIcon?: ReactNode;
  onSecondaryAction: () => void;
  secondaryLabel: string;
  secondaryIcon?: ReactNode;
}

function ErrorFallbackView({
  message,
  stack,
  onRetry,
  retryLabel,
  retryIcon,
  onSecondaryAction,
  secondaryLabel,
  secondaryIcon,
}: ErrorFallbackViewProps) {
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
        {message && (
          <details className="border-border bg-secondary mb-8 w-full rounded-md border p-4 text-left">
            <summary className="text-default hover:text-subdued cursor-pointer p-2 text-sm font-medium select-none">
              Details of the error
            </summary>
            <div className="border-border mt-4 border-t pt-4">
              <p className="text-default mb-4 text-sm">
                <strong className="text-critical">Error:</strong> {message}
              </p>
              {stack && (
                <pre className="border-border bg-primary text-subdued overflow-x-auto rounded-xs border p-4 font-mono text-xs break-all whitespace-pre-wrap">
                  {stack}
                </pre>
              )}
            </div>
          </details>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="l" onClick={onRetry} className="flex items-center gap-2">
            {retryIcon}
            {retryLabel}
          </Button>
          <Button
            variant="secondaryOutline"
            size="l"
            onClick={onSecondaryAction}
            className="flex items-center gap-2"
          >
            {secondaryIcon}
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleReload = useCallback(() => window.location.reload(), []);

  return (
    <ErrorFallbackView
      message={error?.message}
      stack={error?.stack}
      onRetry={resetErrorBoundary}
      retryLabel="Try again"
      retryIcon={<RefreshCw size={20} />}
      onSecondaryAction={handleReload}
      secondaryLabel="Reload page"
    />
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
  const error = useRouteError();
  const navigate = useNavigate();
  const handleReload = useCallback(() => window.location.reload(), []);
  const handleReset = useCallback(() => {
    navigate(0);
  }, [navigate]);

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return (
    <ErrorFallbackView
      message={message}
      stack={stack}
      onRetry={handleReset}
      retryLabel="Try again"
      retryIcon={<RefreshCw size={20} />}
      onSecondaryAction={handleReload}
      secondaryLabel="Back to home"
      secondaryIcon={<ArrowLeft size={20} />}
    />
  );
}
