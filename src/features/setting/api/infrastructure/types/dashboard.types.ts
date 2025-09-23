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

export interface ReferralDashboardFilterParams extends DashboardFilterParams {
  typeBenefits?: string | string[];
  emailReferee?: string | string[];
  emailReferrer?: string | string[];
  searchParam?: string;
}
