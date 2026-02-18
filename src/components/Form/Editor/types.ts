import { EditorProps as MonacoEditorProps } from '@monaco-editor/react';
export type Theme = 'light' | 'dark';

export interface EditorProps {
  loading?: boolean;
  disabled?: boolean;
  value: string;
  language?: string;
  theme?: Theme;
  height?: string;
  className?: string;
  options?: MonacoEditorProps['options'];
  readOnly?: boolean;
  id?: string;
  name?: string;
  autoHeight?: boolean;
  onChange?: (value: string) => void;
}
