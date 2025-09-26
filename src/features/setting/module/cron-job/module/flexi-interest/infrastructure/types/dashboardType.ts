import { TablePaginationProps } from '@/components/common/tables/custom-table/types';
import { CronJobStatus, TypeCronJob } from '@prisma/client';

export interface DashboardFilterParams extends TablePaginationProps {
  status?: CronJobStatus | CronJobStatus[];
  typeCronJob?: TypeCronJob | TypeCronJob[];
  search?: string;
  fromTier?: string;
  toTier?: string;
  fromDate?: string;
  toDate?: string;
  createdBy?: string | string[];
  updatedBy?: string | string[];
  page?: number;
  sortOrder?: 'asc' | 'desc';
  userIds?: string | string[];
}

export interface FlexiInterestDashboardFilterParams extends DashboardFilterParams {
  email: string | string[];
  emailUpdateBy?: string | string[];
  tierName?: string | string[];
  searchParam?: string;
}
