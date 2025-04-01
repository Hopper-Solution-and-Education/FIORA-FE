import { Partner } from '../../domain/entities/Partner';

export interface PartnerState {
  partners: Partner[];
  isLoading: boolean;
  isCreatingPartner: boolean;
  isUpdatingPartner: boolean;
  isDeletingPartner: boolean; // Add this line
  error: string | null;
}

export const initialPartnerState = {
  partners: [] as Partner[],
  isLoading: false,
  isCreatingPartner: false,
  isUpdatingPartner: false,
  isDeletingPartner: false, // Add this line
  error: null as string | null,
};
