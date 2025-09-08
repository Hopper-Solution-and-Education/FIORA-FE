'use client';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFullCurrencyDisplay } from '@/store/slices/setting.slice';

interface CurrencyDisplayToggleProps {
  className?: string;
}

const CurrencyDisplayToggle = ({ className }: CurrencyDisplayToggleProps) => {
  const dispatch = useAppDispatch();
  const { isFullCurrencyDisplay } = useAppSelector((state) => state.settings);
  const handleValueChange = () => {
    dispatch(setFullCurrencyDisplay(!isFullCurrencyDisplay));
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleValueChange}
        className="flex items-center gap-2 px-3 py-1.5 h-auto bg-transparent hover:bg-muted/50 transition-colors"
      >
        {isFullCurrencyDisplay ? (
          <>
            <Icons.eye size={14} className="text-primary" />
            <span className="text-xs font-medium">Show Full (1,000)</span>
          </>
        ) : (
          <>
            <Icons.eyeOff size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium">Show Short (1K)</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default CurrencyDisplayToggle;
