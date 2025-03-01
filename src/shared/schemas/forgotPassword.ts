import * as Yup from 'yup';

export const resetPasswordSchema = (newPassword: string, confirmPassword: string) => {
  const schema = Yup.object().shape({
    newPassword: Yup.string().required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
  });
  return schema;
};
