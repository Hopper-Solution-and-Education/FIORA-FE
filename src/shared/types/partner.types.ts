import { Prisma } from '@prisma/client';

export type PartnerExtras = Prisma.PartnerGetPayload<{
  include: {
    transactions: true;
    children: true;
    parent: true;
  };
}>;
