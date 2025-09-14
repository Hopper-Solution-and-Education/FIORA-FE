'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeviceType } from '@/shared/hooks/useIsMobile';
import React from 'react';
import { locale } from 'reactjs-tiptap-editor/locale-bundle';

interface HeaderActionsProps {
  mode: DeviceType | 'full' | 'small' | 'medium' | 'large';
  type: DeviceType;
  disable: boolean;
  setMode: (mode: DeviceType | 'full' | 'small' | 'medium' | 'large') => void;
  handleReview: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  mode,
  type,
  disable,
  setMode,
  handleReview,
}) => {
  return (
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
                <Icons.languages className="h-3 w-3 mr-1" /> VI
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
                <Icons.languages className="h-3 w-3 mr-1" /> EN
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
              {disable ? <Icons.eye className="h-4 w-4" /> : <Icons.edit3 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disable ? 'Switch to editable mode' : 'Switch to readonly mode'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default HeaderActions;
