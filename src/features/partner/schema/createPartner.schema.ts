import * as Yup from 'yup';

export const createPartnerSchema = Yup.object().shape({
  name: Yup.string().max(255, 'Name must not exceed 255 characters').required('Name is required'), // ✅ Bắt buộc trong Prisma

  email: Yup.string()
    .email('Invalid email')
    .max(50, 'Email must not exceed 50 characters')
    .nullable(),

  identify: Yup.string().max(50, 'Identifier must not exceed 50 characters').nullable(),

  description: Yup.string().max(1000, 'Description must not exceed 1000 characters').nullable(),

  dob: Yup.date().typeError('Invalid date of birth').nullable(),

  logo: Yup.mixed().nullable(),

  taxNo: Yup.string().max(20, 'Tax number must not exceed 20 characters').nullable(),

  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .max(50, 'Phone number must not exceed 50 characters')
    .nullable(),

  address: Yup.string().max(255, 'Address must not exceed 255 characters').nullable(),

  parentId: Yup.string().uuid().optional(),
});

export type CreatePartnerFormData = Yup.InferType<typeof createPartnerSchema>;
