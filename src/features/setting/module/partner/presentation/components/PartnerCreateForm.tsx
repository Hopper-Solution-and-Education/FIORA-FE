'use client';

import CustomDateTimePicker from '@/components/common/atoms/CustomDateTimePicker';
import InputField from '@/components/common/atoms/InputField';
import SelectField from '@/components/common/atoms/SelectField';
import TextareaField from '@/components/common/atoms/TextareaField';
import UploadField from '@/components/common/atoms/UploadField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { useCreatePartner } from '@/features/setting/hooks/useCreatePartner';
import {
  PartnerFormValues,
  partnerSchema,
} from '@/features/setting/module/partner/presentation/schema/addPartner.schema';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export default function PartnerCreateForm() {
  const { onSubmit: submitPartner } = useCreatePartner({
    redirectPath: '/setting/partner',
  });

  const partners = useAppSelector((state) => state.partner.partners);

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners
      .filter((partner) => partner.parentId === null)
      .map((partner) => ({
        value: partner.id,
        label: partner.name,
      })),
  ];

  const fields = [
    <SelectField
      key="parentId"
      name="parentId"
      label="Parent"
      options={parentOptions}
      placeholder="Select a parent partner"
      defaultValue="none"
    />,
    <InputField key="name" name="name" label="Name" placeholder="Name" required />,
    <UploadField key="logo" label="Logo" name="logo" />,
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

  const handleSubmit = async (data: PartnerFormValues) => {
    try {
      // Simply pass the data to the submitPartner function
      // The logo upload will be handled in useCreatePartner
      await submitPartner(data);
    } catch (error) {
      toast.error('Failed to create partner');
      console.error('Create partner error:', error);
    }
  };

  return (
    <GlobalForm
      fields={fields}
      schema={partnerSchema}
      defaultValues={{
        parentId: 'none',
      }}
      onSubmit={handleSubmit}
    />
  );
}
