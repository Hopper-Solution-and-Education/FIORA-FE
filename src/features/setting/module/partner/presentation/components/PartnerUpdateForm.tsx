'use client';

import CustomDateTimePicker from '@/components/common/atoms/CustomDateTimePicker';
import InputField from '@/components/common/atoms/InputField';
import SelectField from '@/components/common/atoms/SelectField';
import TextareaField from '@/components/common/atoms/TextareaField';
import UploadField from '@/components/common/atoms/UploadField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { Button } from '@/components/ui/button';
import { uploadToFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import {
  UpdatePartnerFormValues,
  updatePartnerSchema,
} from '@/features/setting/module/partner/presentation/schema/updatePartner.schema';
import { updatePartner } from '@/features/setting/module/partner/slices/actions/updatePartnerAsyncThunk';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PartnerUpdateFormProps {
  initialData?: Partner;
}

export default function PartnerUpdateForm({ initialData }: PartnerUpdateFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const partners = useAppSelector((state) => state.partner.partners);

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners
      .filter((p) => p.id !== initialData?.id && p.parentId === null)
      .map((partner) => ({
        value: partner.id,
        label: partner.name,
      })),
  ];

  const defaultValues: Partial<UpdatePartnerFormValues> = {
    name: initialData?.name || '',
    logo: initialData?.logo || null,
    identify: initialData?.identify || null,
    dob: initialData?.dob || null,
    taxNo: initialData?.taxNo || null,
    address: initialData?.address || null,
    email: initialData?.email || null,
    phone: initialData?.phone || null,
    description: initialData?.description || null,
    parentId: initialData?.parentId || 'none',
  };

  const fields = [
    <SelectField
      key="parentId"
      name="parentId"
      label="Parent"
      options={parentOptions}
      placeholder="Select a parent partner"
      defaultValue={initialData?.parentId || 'none'}
    />,
    <InputField key="name" name="name" label="Name" placeholder="Name" />,
    <UploadField key="logo" label="Logo" name="logo" initialImageUrl={initialData?.logo || null} />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Enter description"
    />,
    <CustomDateTimePicker
      key="dob"
      name="dob"
      label="Date of Birth"
      placeholder="Select date of birth"
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      dateFormat="dd/MM/yyyy"
    />,
    <InputField
      key="identify"
      name="identify"
      label="Identification"
      placeholder="Identification Number"
    />,
    <InputField key="taxNo" name="taxNo" label="Tax Number" placeholder="Tax Number" />,
    <InputField key="phone" name="phone" label="Phone" placeholder="Phone Number" />,
    <InputField key="address" name="address" label="Address" placeholder="Address" />,
    <InputField key="email" name="email" label="Email" placeholder="Email" type="email" />,
  ];

  const onSubmit = async (data: UpdatePartnerFormValues) => {
    try {
      let finalLogoUrl = data.logo;

      if (data.logo && typeof data.logo === 'object' && 'type' in data.logo) {
        console.log('Uploading new logo file');
        finalLogoUrl = await uploadToFirebase({
          file: data.logo as File,
          path: 'partners/logos',
          fileName: `partner_logo_${initialData?.id}_${Date.now()}`,
        });
        console.log('Uploaded logo URL:', finalLogoUrl);
      }

      const updateData = {
        id: initialData?.id,
        name: data.name || undefined,
        logo: finalLogoUrl,
        identify: data.identify || undefined,
        dob: data.dob || undefined,
        taxNo: data.taxNo || undefined,
        address: data.address || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        description: data.description || undefined,
        parentId: data.parentId === 'none' ? null : data.parentId,
      };

      await dispatch(updatePartner(updateData)).unwrap();
      router.push('/setting/partner');
    } catch (error) {
      toast.error('Failed to update partner');
      console.error(error);
    }
  };

  return (
    <>
      <GlobalForm
        fields={fields}
        schema={updatePartnerSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        renderSubmitButton={(formState) => (
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Updating...' : 'Update Partner'}
          </Button>
        )}
      />
    </>
  );
}
