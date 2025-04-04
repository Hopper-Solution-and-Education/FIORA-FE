'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import type React from 'react';

interface EmailOtpFormProps {
  emailOtpForm: UseFormReturn<
    {
      email: string;
      otp: string;
    },
    any
  >;
  handleOtpSubmit: (data: { email: string; otp: string }) => void;
  onSubmitForgotPassword: any;
  isOtpSent: boolean;
  countdown: number | null;
}

const EmailOtpForm = ({
  emailOtpForm,
  handleOtpSubmit,
  onSubmitForgotPassword,
  isOtpSent,
  countdown,
}: EmailOtpFormProps) => {
  return (
    <Form {...emailOtpForm}>
      <form
        onSubmit={emailOtpForm.handleSubmit(handleOtpSubmit)}
        className="w-full space-y-4 max-w-2xl"
      >
        <FormField
          control={emailOtpForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <FormLabel className="text-sm text-foreground w-full md:w-[15%] text-left md:text-right">
                  Email
                </FormLabel>
                <div className="w-full md:w-4/6">
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@flora.live"
                      className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none"
                      disabled={isOtpSent}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <div className="w-full flex justify-end md:hidden mt-2">
                    {countdown === null || countdown <= 0 ? (
                      !isOtpSent && (
                        <span
                          onClick={onSubmitForgotPassword}
                          className="text-sm font-semibold text-blue-500 transition-all duration-200 underline underline-offset-4 cursor-pointer whitespace-nowrap"
                        >
                          Get OTP
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Resend in {countdown}s
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-1/6 hidden md:flex md:items-center">
                  {countdown === null || countdown <= 0 ? (
                    !isOtpSent && (
                      <span
                        onClick={(e) => onSubmitForgotPassword(e)}
                        className="text-sm font-semibold text-blue-500 transition-all duration-200 underline underline-offset-4 cursor-pointer whitespace-nowrap"
                      >
                        Get OTP
                      </span>
                    )
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      Resend in {countdown}s
                    </span>
                  )}
                </div>
              </div>
              <FormMessage className="w-full text-left md:pl-[calc(15%+1rem)]" />
            </FormItem>
          )}
        />

        <FormField
          control={emailOtpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <FormLabel className="text-sm text-foreground w-full md:w-[15%] text-left md:text-right">
                  OTP
                </FormLabel>
                <div className="w-full md:w-4/6">
                  <FormControl>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="******"
                      className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none"
                      maxLength={6}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </div>
                <div className="w-1/6 hidden md:block" /> {/* Empty column to match email row */}
              </div>
              <FormMessage className="w-full text-left md:pl-[calc(15%+1rem)]" />
            </FormItem>
          )}
        />

        <div className="flex justify-center gap-4 w-full mt-7">
          <Link href="/auth/sign-in">
            <Button
              type="button"
              className="text-base sm:text-lg font-semibold w-32 sm:w-44 py-5 sm:py-6 bg-gray-500 text-white hover:bg-gray-600 flex items-center justify-center transition-all duration-200"
            >
              <ArrowLeft className="h-5 sm:h-6 w-5 sm:w-6 mr-2 stroke-[4]" />
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!emailOtpForm.formState.isValid}
            className={`group text-base sm:text-lg font-semibold w-32 sm:w-44 py-5 sm:py-6 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-200 ${!emailOtpForm.formState.isValid && 'cursor-not-allowed'}`}
          >
            <Check className="block text-green-300 stroke-[4] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 h-6 w-6 sm:!h-[28px] sm:!w-[28px]" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmailOtpForm;
