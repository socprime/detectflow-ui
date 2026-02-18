import MonacoEditor, { loader } from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Skeleton } from '@/components/Loading';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/utils';
import { defineCustomThemes, editorOptionsFn, setTheme } from './theme';

import { EditorProps } from './types';

export const Editor: React.FC<EditorProps> = ({
  value,
  loading = false,
  language = 'yaml',
  theme: themeProp,
  className,
  options,
  readOnly = false,
  id,
  name,
  autoHeight = false,
  onChange,
  ...props
}) => {
  const editorRef = useRef(null);
  const themeFromStore = useThemeStore((state) => state.theme);
  const theme = themeProp ?? themeFromStore;
  const [monacoInstance, setMonacoInstance] = useState<any | null>(null);

  useEffect(() => {
    loader.init().then((monaco) => {
      defineCustomThemes(monaco);
      setMonacoInstance(monaco);
      setTheme(monaco, theme);
    });
  }, []);

  useEffect(() => {
    if (monacoInstance) {
      setTheme(monacoInstance, theme);
    }
  }, [theme, monacoInstance]);

  const editorOptions = useMemo(() => editorOptionsFn(readOnly, options), [readOnly, options]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    if (autoHeight) {
      updateEditorHeight();
    }

    if (autoHeight) {
      editor.onDidContentSizeChange(() => {
        updateEditorHeight();
      });
    }
  };

  const updateEditorHeight = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const contentHeight = (editor as any).getContentHeight();
    const container = (editor as any).getDomNode();

    if (container) {
      container.style.height = `${contentHeight}px`;
      (editor as any).layout();
    }
  };

  const handleFocus = () => {
    (editorRef.current as any)?.focus?.();
  };

  return (
    <div
      id={id}
      data-name={name}
      className={cn(
        'border-border bg-secondary min-h-[300px] overflow-hidden rounded-md border transition-shadow',
        className,
      )}
      onFocus={handleFocus}
      onClick={handleFocus}
    >
      <MonacoEditor
        onMount={handleEditorDidMount}
        height="100%"
        language={language}
        value={value}
        theme={theme}
        onChange={(val) => onChange?.(val || '')}
        options={editorOptions}
        loading={
          <div className="flex h-full items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        }
        {...props}
      />
    </div>
  );
};
