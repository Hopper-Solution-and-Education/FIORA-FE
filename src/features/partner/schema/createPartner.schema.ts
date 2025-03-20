import * as Yup from 'yup';

// Define the validation schema with Yup
export const createPartnerSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  identify: Yup.string().required('Identifier is required'),
  description: Yup.string().required('Description is required'),
  dob: Yup.date().required('Date of birth is required').typeError('Invalid date of birth'),
  logo: Yup.string()
    //   .url('Logo must be a valid URL')
    .required('Logo is required'),
  taxNo: Yup.string().required('Tax number is required'),
  phone: Yup.string()
    // .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
});
