import { Messages } from '@/shared/constants/message';
import { PartnerValidationData, ValidationError } from './partnerException.type';
import { Prisma } from '@prisma/client';
import { basePartnerSchema } from '../schema/basePartner.schema';
import * as Yup from 'yup';

export async function validatePartnerData(
  data: PartnerValidationData,
  tx: Prisma.TransactionClient,
  isUpdate = false,
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  const schema = isUpdate
    ? basePartnerSchema
    : basePartnerSchema.shape({
        name: Yup.string().required(Messages.NAME_REQUIRED).max(255, Messages.NAME_TOO_LONG),
      });

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      errors.push(
        ...error.inner.map((err) => ({
          field: err.path || 'unknown',
          message: err.message,
        })),
      );
    }
  }

  const uniquenessFields = ['email', 'phone', 'taxNo', 'identify']
    .map((field) => ({ field, value: data[field as keyof PartnerValidationData] as string }))
    .filter(({ value }) => value);

  if (uniquenessFields.length > 0) {
    const uniquenessChecks = await Promise.all(
      uniquenessFields.map(({ field, value }) =>
        tx.partner.findFirst({
          where: {
            [field]: value,
            userId: data.userId,
            ...(isUpdate && data.id ? { NOT: { id: data.id } } : {}),
          },
          select: { id: true },
        }),
      ),
    );

    uniquenessFields.forEach(({ field }, index) => {
      if (uniquenessChecks[index]) {
        errors.push({
          field,
          message: Messages[`PARTNER_${field.toUpperCase()}_EXISTS` as keyof typeof Messages],
        });
      }
    });
  }

  // Validate parentId
  if (data.parentId) {
    const parentPartner = await tx.partner.findUnique({
      where: { id: data.parentId },
      select: { id: true, parentId: true, userId: true },
    });

    [
      [!parentPartner, Messages.PARENT_PARTNER_NOT_FOUND],
      [
        parentPartner && parentPartner.userId !== data.userId,
        Messages.PARENT_PARTNER_DIFFERENT_USER,
      ],
      [parentPartner && parentPartner.parentId, Messages.INVALID_PARENT_HIERARCHY],
      [isUpdate && data.id === data.parentId, Messages.INVALID_PARENT_PARTNER_SELF],
    ]
      .filter(([condition]) => condition)
      .forEach(([, message]) => errors.push({ field: 'parentId', message: message as string }));
  }

  return errors;
}
