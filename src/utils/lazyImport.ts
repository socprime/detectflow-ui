import { lazy } from 'react';

function lazyImport<T extends Record<K, React.ComponentType<any>>, K extends keyof T>(
  factory: () => Promise<T>,
  name: K,
) {
  return lazy(() => factory().then((m) => ({ default: m[name] })));
}

export default lazyImport;
