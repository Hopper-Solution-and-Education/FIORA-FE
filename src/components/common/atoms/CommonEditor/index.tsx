'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib';
import React, { useCallback, useEffect, useState } from 'react';
import RichTextEditor from 'reactjs-tiptap-editor';
import {
  BubbleMenuDrawer,
  BubbleMenuExcalidraw,
  BubbleMenuKatex,
  BubbleMenuMermaid,
  BubbleMenuTwitter,
} from 'reactjs-tiptap-editor/bubble-extra';
import { locale } from 'reactjs-tiptap-editor/locale-bundle';
import { defaultExtensions } from './constants';
import { RichTextEditorProps } from './types';

interface CommonEditorProps extends RichTextEditorProps {
  wrapperClassName?: string;
  headerActions?: boolean;
  isFullHeight?: boolean;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const CommonEditor: React.FC<CommonEditorProps> = ({
  wrapperClassName,
  output = 'html',
  extensions = defaultExtensions,
  dark = false,
  content,
  onChangeContent,
  headerActions = true,
  isFullHeight = true,
  ...rest
}) => {
  const [disable, setDisable] = useState(false);
  const [contentClass, setContentClass] = useState('');

  const debouncedOnChangeContent = useCallback(
    debounce((value: any) => {
      onChangeContent?.(value);
    }, 300),
    [onChangeContent],
  );

  useEffect(() => {
    let contentClass = '';
    if (isFullHeight) {
      contentClass = 'h-[calc(100vh-25rem)] overflow-auto';
    }
    if (headerActions) {
      contentClass = 'h-[calc(100vh-28em)] overflow-auto';
    }
    if (rest.contentClass) {
      contentClass = cn(contentClass, rest.contentClass);
    }
    setContentClass(contentClass);
  }, [isFullHeight]);

  return (
    <div className={cn('w-full h-full', wrapperClassName)}>
      {headerActions && (
        <div className="buttonWrap" style={{ display: 'flex', gap: '12px', marginBottom: 10 }}>
          <Button className="bg-blue-500 hover:bg-blue-700" onClick={() => locale.setLang('vi')}>
            Vietnamese
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-700" onClick={() => locale.setLang('en')}>
            English
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-700" onClick={() => setDisable(!disable)}>
            {disable ? 'Editable' : 'Readonly'}
          </Button>
        </div>
      )}

      <RichTextEditor
        dark={dark}
        output={output}
        extensions={extensions}
        content={content}
        onChangeContent={debouncedOnChangeContent}
        contentClass={contentClass}
        disabled={disable}
        bubbleMenu={{
          render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
            return (
              <>
                {bubbleDefaultDom}
                {extensionsNames.includes('twitter') && (
                  <BubbleMenuTwitter disabled={disabled} editor={editor} key="twitter" />
                )}
                {extensionsNames.includes('katex') && (
                  <BubbleMenuKatex disabled={disabled} editor={editor} key="katex" />
                )}
                {extensionsNames.includes('excalidraw') && (
                  <BubbleMenuExcalidraw disabled={disabled} editor={editor} key="excalidraw" />
                )}
                {extensionsNames.includes('mermaid') && (
                  <BubbleMenuMermaid disabled={disabled} editor={editor} key="mermaid" />
                )}
                {extensionsNames.includes('drawer') && (
                  <BubbleMenuDrawer disabled={disabled} editor={editor} key="drawer" />
                )}
              </>
            );
          },
        }}
        {...rest}
      />
    </div>
  );
};

export default CommonEditor;
