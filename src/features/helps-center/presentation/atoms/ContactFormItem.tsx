'use client';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FloatingLabelInput } from './FloatingLabelInput';

interface ContactFormItemProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactFormItem = <T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  maxLength,
  className = 'mb-2',
  onChange,
}: ContactFormItemProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <FloatingLabelInput
              label={label}
              {...field}
              value={field.value ?? ''}
              required={required}
              maxLength={maxLength}
              onChange={onChange || field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ContactFormItem;
