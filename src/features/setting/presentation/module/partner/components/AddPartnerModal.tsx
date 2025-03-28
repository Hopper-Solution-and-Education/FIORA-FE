// AddPartnerModal.tsx
'use client';

import { FormSheet } from '@/components/common/organisms/FormSheet';
import { createPartnerSchema } from '@/features/partner/schema/createPartner.schema';
import { useCreatePartner } from '@/features/setting/hooks/useCreatePartner';
import { PartnerFormValues } from '@/features/setting/module/partner/presentation/schema/addPartner.schema';
import { FieldOverrides } from '@/shared/types/formsheet.type';
import { generateFieldsFromSchema } from '@/shared/utils/formUtils';

interface AddPartnerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddPartnerModal({ isOpen, setIsOpen }: AddPartnerModalProps) {
  const { form, onSubmit, setLogoPreview, partners } = useCreatePartner(setIsOpen);

  const fieldOverrides: FieldOverrides<PartnerFormValues> = {
    description: {
      type: 'textarea',
      section: 'Details',
      placeholder: 'Enter description',
    },
    dob: {
      type: 'date',
      label: 'Date of Birth',
      section: 'Details',
      placeholder: 'Select date of birth',
    },
    logo: {
      type: 'image',
      label: 'Logo',
      section: 'Media',
      accept: 'image/*',
      placeholder: 'Choose Image',
    },
    taxNo: { section: 'Contact Information' },
    phone: { section: 'Contact Information' },
    address: { section: 'Contact Information' },
    parentId: {
      type: 'select',
      label: 'Parent',
      placeholder: 'Select a parent partner',
      options: [
        { value: 'none', label: 'None' },
        ...partners.map((partner) => ({
          value: partner.id,
          label: partner.name,
        })),
      ],
    },
    email: {
      section: 'Contact Information',
    },
  };

  const fields = generateFieldsFromSchema(createPartnerSchema, fieldOverrides);

  return (
    <FormSheet
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Add New Partner"
      description="Fill out the form below to add a new partner to your organization."
      fields={fields}
      form={form}
      onSubmit={onSubmit}
      submitText="Add Partner"
      context={{ setLogoPreview }}
      loading={form.formState.isSubmitting}
      side="center"
    />
  );
}
