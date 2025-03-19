// components/AddPartnerModal.tsx
'use client';

import type React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPartnerSchema } from '@/features/partner/schema/createPartner.schema';
import { FormSheet } from '@/components/common/FormSheet';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddPartnerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

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

export const AddPartnerModal = ({ isOpen, setIsOpen }: AddPartnerModalProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CreatePartnerFormData>({
    resolver: yupResolver(createPartnerSchema),
    defaultValues: {
      email: '',
      identify: '',
      description: '',
      dob: undefined,
      logo: '',
      taxNo: '',
      phone: '',
      name: '',
      address: '',
    },
  });

  const handleSubmit = (data: CreatePartnerFormData) => {
    console.log('Form submitted:', data);
    setIsOpen(false);
    form.reset();
    setLogoPreview(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setLogoPreview(logoUrl);
      form.setValue('logo', logoUrl);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Enter partner name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
    },
    {
      name: 'identify',
      label: 'Identifier',
      placeholder: 'Enter identifier',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      render: (field: any) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full pl-3 text-left font-normal bg-background text-foreground border-input',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ),
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'file',
      render: () => (
        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full bg-background text-foreground border-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {logoPreview && (
            <div className="flex justify-center">
              <img
                src={logoPreview || '/placeholder.svg'}
                alt="Logo preview"
                className="w-24 h-24 object-cover rounded-lg border border-input shadow-sm"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'taxNo',
      label: 'Tax Number',
      placeholder: 'Enter tax number',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter phone number',
    },
    {
      name: 'address',
      label: 'Address',
      placeholder: 'Enter address',
    },
  ];

  return (
    <FormSheet
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Add New Partner"
      fields={fields}
      form={form}
      onSubmit={handleSubmit}
    />
  );
};
