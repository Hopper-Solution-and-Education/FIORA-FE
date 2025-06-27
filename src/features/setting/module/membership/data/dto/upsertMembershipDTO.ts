import { HttpResponse } from '@/shared/types';
import { Membership } from '../../domain/entities';

export interface UpsertMembershipRequestDTO {
  id?: string;
  tierName?: string;
  mainIconUrl?: string | null;
  passedIconUrl?: string | null;
  inactiveIconUrl?: string | null;
  themeIconUrl?: string | null;
  story?: string;
  tierBenefits?: {
    slug?: string | null;
    name?: string | null;
  }[];
}

export type UpsertMembershipResponseDTO = HttpResponse<Membership>;
