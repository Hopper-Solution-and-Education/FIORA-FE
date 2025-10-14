import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { OtpState } from '../../types';

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
    let timer: NodeJS.Timeout;

    if (count > 0) {
      timer = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [count]);

  const handleButtonClick = () => {
    callback();

    if (isStartCountdown) setCount(countdown);
  };

  useEffect(() => {
    if (isStartCountdown) setCount(countdown);
  }, [isStartCountdown]);

  return (
    <div className={classNameBtn}>
      {count === 0 ? (
        <Button variant="outline" onClick={handleButtonClick}>
          {state} OTP
        </Button>
      ) : (
        <div
          className={`h-9 flex items-center ${classNameText} ${count <= 5 && 'text-red-600 dark:text-red-400'}`}
        >
          {state} in {count}s
        </div>
      )}
    </div>
  );
}

export default SendOtpButton;
