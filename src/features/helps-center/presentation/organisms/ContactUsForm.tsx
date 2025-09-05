'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ContactUsRequest } from '../../domain/entities/models/faqs';
import { contactUsSchema } from '../../domain/schemas/contactUsValidationSchemas';
import { usePhoneFormatter } from '../../hooks/usePhoneFormatter';
import { useContactUsMutation } from '../../store/api/helpsCenterApi';
import ContactFormItem from '../atoms/ContactFormItem';
import FileUpload from '../molecules/FileUpload';

type ContactUsFormProps = {
  setOpenConfirmExitDialog: (open: boolean) => void;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
};

const ContactUsForm = ({ setOpenConfirmExitDialog, user }: ContactUsFormProps) => {
  const router = useRouter();
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [contactUsMutation] = useContactUsMutation();

  const { formatPhoneNumber } = usePhoneFormatter();

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      title: '',
      phoneNumber: user?.phone ?? '',
      message: '',
      attachments: [],
    }),
    [user],
  );

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
              <ContactFormItem control={form.control} name="name" label="Name" required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContactFormItem control={form.control} name="email" label="Email" required />

                <ContactFormItem
                  control={form.control}
                  name="phoneNumber"
                  label="Phone Number"
                  required
                  maxLength={12}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    form.setValue('phoneNumber', formattedValue);
                  }}
                />
              </div>

              <ContactFormItem control={form.control} name="title" label="Title" required />

              <ContactFormItem control={form.control} name="message" label="Message" required />

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
