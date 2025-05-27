import { Partner, Prisma } from '@prisma/client';
import { PartnerExtras } from '@/shared/types/partner.types';

export interface IPartnerRepository {
  getPartnersByUserId(
    userId: string,
    include?: Prisma.PartnerInclude | string,
    where?: Prisma.PartnerWhereInput,
  ): Promise<PartnerExtras[]>;
  getPartnerById(id: string, userId: string): Promise<Partner | null>;
  createPartner(data: Prisma.PartnerUncheckedCreateInput): Promise<Partner>;
  updatePartner(
    id: string,
    userId: string,
    data: Prisma.PartnerUncheckedUpdateInput,
  ): Promise<Partner>;
  // deletePartner(id: string, userId: string): Promise<Partner>;
  findByName(name: string, userId: string): Promise<Partner | null>;
  deletePartner(id: string): Promise<void>;
}
