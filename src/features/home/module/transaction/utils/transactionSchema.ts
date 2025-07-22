import { TransactionType } from '@prisma/client';
import { z } from 'zod';
import { TransactionRecurringType } from './constants';

const validateNewTransactionSchema = z.object({
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Please select a valid transaction type' }),
  }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Please provide a valid date',
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than 0'),
  currency: z
    .string({
      required_error: 'Currency is required',
      invalid_type_error: 'Currency must be a string',
    })
    .min(1, 'Please select a currency')
    .refine((value) => value !== 'none' && value.length > 0, 'Please select a valid currency'),
  product: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  fromId: z
    .string({
      required_error: 'From account/category is required',
    })
    .min(1, 'Please select a from account or category'),
  toId: z
    .string({
      required_error: 'To account/category is required',
    })
    .min(1, 'Please select a to account or category'),
  partnerId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  remark: z
    .nativeEnum(TransactionRecurringType, {
      errorMap: () => ({ message: 'Please select a valid recurring type' }),
    })
    .optional()
    .nullable()
    .default(TransactionRecurringType.NONE),
});

const defaultNewTransactionValues: NewTransactionDefaultValues = {
  type: TransactionType.Expense,
  date: new Date(),
  amount: 0,
  currency: '',
  product: null,
  fromId: '', // From account or category ID
  toId: '', // To account or category ID
  partnerId: null,
  remark: TransactionRecurringType.NONE,
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = z.infer<typeof validateNewTransactionSchema>;
