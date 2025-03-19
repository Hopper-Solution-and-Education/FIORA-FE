// components/AddPartnerModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FormSheet } from '@/components/common/FormSheet';
import { createPartnerSchema } from '@/features/partner/schema/createPartner.schema';
import { generateFieldsFromSchema, FormFieldProps } from '@/shared/utils/formUtils';

interface CreatePartnerFormData {
  email: string;
  identify: string;
  description: string;
  dob: Date;
  logo: string;
  taxNo: string;
  phone: string;
  name: string;
  address: string;
}

interface AddPartnerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddPartnerModal({ isOpen, setIsOpen }: AddPartnerModalProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CreatePartnerFormData>({
    resolver: yupResolver(createPartnerSchema),
    defaultValues: {
      name: '',
      email: '',
      identify: '',
      description: '',
      dob: undefined,
      logo: '',
      taxNo: '',
      phone: '',
      address: '',
    },
  });

  function onSubmit(values: CreatePartnerFormData) {
    console.log(values);
    setIsOpen(false);
    form.reset();
    setLogoPreview(null);
    alert('Success');
  }

  const fieldOverrides: Partial<Record<keyof CreatePartnerFormData, Partial<FormFieldProps>>> = {
    description: {
      type: 'textarea',
      section: 'Details',
      placeholder: 'Enter description',
    },
    dob: {
      section: 'Details',
      render: (field: any) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full h-10 pl-3 text-left font-normal bg-background text-foreground border-input',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
              className="rounded-md border-border bg-card"
            />
          </PopoverContent>
        </Popover>
      ),
    },
    logo: {
      type: 'file',
      section: 'Media',
      render: (
        field: any,
        { setLogoPreview }: { setLogoPreview: (value: string | null) => void },
      ) => (
        <div className="space-y-4 w-full">
          <div className="relative">
            <label
              htmlFor="logo-upload"
              className={cn(
                'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-lg cursor-pointer transition-colors',
                field.value && 'hidden',
              )}
            >
              <span className="text-sm text-muted-foreground">Choose Image</span>
            </label>

            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setLogoPreview(base64String);
                    field.onChange(base64String);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />

            {field.value && (
              <div className="flex flex-col items-center space-y-2 p-3 bg-muted/30 rounded-lg border border-input hover:opacity-80">
                <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                <img
                  src={field.value || '/placeholder.svg'}
                  alt="Logo preview"
                  className="w-28 h-28 object-contain rounded-md border border-input shadow-sm bg-background p-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive/90 mt-1"
                  onClick={() => {
                    setLogoPreview(null);
                    field.onChange('');
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
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
    />
  );
}
