'use client';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/ui/modern-date-picker';
import { CheckCircle } from 'lucide-react';
import { Control } from 'react-hook-form';

export type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
  referrer_code?: string;
};

type PersonalInfoFieldsProps = {
  control: Control<PersonalInfo>;
  hasReferrerCode?: boolean;
  props?: any;
};

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  control,
  hasReferrerCode = false,
  ...props
}) => {
  return (
    <div className="mb-8" {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input id="name" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="birthday">Birthday</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  setDate={(date) => field.onChange(date?.toISOString())}
                  placeholder="Pick a date"
                  className="!w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" disabled {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <FormControl>
                <Input id="phone" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1 md:col-span-2">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="address">Contact address</FormLabel>
                <FormControl>
                  <Input id="address" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <FormField
            control={control}
            name="referrer_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="referrer_code">Referral Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="referrer_code"
                      {...field}
                      value={field.value ?? ''}
                      disabled={hasReferrerCode}
                      placeholder={hasReferrerCode ? 'Already applied' : 'Enter referral code'}
                      className={hasReferrerCode ? 'bg-gray-50' : ''}
                    />
                    {hasReferrerCode && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500 mt-2 flex items-start gap-2">
                  <span>
                    {hasReferrerCode
                      ? ''
                      : 'Enter your referral code to earn rewards and get exclusive benefits when you invite friends'}
                  </span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
