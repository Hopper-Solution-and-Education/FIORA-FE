import * as React from 'react';

import { FormLabel, useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasIssue?: boolean;
};

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasIssue, ...props }, ref) => {
    const { error } = useFormField();

    return (
      <Input
        placeholder=" "
        className={cn(
          'peer h-14',
          error && 'border-destructive',
          hasIssue && !error && 'border-yellow-400 bg-yellow-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof FormLabel>,
  React.ComponentPropsWithoutRef<typeof FormLabel> & { hasIssue?: boolean }
>(({ className, hasIssue, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <FormLabel
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-base text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text',
        className,
        error && 'text-destructive',
        hasIssue && !error && 'text-yellow-600',
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & {
  label?: string;
  hasIssue?: boolean;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, hasIssue, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} hasIssue={hasIssue} {...props} />
      <FloatingLabel htmlFor={id} hasIssue={hasIssue}>
        {label} {props.required && <span className="text-red-500">*</span>}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };
