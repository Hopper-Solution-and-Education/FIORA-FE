'use client';

import { LoadingIndicator } from '@/components/common/atoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/shared/utils';
import { Check, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import GoogleIcon from '../components/GoogleIcon';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const {
    rememberMe,
    toggleRememberMe,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    form,
    isLoading,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const { isValid, isSubmitting } = form.formState;

  return (
    <div className={cn('flex flex-col items-center gap-6', className)} {...props}>
      <Card className="w-full overflow-hidden border-0 shadow-none">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-black dark:text-white">SIGN IN</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCredentialsSignIn)}
                className="w-full space-y-4 flex flex-col items-center"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <FormLabel className="text-sm text-foreground w-full sm:w-1/4 text-left sm:text-right pr-0 sm:pr-4 whitespace-nowrap mb-2 sm:mb-0">
                          Email
                        </FormLabel>
                        <div className="flex-1 w-full sm:max-w-[75%] sm:mx-auto">
                          <FormControl className="w-full">
                            <Input
                              id="email"
                              type="email"
                              placeholder="user@flora.live"
                              className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <div className="hidden sm:block sm:w-1/4"></div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <div className="w-1/4"></div>
                        <div className="flex-1 w-full sm:max-w-[75%] sm:mx-auto">
                          <FormMessage />
                        </div>
                        <div className="hidden sm:block sm:w-1/4"></div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <FormLabel className="text-sm text-foreground w-full sm:w-1/4 text-left sm:text-right pr-0 sm:pr-4 whitespace-nowrap mb-2 sm:mb-0">
                          Password
                        </FormLabel>
                        <div className="relative flex-1 w-full sm:max-w-[75%] sm:mx-auto">
                          <FormControl>
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="********"
                              className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none pr-10"
                              {...field}
                            />
                          </FormControl>
                          {field.value && (
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="hidden sm:block sm:w-1/4"></div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <div className="w-1/4"></div>
                        <div className="flex-1 w-full sm:max-w-[75%] sm:mx-auto">
                          <FormMessage />
                        </div>
                        <div className="hidden sm:block sm:w-1/4"></div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                  <div className="hidden sm:block sm:w-1/4"></div>
                  <div className="flex-1 w-full sm:max-w-[75%] sm:mx-auto flex items-center gap-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={toggleRememberMe}
                      className="h-4 w-4 cursor-pointer rounded border border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm text-foreground/80 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleRememberMe();
                      }}
                    >
                      Remember me
                    </Label>
                  </div>
                  <div className="hidden sm:block sm:w-1/4"></div>
                </div>

                <div className="flex justify-center w-full mt-7">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="group text-lg font-semibold w-44 py-6 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isLoading || isSubmitting ? (
                      <LoadingIndicator className="w-4 h-4" color="white" />
                    ) : (
                      <Check className="block text-green-300 stroke-[4] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 !h-[28px] !w-[28px]" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <div className="mb-2 sm:mb-0 sm:inline">
                Cannot sign in?{' '}
                <Link
                  href="/auth/sign-in/forgot-password"
                  className="text-blue-500 hover:underline sm:mr-3 font-medium underline underline-offset-4"
                >
                  Forgot password
                </Link>
              </div>{' '}
              <div className="sm:inline">
                Do not have an account?{' '}
                <Link
                  href="/auth/sign-up"
                  className="text-blue-500 hover:underline font-medium underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <Separator orientation="horizontal" className="border-foreground border-1" />

            <div className="relative flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="relative z-10 px-1">Or Sign in with</span>
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-8 h-8 cursor-pointer"
              >
                <GoogleIcon />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
