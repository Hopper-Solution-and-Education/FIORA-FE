'use client';

import { Icons } from '@/components/Icon';
import { Button, ButtonProps } from '@/components/ui/button';
import { DeviceType } from '@/shared/hooks/useIsMobile';
import React, { Fragment } from 'react';
import { locale } from 'reactjs-tiptap-editor/locale-bundle';
import { CommonTooltip } from '../../CommonTooltip';

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
  const sizeItems = [
    {
      icon: <Icons.monitorSmartphone className="h-4 w-4" />,
      label: 'Default View',
      onClick: () => setMode(type),
      variant: mode === type ? 'default' : 'ghost',
    },
    {
      icon: <Icons.smartphone className="h-4 w-4" />,
      label: 'Small view',
      onClick: () => setMode('small'),
      variant: mode === 'small' ? 'default' : 'ghost',
    },
    {
      icon: <Icons.tablet className="h-4 w-4" />,
      label: 'Medium view',
      onClick: () => setMode('medium'),
      variant: mode === 'medium' ? 'default' : 'ghost',
    },
    {
      icon: <Icons.monitor className="h-4 w-4" />,
      label: 'Large view',
      onClick: () => setMode('large'),
      variant: mode === 'large' ? 'default' : 'ghost',
    },
    {
      icon: <Icons.screenShare className="h-4 w-4" />,
      label: 'Full view',
      onClick: () => setMode('full'),
      variant: mode === 'full' ? 'default' : 'ghost',
    },
  ];

  const languageItems = [
    {
      icon: (
        <Fragment>
          <Icons.languages className="h-3 w-3 mr-1" /> VI
        </Fragment>
      ),
      label: 'Tiếng Việt',
      onClick: () => locale.setLang('vi'),
      variant: 'ghost',
    },
    {
      icon: (
        <Fragment>
          <Icons.languages className="h-3 w-3 mr-1" /> EN
        </Fragment>
      ),
      label: 'English',
      onClick: () => locale.setLang('en'),
      variant: 'ghost',
    },
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border mb-4">
      {/* Size Controls */}
      <div className="flex items-center gap-1 border-r pr-3">
        {sizeItems.map((item, index) => (
          <CommonTooltip key={index} content={item.label}>
            <Button
              variant={item.variant as ButtonProps['variant']}
              size="sm"
              onClick={item.onClick}
              className="h-8 w-8 p-0"
            >
              {item.icon}
            </Button>
          </CommonTooltip>
        ))}
      </div>

      {/* Language Controls */}
      <div className="flex items-center gap-1 border-r pr-3">
        {languageItems.map((item, index) => (
          <CommonTooltip key={index} content={item.label}>
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-8 px-2 text-xs font-medium"
            >
              {item.icon}
            </Button>
          </CommonTooltip>
        ))}
      </div>

      {/* Edit Mode Toggle */}
      <CommonTooltip content={disable ? 'Switch to editable mode' : 'Switch to readonly mode'}>
        <Button
          variant={disable ? 'default' : 'ghost'}
          size="sm"
          onClick={handleReview}
          className="h-8 w-8 p-0"
        >
          {disable ? <Icons.eye className="h-4 w-4" /> : <Icons.edit3 className="h-4 w-4" />}
        </Button>
      </CommonTooltip>
    </div>
  );
};

export default HeaderActions;
