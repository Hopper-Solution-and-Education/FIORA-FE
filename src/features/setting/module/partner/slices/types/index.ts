import { Partner } from '../../domain/entities/Partner';

export interface PartnerState {
  partners: Partner[];
  isLoading: boolean;
  isCreatingPartner: boolean;
  isUpdatingPartner: boolean;
  error: string | null;
}

export const initialPartnerState: PartnerState = {
  partners: [],
  isLoading: false,
  isCreatingPartner: false,
  isUpdatingPartner: false,
  error: null,
};
