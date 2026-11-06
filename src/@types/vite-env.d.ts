/// <reference types="vite/client" />

// eslint-disable-next-line no-underscore-dangle -- name is fixed by the `define` in vite.config.ts
declare const __APP_VERSION__: string;

declare module '*.mmd?raw' {
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
