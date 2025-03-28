'use client';

import { useState, useEffect } from 'react';
import { useForm, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { uploadToFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import {
  partnerSchema,
  defaultPartnerFormValue,
  PartnerFormValues,
} from '../module/partner/presentation/schema/addPartner.schema';
import { partnerDIContainer } from '@/features/setting/module/partner/di/partnerDIContainer';
import { TYPES } from '@/features/setting/module/partner/di/partnerDIContainer.type';
import { ICreatePartnerUseCase } from '@/features/setting/module/partner/domain/usecases/CreatePartnerUsecase';
import { IGetPartnerUseCase } from '@/features/setting/module/partner/domain/usecases/GetPartnerUsecase';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { CreatePartnerFormData } from '@/features/partner/schema/createPartner.schema';
import { CreatePartnerAPIRequestDTO } from '../module/partner/data/dto/request/CreatePartnerAPIRequestDTO';
import { useSession } from 'next-auth/react';

function convertNullToUndefined<T>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key] === null) {
      result[key] = undefined as any;
    }
  }
  return result;
}

export function useCreatePartner(setIsOpen: (open: boolean) => void) {
  const { data: session, status } = useSession();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);

  const form = useForm<PartnerFormValues>({
    resolver: yupResolver(partnerSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultPartnerFormValue,
      parentId: partners.length > 0 ? partners[0].id : 'None',
    },
  });

  const getPartnerUseCase = partnerDIContainer.get<IGetPartnerUseCase>(TYPES.IGetPartnerUseCase);
  const createPartnerUseCase = partnerDIContainer.get<ICreatePartnerUseCase>(
    TYPES.ICreatePartnerUseCase,
  );

  async function fetchPartners(userId: string) {
    try {
      const response = await getPartnerUseCase.execute({ userId, page: 1, pageSize: 100 });
      setPartners(response.filter((partner) => partner.parentId === null));
    } catch (error: unknown) {
      console.error('Error fetching partners:', error);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchPartners(session.user.id);
    }
  }, [status, session]);

  async function onSubmit(values: CreatePartnerFormData) {
    if (status !== 'authenticated' || !session?.user?.id) {
      toast.error('User not authenticated. Please log in.');
      return;
    }

    try {
      let logoUrl: string | undefined;

      if (logoFile) {
        const fileExtension = logoFile.name.split('.').pop();
        const fileName = `partner_logo_${uuidv4()}.${fileExtension}`;
        logoUrl = await uploadToFirebase({
          file: logoFile,
          path: 'partners/logos',
          fileName: fileName,
        });
      }

      const partnerData = {
        ...values,
        logo: logoUrl, // Có thể là undefined nếu không có logoFile
        userId: session.user.id,
      };

      const formattedPartnerData = convertNullToUndefined(partnerData);

      await createPartnerUseCase.execute(formattedPartnerData as CreatePartnerAPIRequestDTO);

      toast.success('Partner added successfully!');
      setIsOpen(false);
      form.reset();
      setLogoPreview(null);
      setLogoFile(null);

      await fetchPartners(session.user.id);
    } catch (error: any) {
      // console.error('Error submitting data: {}', error);
      toast.error(error.message);
    }
  }

  function handleLogoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: UseFormSetValue<CreatePartnerFormData>,
    clearErrors: UseFormClearErrors<CreatePartnerFormData>,
  ) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setValue('logo', file.name);
      clearErrors('logo');

      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return { form, onSubmit, logoPreview, setLogoPreview, handleLogoChange, partners, fetchPartners };
}
