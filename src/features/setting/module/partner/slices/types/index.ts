import { Partner } from '../../domain/entities/Partner';

export interface PartnerState {
  partners: Partner[];
  isLoading: boolean;
  isCreatingPartner: boolean;
  isUpdatingPartner: boolean;
  error: string | null;
}

export const initialPartnerState = {
  partners: [] as Partner[],
  isLoading: false,
  error: null as string | null,
  isUpdatingPartner: false,
};
