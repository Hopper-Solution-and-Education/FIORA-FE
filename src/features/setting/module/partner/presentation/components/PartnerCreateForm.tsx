'use client';

import InputField from '@/components/common/atoms/InputField';
import SelectField from '@/components/common/atoms/SelectField';
import TextareaField from '@/components/common/atoms/TextareaField';
import UploadField from '@/components/common/atoms/UploadField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { Button } from '@/components/ui/button';
import { useCreatePartner } from '@/features/setting/hooks/useCreatePartner';
import {
  PartnerFormValues,
  partnerSchema,
} from '@/features/setting/module/partner/presentation/schema/addPartner.schema';
import { toast } from 'sonner';
import CustomDateTimePicker from '@/components/common/atoms/CustomDateTimePicker';

// interface PartnerCreateFormProps {
//   initialData?: PartnerFormValues;
// }

export default function PartnerCreateForm() {
  const { partners, onSubmit: submitPartner } = useCreatePartner({
    redirectPath: '/setting/partner',
  });

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners.map((partner) => ({
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
    <InputField key="name" name="name" label="Name" placeholder="Partner Name" required />,
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
    <UploadField key="logo" label="Logo" name="logo" />,
    <InputField key="taxNo" name="taxNo" label="Tax Number" placeholder="Tax Number" />,
    <InputField key="phone" name="phone" label="Phone" placeholder="Phone Number" />,
    <InputField key="address" name="address" label="Address" placeholder="Address" />,
    <InputField key="email" name="email" label="Email" placeholder="Email" type="email" />,
  ];

  const handleSubmit = async (data: PartnerFormValues) => {
    try {
      await submitPartner(data);
    } catch (error) {
      toast.error('Failed to create partner');
      console.log(error);
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
      renderSubmitButton={(formState) => (
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting...' : 'Create Partner'}
        </Button>
      )}
    />
  );
}
