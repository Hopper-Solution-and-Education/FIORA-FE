'use client';

import { type DeviceType, useDeviceDetect } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/lib';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import RichTextEditor from 'reactjs-tiptap-editor';
import {
  BubbleMenuDrawer,
  BubbleMenuExcalidraw,
  BubbleMenuKatex,
  BubbleMenuMermaid,
  BubbleMenuTwitter,
} from 'reactjs-tiptap-editor/bubble-extra';
import HeaderActions from './components/HeaderAction';
import { defaultExtensions } from './constants';
import { commonEditorStyles as styles } from './styles';
import type { RichTextEditorProps } from './types';

interface CommonEditorProps extends RichTextEditorProps {
  wrapperClassName?: string;
  headerActions?: boolean;
  isFullHeight?: boolean;
  scroll?: number;
  onChangeDisable?: (disable: boolean) => void;
  onChangeMode?: (mode: DeviceType | 'full' | 'small' | 'medium' | 'large') => void;
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
  isFullHeight,
  scroll,
  onChangeDisable,
  onChangeMode,
  ...rest
}) => {
  const { type } = useDeviceDetect();
  const [mode, setMode] = useState<DeviceType | 'full' | 'small' | 'medium' | 'large'>(type);
  const [disable, setDisable] = useState(false);

  const debouncedOnChangeContent = useCallback(
    debounce((value: any) => {
      onChangeContent?.(value);
    }, 300),
    [onChangeContent],
  );

  const handleReview = () => {
    if (disable) {
      setMode(type);
      onChangeMode?.(type);
      setDisable(false);
      onChangeDisable?.(false);
    } else {
      setMode('full');
      onChangeMode?.('full');
      setDisable(true);
      onChangeDisable?.(true);
    }
  };

  const handleMode = (mode: DeviceType | 'full' | 'small' | 'medium' | 'large') => {
    setMode(mode);
    onChangeMode?.(mode);
  };

  useEffect(() => {
    if (scroll) return;
    if (isFullHeight && !scroll) {
      setMode('full');
      onChangeMode?.('full');
    } else {
      setMode(type);
      onChangeMode?.(type);
    }
  }, [type, scroll]);

  return (
    <div className={cn(styles.wrapper(), wrapperClassName)}>
      {headerActions && (
        <HeaderActions
          mode={mode}
          type={type}
          disable={disable}
          setMode={handleMode}
          handleReview={handleReview}
        />
      )}

      <RichTextEditor
        dark={dark}
        output={output}
        extensions={extensions}
        content={content}
        onChangeContent={debouncedOnChangeContent}
        contentClass={cn(
          styles.content({
            height: scroll ? 'custom' : mode,
          }),
          scroll && `h-[${scroll}px]`,
          rest.contentClass,
        )}
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
