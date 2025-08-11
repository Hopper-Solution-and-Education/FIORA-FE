'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { ContactUsRequest } from '../../domain/entities/models/faqs';
import { usePhoneFormatter } from '../../hooks/usePhoneFormatter';
import { useContactUsMutation } from '../../store/api/helpsCenterApi';
import { FloatingLabelInput } from '../atoms/FloatingLabelInput';
import FileUpload from '../molecules/FileUpload';

const contactUsSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  title: yup.string().required('Title is required'),
  message: yup.string().required('Message is required'),
});

const ContactUsForm = ({
  setOpenConfirmExitDialog,
}: {
  setOpenConfirmExitDialog: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [contactUsMutation] = useContactUsMutation();

  const { formatPhoneNumber } = usePhoneFormatter();

  const defaultValues = {
    name: '',
    email: '',
    title: '',
    phoneNumber: '',
    message: '',
    attachments: [],
  };

  // Setup form with react-hook-form directly (similar to GlobalForm's approach)
  const form = useForm<ContactUsRequest>({
    resolver: yupResolver(contactUsSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  // Track form dirty state
  useEffect(() => {
    if (isDirty !== isFormDirty) {
      setIsFormDirty(isDirty);
    }
  }, [isDirty, isFormDirty]);

  const onSubmit = async (values: ContactUsRequest) => {
    const formattedPhone = values.phoneNumber?.replace(/\D/g, '') || '';

    const submitData: ContactUsRequest = {
      name: values.name,
      email: values.email,
      phoneNumber: formattedPhone,
      title: values.title,
      message: values.message,
      attachments: values.attachments,
    };

    await contactUsMutation(submitData);
    setIsFormDirty(false);
    toast.success('Request sent successfully');
    form.reset();
    setOpenConfirmExitDialog(false);
  };

  // Warn on hard reload/tab close with native prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  // Intercept F5 / Ctrl+R to show custom confirm dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFormDirty) return;
      const isReload = e.key === 'F5' || (e.key.toLowerCase() === 'r' && (e.ctrlKey || e.metaKey));
      if (!isReload) return;
      e.preventDefault();
      setOpenConfirmExitDialog(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormDirty]);

  return (
    <>
      <Card className={`my-5 max-w-4xl mx-auto shadow-sm `}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FloatingLabelInput
                      label="Name"
                      {...field}
                      value={field.value ?? ''}
                      required
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormControl>
                        <FloatingLabelInput
                          label="Email"
                          {...field}
                          value={field.value ?? ''}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem className="mb-2">
                      <FormControl>
                        <FloatingLabelInput
                          label="Phone Number"
                          {...field}
                          value={field.value ?? ''}
                          required
                          onChange={(e) => {
                            const formattedValue = formatPhoneNumber(e.target.value);
                            onChange(formattedValue);
                          }}
                          maxLength={12}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FloatingLabelInput
                        label="Title"
                        {...field}
                        value={field.value ?? ''}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl>
                      <FloatingLabelInput
                        label="Message"
                        {...field}
                        value={field.value ?? ''}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Section */}
              <FileUpload
                form={form}
                name="attachments"
                label=""
                required={false}
                config={{
                  maxFiles: 5,
                  maxFileSize: 2 * 1024 * 1024, // 2MB
                  acceptedTypes: ['image/*', 'video/*'],
                  showFileList: true,
                  showFileCounter: false,
                  showFileSize: true,
                  allowMultiple: true,
                }}
              />

              <div className="mt-10">
                <DefaultSubmitButton
                  isSubmitting={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  onSubmit={handleSubmit(onSubmit)}
                  onBack={() => {
                    if (isFormDirty) {
                      setOpenConfirmExitDialog(true);
                    } else {
                      router.back();
                    }
                  }}
                />
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
};

export default ContactUsForm;
