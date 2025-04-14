'use client';

import * as React from 'react';
import { Progress } from '../../ui/progress';

interface LoadingProgressProps {
  progress?: number; // Giá trị progress (mặc định 0)
  duration?: number; // Thời gian cập nhật progress (mặc định 500ms)
}

export function LoadingProgress({ progress = 0, duration = 500 }: LoadingProgressProps) {
  const [currentProgress, setCurrentProgress] = React.useState(progress);

  React.useEffect(() => {
    const timer = setTimeout(() => setCurrentProgress(66), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-2 w-[60%]">
        <Progress
          value={currentProgress}
          className="h-2 w-full bg-gray-200 rounded-lg overflow-hidden"
        >
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${currentProgress}%` }}
          />
        </Progress>
        <p className="text-sm text-muted-foreground">{currentProgress}%</p>
      </div>
    </div>
  );
}
