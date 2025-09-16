'use client';
import DatePicker from '@/components/modern-ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Control } from 'react-hook-form';

export type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
};

type PersonalInfoFieldsProps = {
  control: Control<PersonalInfo>;
};

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ control }) => {
  return (
    <div className="mb-8">
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
          <FormLabel htmlFor="referralCode">Referral Code</FormLabel>
          <Input id="referralCode" />
          <p className="text-xs text-gray-500 my-2 flex items-center">
            <span className="text-yellow-400 mr-2" aria-hidden>
              <AlertCircle />
            </span>
            Enter your referral code to earn rewards and get exclusive benefits when you invite
            friends
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
