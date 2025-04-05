import { TransactionType } from '@prisma/client';
import * as yup from 'yup';
import { TransactionCurrency, TransactionRecurringType } from './constants';

const validateNewTransactionSchema = yup.object({
  type: yup.mixed<TransactionType>().oneOf(Object.values(TransactionType)).required(),
  date: yup.date().required(),
  amount: yup.number().min(0, 'Amount of money must be a positive number!').required(),
  currency: yup.mixed<TransactionCurrency>().oneOf(Object.values(TransactionCurrency)).required(),
  products: yup.array().of(yup.string()),
  fromAccountId: yup.string().nullable(),
  fromCategoryId: yup.string().nullable(),
  toAccountId: yup.string().nullable(),
  toCategoryId: yup.string().nullable(),
  partner: yup.string().nullable(),
  remark: yup
    .mixed<TransactionRecurringType>()
    .oneOf(Object.values(TransactionRecurringType))
    .nullable(),
});

const defaultNewTransactionValues: NewTransactionDefaultValues = {
  type: TransactionType.Expense,
  date: new Date(),
  amount: 1,
  currency: TransactionCurrency.VND,
  products: [],
  fromAccountId: undefined,
  toAccountId: undefined,
  fromCategoryId: undefined,
  toCategoryId: undefined,
  partner: undefined,
  remark: TransactionRecurringType.NONE,
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = yup.InferType<typeof validateNewTransactionSchema>;
