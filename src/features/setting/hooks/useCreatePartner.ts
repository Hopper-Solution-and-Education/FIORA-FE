'use client';

import { partnerDIContainer } from '@/features/setting/module/partner/di/partnerDIContainer';
import { TYPES } from '@/features/setting/module/partner/di/partnerDIContainer.type';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { ICreatePartnerUseCase } from '@/features/setting/module/partner/domain/usecases/CreatePartnerUsecase';
import { IGetPartnerUseCase } from '@/features/setting/module/partner/domain/usecases/GetPartnerUsecase';
import { setErrorsFromObject, uploadToFirebase } from '@/shared/lib';
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

  const fetchPartners = useCallback(async () => {
    try {
      if (!session?.user?.id) return;

      const response = await getPartnerUseCase.execute({
        page: 1,
        pageSize: 100,
        userId: session.user.id,
        filters: {},
      });
      setPartners(response.data.data.filter((partner) => partner.parentId === null));
    } catch (error: unknown) {
      console.error('Error fetching partners:', error);
    }
  }, [getPartnerUseCase, session?.user?.id]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchPartners();
    }
  }, [status, session, fetchPartners]);

  async function onSubmit(values: PartnerFormValues, setError: any) {
    if (status !== 'authenticated' || !session?.user?.id) {
      toast.error('User not authenticated. Please log in.');
      return;
    }

    try {
      const submissionData = { ...values };
      let logoUrl: string | undefined;

      if (values.logo instanceof File) {
        logoUrl = await uploadToFirebase({
          file: values.logo,
          path: 'partners/logos',
          fileName: `partner_logo_${Date.now()}`,
        });
      }

      const partnerData = {
        ...submissionData,
        userId: session.user.id,
        logo: logoUrl,
        parentId:
          submissionData.parentId?.toLowerCase() === 'none' ? null : submissionData.parentId,
      };

      const formattedPartnerData = convertNullToUndefined(partnerData);

      await createPartnerUseCase.execute(formattedPartnerData as CreatePartnerAPIRequestDTO);
      // form.reset();
      await fetchPartners();
      router.push(redirectPath);
    } catch (error: any) {
      const errorMessage = 'Failed to create partner';

      if (error.message) {
        setErrorsFromObject(error.message, setError);
      }

      toast.error(errorMessage);
    }
  }

  return { form, onSubmit, partners, fetchPartners };
}
