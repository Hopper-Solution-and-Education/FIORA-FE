'use client';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import SectionHeader from '../atoms/SectionHeader';

export type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
};

type Props = {
  initialValues?: Partial<PersonalInfo>;
  isLoading?: boolean;
  onSubmit: (values: PersonalInfo) => void;
};

const personalInfoSchema = Yup.object({
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

export const PersonalInfoForm: FC<Props> = ({ initialValues, isLoading, onSubmit }) => {
  const defaults = useMemo<PersonalInfo>(
    () => ({
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      birthday: initialValues?.birthday ?? '',
      address: initialValues?.address ?? '',
    }),
    [initialValues],
  );

  const form = useForm<PersonalInfo>({
    resolver: yupResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: defaults,
  });
  const {
    control,
    reset,
    formState: { isSubmitting, isValid },
    getValues,
  } = form;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const handleSubmitForm = (values: PersonalInfo) => {
    onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm(getValues());
        }}
        noValidate
      >
        <div className="mb-8">
          <SectionHeader title="Personal Information" />
          <p className="text-sm text-gray-500 mb-4">Update your personal details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="birthday">Birthday</FormLabel>
                  <FormControl>
                    <Input id="birthday" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" disabled {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormControl>
                    <Input id="phone" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2">
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Contact address</FormLabel>
                    <FormControl>
                      <Textarea
                        id="address"
                        className="resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <DefaultSubmitButton
          isSubmitting={isLoading || isSubmitting}
          disabled={!isValid || isSubmitting || isLoading}
          onSubmit={() => handleSubmitForm(getValues())}
          onBack={() => history.back()}
        />
      </form>
    </FormProvider>
  );
};

export default PersonalInfoForm;
