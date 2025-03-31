import { TransactionType } from '@prisma/client';
import * as yup from 'yup';
import { TransactionCurrency } from './constants';

const validateNewTransactionSchema = yup.object({
  type: yup.mixed<TransactionType>().oneOf(Object.values(TransactionType)).required(),
  date: yup.date().required(),
  amount: yup.number().required(),
  currency: yup.mixed<TransactionCurrency>().oneOf(Object.values(TransactionCurrency)).required(),
  products: yup.array().of(yup.string()),
  fromAccountId: yup.string().nullable(),
  toAccountId: yup.string().nullable(),
  fromCategoryId: yup.string().nullable(),
  toCategoryId: yup.string().nullable(),
  partnerId: yup.string().nullable(),
  remark: yup.string().nullable(),
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
  partnerId: undefined,
  remark: '',
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = yup.InferType<typeof validateNewTransactionSchema>;
