import { TransactionType } from '@prisma/client';
import * as yup from 'yup';
import { TransactionCurrency } from './constants';

const validateNewTransactionSchema = yup.object({
  type: yup.mixed<TransactionType>().oneOf(Object.values(TransactionType)).required(),
  date: yup.date().required(),
  amount: yup.number().min(1, 'Amount of money must be a positive number!').required(),
  currency: yup.mixed<TransactionCurrency>().oneOf(Object.values(TransactionCurrency)).required(),
  product: yup.string().nullable(),
  fromId: yup.string().required(),
  toId: yup.string().required(),
  partner: yup.string().nullable(),
  remark: yup.string().required('Description is required'),
});

const defaultNewTransactionValues: NewTransactionDefaultValues = {
  type: TransactionType.Expense,
  date: new Date(),
  amount: 0,
  currency: TransactionCurrency.VND,
  product: '',
  fromId: '', // From account or category ID
  toId: '', // To account or category ID
  partner: undefined,
  remark: '',
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = yup.InferType<typeof validateNewTransactionSchema>;
