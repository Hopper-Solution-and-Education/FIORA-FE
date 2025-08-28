import * as Yup from 'yup';

export const personalInfoSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string()
    .optional()
    .matches(/^$|^[0-9+().\-\s]{8,20}$/i, 'Enter a valid phone number'),
  birthday: Yup.string().optional(),
  address: Yup.string().max(255, 'Address too long').optional(),
});

export type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
};
