import * as Yup from 'yup';
export const createPackageSchema = Yup.object().shape({
  fxAmount: Yup.string()
    .required('Amount is required')
    .matches(/^[0-9.]+$/, 'Amount must be a valid number')
    .test('greater than zero', 'Amount must be greater than 0', (value) => {
      return value ? parseFloat(value) > 0 : false;
    }),
  attachmentFiles: Yup.array()
    .of(
      Yup.mixed<File>()
        .test('fileExists', 'File is required', (file) => !!file)
        .test('fileType', 'Unsupported file format. Only JPG/PNG allowed', (file) => {
          return file ? ['image/jpeg', 'image/png'].includes(file.type) : true;
        })
        .test('fileSize', 'File size must be less than 5MB', (file) => {
          return file ? file.size <= 5 * 1024 * 1024 : true;
        }),
    )
    .min(1, 'Please upload at least one attachment'),
});

export const updatePackageSchema = Yup.object().shape({
  fxAmount: Yup.string()
    .required('Amount is required')
    .matches(/^[0-9.]+$/, 'Amount must be a valid number')
    .test('greater than zero', 'Amount must be greater than 0', (value) => {
      return value ? parseFloat(value) > 0 : false;
    }),
  attachmentFiles: Yup.array()
    .of(
      Yup.mixed<File>()
        .test('fileExists', 'File is required', (file) => !!file)
        .test('fileType', 'Unsupported file format. Only JPG/PNG allowed', (file) => {
          return file ? ['image/jpeg', 'image/png'].includes(file.type) : true;
        })
        .test('fileSize', 'File size must be less than 5MB', (file) => {
          return file ? file.size <= 5 * 1024 * 1024 : true;
        }),
    )
    .min(1, 'Please upload at least one attachment'),
});
