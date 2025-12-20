'use client';

import { Loading } from '@/components/common/atoms';
import SendOtpButton from '@/components/common/atoms/SendOtpButton';
import { TextareaField } from '@/components/common/forms';
import InputOtp from '@/components/common/forms/input/InputOtp';
import { MetricCard } from '@/components/common/metric';
import { Card, CardContent } from '@/components/ui/card';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import ReceiverSelectField from '@/features/home/module/transaction/components/ReceiverSelectField';
import { OtpState } from '@/shared/types';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Controller } from 'react-hook-form';
import AmountSelect from '../../components/AmountSelect';

interface SendingFXFormContentProps {
  control: any;
  errors: any;
  currency: string;
  limit: any;
  categories: any[];
  products: any[];
  otpState: OtpState;
  countdown: number;
  isGlobalLoading: boolean;
  onGetOtp: () => void;
  getCurrentBalance: () => number;
}

export default function SendingFXFormContent({
  control,
  errors,
  currency,
  limit,
  categories,
  products,
  otpState,
  countdown,
  isGlobalLoading,
  onGetOtp,
  getCurrentBalance,
}: SendingFXFormContentProps) {
  return (
    <div className="relative">
      {isGlobalLoading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl">
          <Loading />
        </div>
      )}

      <Card className="w-full">
        <CardContent className="w-full pt-6 sm:space-y-6 space-y-4">
          {/* Metric Cards */}
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <MetricCard
              title="Daily Moving Limit"
              value={limit?.dailyMovingLimit || 0}
              type="neutral"
              icon="vault"
            />
            <MetricCard
              title="1-time Moving Limit"
              value={limit?.oneTimeMovingLimit || 0}
              type="total"
              icon="handCoins"
            />
            <MetricCard
              title="Moved Amount"
              value={limit?.movedAmount || 0}
              type="expense"
              icon="wallet"
            />
            <MetricCard
              title="Available Limit"
              value={limit?.availableLimit || 0}
              type="income"
              icon="arrowRight"
            />
          </div>

          <Separator />

          <div className="space-y-5">
            {/* Receiver + Amount */}
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Receiver <span className="text-red-700">*</span>
                </label>
                <Controller
                  name="receiver"
                  control={control}
                  render={({ field }) => (
                    <ReceiverSelectField
                      value={field.value}
                      onChange={field.onChange}
                      error={
                        errors.receiver
                          ? { type: errors.receiver.type, message: errors.receiver.message }
                          : undefined
                      }
                      placeholder="Search receiver by email"
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="amountInput"
                  control={control}
                  render={({ field }) => (
                    <AmountSelect
                      key="amount"
                      name="amount"
                      currency={currency}
                      label="Amount"
                      required
                      value={field.value}
                      initialPackages={limit?.packageFXs}
                      onChange={field.onChange}
                      error={
                        errors.amountInput
                          ? { type: errors.amountInput.type, message: errors.amountInput.message }
                          : undefined
                      }
                      max={getCurrentBalance()}
                    />
                  )}
                />
              </div>
            </div>

            {/* Category + Product */}
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category (Optional)
                </label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      name="category"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      categories={categories || []}
                    />
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Product (Optional)
                </label>
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <ProductSelectField
                      name="product"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      products={products || []}
                    />
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:grid flex gap-4 items-start">
              <div className="flex-1">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      label="Description (Optional)"
                      name="description"
                      placeholder="Add a description for the receiver..."
                      onChange={field.onChange}
                      value={field.value ?? ''}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>

            {/* OTP */}
            <div className="sm:grid sm:grid-cols-2 flex gap-4 items-start">
              <div className="flex-1">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOtp
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={
                        errors.otp
                          ? { type: errors.otp.type, message: errors.otp.message }
                          : undefined
                      }
                    />
                  )}
                />
              </div>

              <SendOtpButton
                classNameBtn="mt-[25px]"
                state={otpState}
                callback={onGetOtp}
                countdown={countdown}
                isStartCountdown={otpState !== 'Get'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
