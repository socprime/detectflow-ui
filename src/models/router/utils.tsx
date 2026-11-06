import { ComponentType, LazyExoticComponent, ReactElement, ReactNode, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { SpinnerSquare } from '@socprime/react-ui';

type LazyPage = LazyExoticComponent<ComponentType>;

export const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<SpinnerSquare />}>{children}</Suspense>
);

const lazyElement = (Page: LazyPage): ReactElement => (
  <LazyWrapper>
    <Page />
  </LazyWrapper>
);

export const lazyChild = (path: string, Page: LazyPage): RouteObject => ({
  path,
  element: lazyElement(Page),
});

export const lazyChildren = (paths: readonly string[], Page: LazyPage): RouteObject[] =>
  paths.map((path) => lazyChild(path, Page));
