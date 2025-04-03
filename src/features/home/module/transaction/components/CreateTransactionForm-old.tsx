'use client';

import { DateTimePicker } from '@/components/common/atoms/DateTimePicker';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropdownOption } from '../types';
import {
  MOCK_ACCOUNTS,
  MOCK_CATEORIES,
  MOCK_PRODUCTS,
  TransactionCurrency,
  TransactionRecurringType,
} from '../utils/constants';
import {
  defaultNewTransactionValues,
  NewTransactionDefaultValues,
  validateNewTransactionSchema,
} from '../utils/schema';
import { formatCurrency } from '../hooks/formatCurrency';

const CreateTransactionForm = () => {
  const [recurringType, setRecurringType] = useState<TransactionRecurringType>(
    TransactionRecurringType.NONE,
  );
  const [recurringDate, setRecurringDate] = useState<unknown>();

  const form = useForm<NewTransactionDefaultValues>({
    resolver: yupResolver(validateNewTransactionSchema),
    defaultValues: defaultNewTransactionValues,
    mode: 'onChange',
  });

  const handleCreateTransaction = async () => {
    // Create transaction
  };

  const productsText = useMemo((): string | undefined => {
    return form.getValues('products') && typeof form.getValues('products') === 'function'
      ? form
          .getValues('products')
          ?.map((obj) => {
            if (obj) {
              return obj.toString();
            }
          })
          .join(', ')
      : undefined;
  }, [form]);

  return (
    <Form {...form}>
      {/* Dialog content */}
      <form onSubmit={form.handleSubmit(handleCreateTransaction)}>
        {/* Date Select */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker
                  modal={false}
                  value={field.value}
                  onChange={field.onChange}
                  clearable
                  hideTime // Chỉ hiển thị ngày
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Type Select */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Type <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  name="Select type"
                  value={field.value}
                  required
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Expense', 'Income', 'Transfer'].map((typeOption) => (
                      <SelectItem key={typeOption} value={typeOption.toString()}>
                        {typeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col justify-start items-end py-2">
              <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
                <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                  Amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    // disabled={isRegistering} // Disable during register period
                    value={formatCurrency(
                      field.value,
                      form.getValues('currency') as TransactionCurrency,
                    )}
                    min={0}
                    placeholder="0"
                    onChange={field.onChange}
                    required
                    className={cn('w-full')}
                  />
                </FormControl>
              </div>
              <div className="w-[80%] flex flex-col justify-between items-start overflow-y-hidden overflow-x-scroll">
                {/* Increate button group */}
                {field.value && field.value > 0 && (
                  <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
                    <Button
                      variant={'secondary'}
                      className="w-full h-full"
                      onClick={() => form.setValue('amount', field.value * 10)}
                    >
                      {field.value * 10}
                    </Button>
                    <Button
                      variant={'secondary'}
                      className="w-full h-full"
                      onClick={() => form.setValue('amount', field.value * 100)}
                    >
                      {field.value * 100}
                    </Button>
                    <Button
                      variant={'secondary'}
                      className="w-full h-full"
                      onClick={() => form.setValue('amount', field.value * 1000)}
                    >
                      {field.value * 1000}
                    </Button>
                    <Button
                      variant={'secondary'}
                      className="w-full h-full"
                      onClick={() => form.setValue('amount', field.value * 10000)}
                    >
                      {field.value * 10000}
                    </Button>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Currency Select */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Currency <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  name="Select currency"
                  value={field.value}
                  required
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TransactionCurrency).map((key: string) => (
                      <SelectItem key={key} value={key.toString()}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* From Select */}
        <FormField
          control={form.control}
          name={form.getValues('type') === 'Income' ? 'fromCategoryId' : 'fromAccountId'}
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                From <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  name={`Select ${form.getValues('type') === 'Income' ? 'Category' : 'Account'}`}
                  value={field.value ?? ''}
                  required
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue
                      placeholder={`Select ${form.getValues('type') === 'Income' ? 'Category' : 'Account'}`}
                    />
                  </SelectTrigger>
                  {form.getValues('type') === 'Income' ? (
                    <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                      {MOCK_CATEORIES.map((option: DropdownOption, index: number) => (
                        <SelectItem key={index} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  ) : (
                    <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                      {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                        <SelectItem key={index} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* To Select */}
        <FormField
          control={form.control}
          name={form.getValues('type') === 'Expense' ? 'toCategoryId' : 'toAccountId'}
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                To <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  name={`Select ${form.getValues('type') === 'Expense' ? 'Category' : 'Account'}`}
                  value={field.value ?? ''}
                  required
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue
                      placeholder={`Select ${form.getValues('type') === 'Expense' ? 'Category' : 'Account'}`}
                    />
                  </SelectTrigger>
                  {form.getValues('type') === 'Expense' ? (
                    <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                      {MOCK_CATEORIES.map((option: DropdownOption, index: number) => (
                        <SelectItem key={index} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  ) : (
                    <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                      {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                        <SelectItem key={index} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Products Select */}
        <FormField
          control={form.control}
          name="products"
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Products
              </FormLabel>
              <FormControl>
                <Select name="Select products" value={productsText} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select products" />
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                    {MOCK_PRODUCTS.map((option: DropdownOption, index: number) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Partner Select */}
        <FormField
          control={form.control}
          name="partnerId"
          render={({ field }) => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Partner
              </FormLabel>
              <FormControl>
                <Select
                  name="Select partner"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TransactionCurrency).map((key: string) => (
                      <SelectItem key={key} value={key.toString()}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Recurring Select */}
        <FormField
          control={form.control}
          name="remark"
          render={() => (
            <FormItem className="w-full h-fit flex flex-row justify-start items-center sm:items-center gap-4">
              <div className="w-fit h-fit flex flex-col sm:flex-row items-center">
                <FormLabel className="w-[32%] text-left sm:text-right text-sm text-gray-700 dark:text-gray-300">
                  Recurring
                </FormLabel>
                <Select
                  name="Type"
                  value={recurringType}
                  onValueChange={(value) => setRecurringType(value as TransactionRecurringType)}
                >
                  <SelectTrigger className="w-[30%] px-4 py-3">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TransactionRecurringType).map((values: string) => (
                      <SelectItem key={values} value={values}>
                        {values}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-fit h-fit flex flex-col sm:flex-row items-center">
                <FormLabel className="w-[10%] text-right text-sm text-gray-700 dark:text-gray-300">
                  At
                </FormLabel>
                <DateTimePicker
                  modal={false}
                  value={recurringDate as Date}
                  onChange={(date) => setRecurringDate(date)}
                  clearable
                  hideTime // Chỉ hiển thị ngày
                />
              </div>
            </FormItem>
          )}
        />

        {/* Recurring Action Select */}
        {recurringType !== TransactionRecurringType.NONE && (
          <FormField
            control={form.control}
            name="date"
            render={() => (
              <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                  Copy and
                </FormLabel>
                <FormControl>
                  <RadioGroup defaultValue="do-nothing" className="w-full flex gap-10">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="do-nothing" id="do-nothing" />
                      <Label htmlFor="do-nothing">Do nothing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="copy" id="copy" />
                      <Label htmlFor="copy">Copy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">New</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
      <div className="w-full flex justify-end px-5">
        <Button className="bg-green-100 hover:bg-green-200 text-green-800 min-w-fit px-5">
          Create
        </Button>
      </div>{' '}
    </Form>
    // </Form=>
  );
};

export default CreateTransactionForm;
