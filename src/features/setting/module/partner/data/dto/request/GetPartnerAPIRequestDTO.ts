import { FilterCriteria } from '@/shared/types';

export interface GetPartnerAPIRequestDTO extends FilterCriteria {
  page: number;
  pageSize: number;
}
