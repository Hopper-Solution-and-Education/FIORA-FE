import { TransactionType } from '@prisma/client';
import * as yup from 'yup';
import { TransactionCurrency, TransactionRecurringType } from './constants';

const validateNewTransactionSchema = yup.object({
  type: yup.mixed<TransactionType>().oneOf(Object.values(TransactionType)).required(),
  date: yup.date().required(),
  amount: yup.number().min(0, 'Amount of money must be a positive number!').required(),
  currency: yup.mixed<TransactionCurrency>().oneOf(Object.values(TransactionCurrency)).required(),
  product: yup.string().nullable(),
  fromId: yup.string().required(),
  toId: yup.string().required(),
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
  product: '',
  fromId: '', // From account or category ID
  toId: '', // To account or category ID
  partner: undefined,
  remark: TransactionRecurringType.NONE,
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = yup.InferType<typeof validateNewTransactionSchema>;
