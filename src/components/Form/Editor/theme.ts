import { Monaco } from '@monaco-editor/react';
import { EditorProps, Theme } from './types';

let themesDefined = false;

export const defineCustomThemes = (monaco: Monaco) => {
  if (themesDefined) {
    return;
  }

  monaco.editor.defineTheme('light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#F9FAFB',
      'editor.foreground': '#cfd0d3',
    },
  });

  monaco.editor.defineTheme('dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1F2232',
      'editor.foreground': '#cfd0d3',
    },
  });

  themesDefined = true;
};

export const setTheme = (monaco: Monaco, theme: Theme) => {
  monaco.editor.setTheme(theme);
};

export const editorOptionsFn = (
  readOnly: EditorProps['readOnly'],
  options: EditorProps['options'],
) => ({
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  lineNumbers: 'on' as const,
  readOnly,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  renderWhitespace: 'selection' as const,
  matchBrackets: 'always' as const,
  folding: true,
  showFoldingControls: 'always' as const,
  ...options,
});
