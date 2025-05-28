import { FilterCriteria } from '@/shared/types';
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
  filterCriteria: { userId: '', filters: {} } as FilterCriteria,
  minIncome: 0,
  maxIncome: 0,
  minExpense: 0,
  maxExpense: 0,
};

export type PartnerFilterResponse = {
  minIncome: number;
  maxIncome: number;
  minExpense: number;
  maxExpense: number;
};

export type PartnerResponse = {
  data: Partner[];
} & PartnerFilterResponse;
