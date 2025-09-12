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

  // Normalize progress/value using min/max so callers can pass raw numbers
  // Prefer `value` when provided; otherwise fall back to `progress`
  const rawValue =
    typeof value === 'number' ? value : typeof progress === 'number' ? progress : undefined;

  let computedProgress = 0;
  if (typeof rawValue === 'number') {
    if (max !== min) {
      computedProgress = (rawValue - min) / (max - min);
    } else {
      computedProgress = 0;
    }
  }

  computedProgress = Math.max(0, Math.min(1, computedProgress));

  const hasNumericInput = typeof value === 'number' || typeof progress === 'number';
  const barWidth = hasNumericInput ? `${computedProgress * 100}%` : '0';

  return (
    <Card className={cn('w-full rounded-lg overflow-hidden', className)}>
      <div className="relative flex h-7 w-full">
        <div className="absolute left-2 top-1 font-medium">{leftLabel}</div>
        <div className={cn('h-full')} style={{ width: barWidth, backgroundColor: barColor }} />
        <div className="absolute right-2 top-1 dark:bg-gray-700 flex items-center justify-end pr-2 text-black dark:text-white text-sm font-medium">
          {rightLabel}
        </div>
      </div>
    </Card>
  );
}
