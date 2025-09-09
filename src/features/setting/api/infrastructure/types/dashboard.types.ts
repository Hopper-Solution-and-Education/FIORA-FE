import { CronJobStatus, TypeCronJob } from '@prisma/client';

export interface DashboardFilterParams {
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
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userIds?: string | string[];
}
