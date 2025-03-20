'use client';

import { FormSheet } from '@/components/common/FormSheet';
import { Input } from '@/components/ui/input';
import { createPartnerSchema } from '@/features/partner/schema/createPartner.schema';
import { useCreatePartner } from '@/features/setting/hooks/useCreatePartner';
import { cn } from '@/lib/utils';
import { FieldOverrides } from '@/shared/types/formsheet.type';
import { generateFieldsFromSchema } from '@/shared/utils/formUtils';
import { DateTimePicker } from '../../../../../../components/common/DateTimePicker';

interface AddPartnerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddPartnerModal({ isOpen, setIsOpen }: AddPartnerModalProps) {
  const { form, onSubmit, logoPreview, setLogoPreview, handleLogoChange } =
    useCreatePartner(setIsOpen);

  const fieldOverrides: FieldOverrides<any> = {
    description: {
      type: 'textarea',
      section: 'Details',
      placeholder: 'Enter description',
    },
    dob: {
      section: 'Details',
      render: (field) => (
        <DateTimePicker
          modal={false}
          value={field.value}
          onChange={field.onChange}
          clearable
          hideTime
        />
      ),
    },
    logo: {
      type: 'file',
      section: 'Media',
      render: () => (
        <div className="w-full">
          <label
            htmlFor="logo-upload"
            className={cn(
              'relative flex items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-lg cursor-pointer transition-all group',
              logoPreview && 'border-none bg-muted/30',
            )}
          >
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleLogoChange(e, form.setValue, form.clearErrors)}
              className="hidden"
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-28 h-28 object-cover rounded-md border border-input shadow-sm group-hover:opacity-70"
              />
            )}
            <span
              className={cn(
                'absolute text-sm text-foreground transition-all',
                logoPreview
                  ? 'opacity-0 group-hover:opacity-100 bg-black/50 px-1.5 py-1 rounded-md'
                  : 'opacity-100',
              )}
            >
              Choose Image
            </span>
          </label>
        </div>
      ),
    },
    taxNo: { section: 'Contact Information' },
    phone: { section: 'Contact Information' },
    address: { section: 'Contact Information' },
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
    />
  );
}
