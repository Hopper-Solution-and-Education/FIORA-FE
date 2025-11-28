'use client';

import { Button } from '@/components/ui/button';
import { OtpState } from '@/shared/types/otp';
import { cn } from '@/shared/utils';
import { useEffect, useRef, useState } from 'react';

type ChildProps = {
  state?: OtpState;
  countdown?: number;
  isStartCountdown?: boolean;
  callback: () => void;
  classNameBtn?: string;
  classNameText?: string;
};

function SendOtpButton({
  state = 'Get',
  countdown = 120,
  callback,
  classNameBtn,
  classNameText,
  isStartCountdown = false,
}: ChildProps) {
  const [count, setCount] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start countdown
  const startCountdown = () => {
    setCount(countdown);

    // Clear old interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Auto-start if prop is true
  useEffect(() => {
    if (isStartCountdown && count === 0) {
      startCountdown();
    }
  }, [isStartCountdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleButtonClick = () => {
    callback();
    if (isStartCountdown && count === 0) startCountdown();
  };

  return (
    <div className={classNameBtn}>
      {count === 0 ? (
        <Button variant="outline" onClick={handleButtonClick}>
          {state} OTP
        </Button>
      ) : (
        <div
          className={cn(
            'h-9 flex items-center',
            classNameText,
            count <= 5 && 'text-red-600 dark:text-red-400',
          )}
        >
          {state} in {count}s
        </div>
      )}
    </div>
  );
}

export default SendOtpButton;
