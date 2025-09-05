import * as yup from 'yup';

export const contactUsSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  title: yup.string().required('Title is required'),
  message: yup.string().required('Message is required'),
});
