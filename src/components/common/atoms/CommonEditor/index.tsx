'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
import { locale } from 'reactjs-tiptap-editor/locale-bundle';
import { defaultExtensions } from './constants';
import { commonEditorStyles as styles } from './styles';
import type { RichTextEditorProps } from './types';

interface CommonEditorProps extends RichTextEditorProps {
  wrapperClassName?: string;
  headerActions?: boolean;
  isFullHeight?: boolean;
  scroll?: number;
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
  ...rest
}) => {
  const { type } = useDeviceDetect();
  const [mode, setMode] = useState<DeviceType | 'full' | 'small' | 'medium' | 'large'>(type);
  const [customScroll, setCustomScroll] = useState<number | null>(null);
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
      setDisable(false);
    } else {
      setMode('full');
      setDisable(true);
    }
  };

  useEffect(() => {
    if (scroll) return;
    if (isFullHeight && !scroll) setMode('full');
    else setMode(type);
  }, [type, scroll]);

  return (
    <div className={cn(styles.wrapper(), wrapperClassName)}>
      {headerActions && (
        <TooltipProvider>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border mb-4">
            {/* Size Controls */}
            <div className="flex items-center gap-1 border-r pr-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={mode === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMode(type)}
                    className="h-8 w-8 p-0"
                  >
                    <Icons.monitorSmartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Default View</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={mode === 'small' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('small')}
                    className="h-8 w-8 p-0"
                  >
                    <Icons.smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Small view</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={mode === 'medium' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('medium')}
                    className="h-8 w-8 p-0"
                  >
                    <Icons.tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Medium view</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={mode === 'large' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('large')}
                    className="h-8 w-8 p-0"
                  >
                    <Icons.monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Large view</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={mode === 'full' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('full')}
                    className="h-8 w-8 p-0"
                  >
                    <Icons.screenShare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full view</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Language Controls */}
            <div className="flex items-center gap-1 border-r pr-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => locale.setLang('vi')}
                    className="h-8 px-2 text-xs font-medium"
                  >
                    <Icons.languages className="h-3 w-3 mr-1" />
                    VI
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tiếng Việt</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => locale.setLang('en')}
                    className="h-8 px-2 text-xs font-medium"
                  >
                    <Icons.languages className="h-3 w-3 mr-1" />
                    EN
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>English</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Edit Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={disable ? 'default' : 'ghost'}
                  size="sm"
                  onClick={handleReview}
                  className="h-8 w-8 p-0"
                >
                  {disable ? (
                    <Icons.eye className="h-4 w-4" />
                  ) : (
                    <Icons.edit3 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{disable ? 'Switch to editable mode' : 'Switch to readonly mode'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
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
