'use client';

import { uploadToFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { partnerDIContainer } from '@/features/setting/module/partner/di/partnerDIContainer';
import { TYPES } from '@/features/setting/module/partner/di/partnerDIContainer.type';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { ICreatePartnerUseCase } from '@/features/setting/module/partner/domain/usecases/CreatePartnerUsecase';
import { IGetPartnerUseCase } from '@/features/setting/module/partner/domain/usecases/GetPartnerUsecase';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CreatePartnerAPIRequestDTO } from '../module/partner/data/dto/request/CreatePartnerAPIRequestDTO';
import {
  defaultPartnerFormValue,
  PartnerFormValues,
  partnerSchema,
} from '../module/partner/presentation/schema/addPartner.schema';

function convertNullToUndefined<T>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key] === null) {
      result[key] = undefined as any;
    }
  }
  return result;
}

interface Props {
  redirectPath: string;
}

export function useCreatePartner({ redirectPath }: Props) {
  const { data: session, status } = useSession();
  const [partners, setPartners] = useState<Partner[]>([]);
  const router = useRouter();

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

  const fetchPartners = useCallback(
    async (userId: string) => {
      try {
        const response = await getPartnerUseCase.execute({ userId, page: 1, pageSize: 100 });
        setPartners(response.filter((partner) => partner.parentId === null));
      } catch (error: unknown) {
        console.error('Error fetching partners:', error);
      }
    },
    [getPartnerUseCase],
  );

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchPartners(session.user.id);
    }
  }, [status, session, fetchPartners]); // Thêm fetchPartners vào mảng phụ thuộc

  async function onSubmit(values: PartnerFormValues) {
    if (status !== 'authenticated' || !session?.user?.id) {
      toast.error('User not authenticated. Please log in.');
      return;
    }

    try {
      console.log('Received form values:', values);

      const submissionData = { ...values };
      let logoUrl: string | undefined;

      // Xử lý logo đơn giản hơn
      if (values.logo instanceof File) {
        logoUrl = await uploadToFirebase({
          file: values.logo,
          path: 'partners/logos',
          fileName: `partner_logo_${Date.now()}`,
        });
        console.log('Uploaded logo URL:', logoUrl);
      }

      const partnerData = {
        ...submissionData,
        userId: session.user.id,
        logo: logoUrl,
        parentId:
          submissionData.parentId?.toLowerCase() === 'none' ? null : submissionData.parentId,
      };

      console.log('Partner data before API call:', partnerData);

      const formattedPartnerData = convertNullToUndefined(partnerData);

      await createPartnerUseCase.execute(formattedPartnerData as CreatePartnerAPIRequestDTO);

      toast.success('Partner added successfully!');
      form.reset();
      await fetchPartners(session.user.id);
      router.push(redirectPath);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create partner');
      console.error('Create partner error:', error);
    }
  }

  return { form, onSubmit, partners, fetchPartners };
}
