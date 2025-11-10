'use client';

import { Button } from '@/components/ui/button';
import { OtpState } from '@/shared/types/otp';
import { cn } from '@/shared/utils';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (count <= 0) return;
    const timer = setInterval(() => {
      setCount((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  const handleButtonClick = () => {
    callback();
    if (isStartCountdown && count === 0) setCount(countdown);
  };

  useEffect(() => {
    if (isStartCountdown && count === 0) setCount(countdown);
  }, [isStartCountdown, count, countdown]);

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
