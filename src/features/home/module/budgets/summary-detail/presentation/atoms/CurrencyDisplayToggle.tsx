'use client';

import { Icons } from '@/components/Icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFullCurrencyDisplay } from '@/store/slices/setting.slice';

interface CurrencyDisplayToggleProps {
  className?: string;
}

const CurrencyDisplayToggle = ({ className }: CurrencyDisplayToggleProps) => {
  const { isFullCurrencyDisplay } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const handleValueChange = (value: string) => {
    dispatch(setFullCurrencyDisplay(value === 'full'));
  };

  return (
    <Tabs
      value={isFullCurrencyDisplay ? 'full' : 'short'}
      onValueChange={handleValueChange}
      className={className}
    >
      <TabsList className="w-full grid grid-cols-2 rounded-lg bg-muted/30">
        <TabsTrigger value="full" className="flex items-center gap-1 px-2 py-1 text-xs">
          <Icons.eye size={16} className="text-primary" />
          1K | 1M | 1B
        </TabsTrigger>
        <TabsTrigger value="short" className="flex items-center gap-1 px-2 py-1 text-xs">
          <Icons.eyeOff size={16} className="text-muted-foreground" />K | M | B
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CurrencyDisplayToggle;
