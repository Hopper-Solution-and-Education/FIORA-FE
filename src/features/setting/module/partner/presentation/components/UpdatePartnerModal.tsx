// src/features/setting/module/partner/components/UpdatePartnerModal.tsx
'use client';

import { FormSheet } from '@/components/common/organisms/FormSheet';
import { UpdatePartnerAPIRequestDTO } from '@/features/setting/module/partner/data/dto/request/UpdatePartnerAPIRequestDTO';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import {
  updatePartnerSchema,
  UpdatePartnerFormValues,
} from '@/features/setting/module/partner/presentation/schema/updatePartner.schema';
import { updatePartner } from '@/features/setting/module/partner/slices/actions/updatePartnerAsyncThunk';
import { generateFieldsFromSchema } from '@/shared/utils/formUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  setUpdatePartnerDialogOpen,
  triggerRefresh,
} from '@/features/setting/module/partner/slices';
import { useEffect } from 'react';

interface UpdatePartnerModalProps {
  partners: Partner[];
}

export function UpdatePartnerModal({ partners }: UpdatePartnerModalProps) {
  const dispatch = useAppDispatch();
  const { selectedPartner, isUpdatePartnerDialogOpen } = useAppSelector((state) => state.partner);

  const form = useForm<UpdatePartnerFormValues>({
    resolver: yupResolver(updatePartnerSchema),
    defaultValues: {
      name: selectedPartner?.name || '',
      logo: selectedPartner?.logo || null,
      identify: selectedPartner?.identify || null,
      dob: selectedPartner?.dob || null,
      taxNo: selectedPartner?.taxNo || null,
      address: selectedPartner?.address || null,
      email: selectedPartner?.email || null,
      phone: selectedPartner?.phone || null,
      description: selectedPartner?.description || null,
      parentId: selectedPartner?.parentId || null,
    },
  });

  useEffect(() => {
    if (selectedPartner) {
      form.reset({
        name: selectedPartner.name || '',
        logo: selectedPartner.logo || null,
        identify: selectedPartner.identify || null,
        dob: selectedPartner.dob || null,
        taxNo: selectedPartner.taxNo || null,
        address: selectedPartner.address || null,
        email: selectedPartner.email || null,
        phone: selectedPartner.phone || null,
        description: selectedPartner.description || null,
        parentId: selectedPartner.parentId || null,
      });
    }
  }, [selectedPartner, form]);

  const onSubmit = async (data: UpdatePartnerFormValues) => {
    if (!selectedPartner?.id) return;

    const updateData: UpdatePartnerAPIRequestDTO = {
      id: selectedPartner.id,
      name: data.name || undefined,
      logo: data.logo || '',
      identify: data.identify || undefined,
      dob: data.dob || undefined,
      taxNo: data.taxNo || undefined,
      address: data.address || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      description: data.description || undefined,
      parentId: data.parentId === 'none' || data.parentId === null ? undefined : data.parentId, // Convert 'none' or null to undefined
    };

    try {
      await dispatch(updatePartner(updateData)).unwrap();
      toast.success('Partner updated successfully');
      dispatch(triggerRefresh());
      dispatch(setUpdatePartnerDialogOpen(false));
    } catch (error) {
      toast.error('Failed to update partner');
      console.error(error);
    }
  };

  const fieldOverrides = {
    description: { type: 'textarea', section: 'Details', placeholder: 'Enter description' },
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
    email: { section: 'Contact Information' },
  };

  const fields = generateFieldsFromSchema(updatePartnerSchema, fieldOverrides);

  return (
    <FormSheet
      isOpen={isUpdatePartnerDialogOpen}
      setIsOpen={(open) => dispatch(setUpdatePartnerDialogOpen(open))}
      title="Update Partner"
      description="Edit the details of the selected partner."
      fields={fields}
      form={form}
      onSubmit={onSubmit}
      submitText="Update Partner"
      loading={form.formState.isSubmitting}
      side="center"
    />
  );
}
