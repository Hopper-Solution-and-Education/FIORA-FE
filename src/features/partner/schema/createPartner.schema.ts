// features/partner/schema/createPartner.schema.ts
import * as Yup from 'yup';

export const createPartnerSchema = Yup.object().shape({
  name: Yup.string().max(255, 'Name must not exceed 255 characters').required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .max(50, 'Email must not exceed 50 characters')
    .required('Email is required'),
  identify: Yup.string()
    .max(50, 'Identifier must not exceed 50 characters')
    .required('Identifier is required'),
  description: Yup.string().max(1000, 'Description must not exceed 1000 characters'),
  dob: Yup.date().required('Date of birth is required').typeError('Invalid date of birth'),
  logo: Yup.mixed().required('Logo is required'),
  taxNo: Yup.string().max(20, 'Tax number must not exceed 20 characters'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .max(50, 'Phone number must not exceed 50 characters'),
  address: Yup.string().max(255, 'Address must not exceed 255 characters'),
  parentId: Yup.string().uuid().optional(),
});

export type CreatePartnerFormData = Yup.InferType<typeof createPartnerSchema>;
