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
import { ArrowLeft, Check, Eye, EyeIcon as EyeClosed } from 'lucide-react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';

interface ResetPasswordFormProps {
  resetPasswordForm: UseFormReturn<
    {
      newPassword: string;
      confirmPassword: string;
    },
    any
  >;
  handleResetPasswordSubmit: (data: { newPassword: string; confirmPassword: string }) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const ResetPasswordForm = ({
  resetPasswordForm,
  handleResetPasswordSubmit,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: ResetPasswordFormProps) => {
  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)}
        className="w-full space-y-6"
      >
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-md space-y-4">
            <FormField
              control={resetPasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <FormLabel
                    className="text-sm text-foreground text-left sm:text-right whitespace-nowrap"
                    htmlFor="new-password"
                  >
                    New Password
                  </FormLabel>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="********"
                        className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none pr-10"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeClosed className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        (field.value ?? '') && (
                          <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )
                      )}
                    </button>
                  </div>
                  <div className="xs:hidden md:block"></div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <FormLabel
                    className="text-sm text-foreground text-left sm:text-right whitespace-nowrap"
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </FormLabel>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="********"
                        className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none pr-10"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeClosed className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        (field.value ?? '') && (
                          <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )
                      )}
                    </button>
                  </div>
                  <div className="xs:hidden md:block"></div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 w-full mt-8">
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
            disabled={!resetPasswordForm.formState.isValid}
            className={`group text-base sm:text-lg font-semibold w-32 sm:w-44 py-5 sm:py-6 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-200 ${!resetPasswordForm.formState.isValid && 'cursor-not-allowed'}`}
          >
            <Check className="block text-green-300 stroke-[4] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 h-6 w-6 sm:!h-[28px] sm:!w-[28px]" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
