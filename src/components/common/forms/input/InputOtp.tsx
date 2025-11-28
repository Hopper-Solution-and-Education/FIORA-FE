import { GlobalLabel } from '@/components/common/atoms';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { uniqueId } from 'lodash';
import { useEffect, useRef } from 'react';
import { FieldError } from 'react-hook-form';

const id = uniqueId();

type ChildProps = {
  value: string;
  error?: FieldError | null;
  className?: string;
  onChange: (value: string) => void;
};

function InputOtp({ value, error = null, className, onChange }: ChildProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (error && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);
  };

  return (
    <div>
      <GlobalLabel text="OTP" htmlFor={id} required />
      <div>
        <Input
          ref={inputRef}
          value={value ? value : ''}
          placeholder="Please input OTP!"
          id={id}
          name="input-otp"
          className={cn(
            error ? 'border-red-500 focus-visible:ring-0' : 'focus-visible:ring-1',
            className,
          )}
          onChange={handleInputChange}
          aria-label="OTP verification code"
          type="text"
          maxLength={6}
        />
        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  );
}

export default InputOtp;
