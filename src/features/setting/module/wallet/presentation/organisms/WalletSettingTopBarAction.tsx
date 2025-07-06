import React from 'react';
import { WalletSettingSearch } from '../molecules';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import WalletSettingColumnMenu from '../molecules/WalletSettingColumnMenu';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

interface WalletSettingTopBarActionProps {
  className?: string;
}

const WalletSettingTopBarAction = ({ className }: WalletSettingTopBarActionProps) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <WalletSettingSearch value="" onChange={() => {}} />

      <div className="ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
            >
              <Icons.slidersHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-max" align="end" sideOffset={8}>
            <WalletSettingColumnMenu />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default WalletSettingTopBarAction;
