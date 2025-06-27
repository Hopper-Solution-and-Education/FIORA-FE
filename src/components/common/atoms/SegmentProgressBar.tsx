import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SegmentProps = {
  leftLabel: string;
  rightLabel: string;
  value?: number;
  min?: number;
  max?: number;
  progress?: number;
  color: string;
  className?: string;
};

export default function SegmentProgressBar({
  leftLabel,
  rightLabel,
  value,
  min = 0,
  max = 1,
  progress,
  color,
  className,
}: SegmentProps) {
  const barColor = color || 'bg-gray-400';

  let computedProgress = 0;
  if (typeof value === 'number') {
    if (max === min) {
      computedProgress = 0;
    } else {
      computedProgress = (value - min) / (max - min);
    }
  } else if (typeof progress === 'number') {
    computedProgress = progress;
  }

  computedProgress = Math.max(0, Math.min(1, computedProgress));

  return (
    <Card className={cn('w-full rounded-sm overflow-hidden', className)}>
      <div className="relative flex h-6 w-full">
        <div
          className={cn(
            'flex items-center justify-start pl-2 text-black dark:text-white text-sm font-medium',
          )}
          style={{ width: `${computedProgress * 100}%`, backgroundColor: barColor }}
        >
          {leftLabel}
        </div>
        <div className="flex-1 bg-gray-300 dark:bg-gray-700 flex items-center justify-end pr-2 text-black dark:text-white text-sm">
          {rightLabel}
        </div>
      </div>
    </Card>
  );
}
