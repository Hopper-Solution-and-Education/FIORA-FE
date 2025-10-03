import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { OtpState } from '../../types';

type ChildProps = {
  state?: OtpState;
  countdown?: number;
  callback: () => void;
};

function SendOtpButton({ state = 'Get', countdown = 120, callback }: ChildProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (count > 0) {
      timer = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  });

  const handleButtonClick = () => {
    callback();
    setCount(countdown);
  };

  return (
    <div>
      {count === 0 ? (
        <Button variant="outline" onClick={handleButtonClick}>
          {state} OTP
        </Button>
      ) : (
        <div className="h-9 flex items-center">
          {state} in {count}s
        </div>
      )}
    </div>
  );
}

export default SendOtpButton;
