import { CronJobType } from '@/shared/constants/cron-job';
import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import {
  MembershipCronjobItem,
  MembershipCronjobPaginatedResponse,
} from '../dto/response/MembershipCronjobResponse';

export class MembershipCronjobMapper {
  static toSearchParams(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): URLSearchParams {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (!filter) return params;

    const append = (name: string, value?: string | string[] | null) => {
      if (value == null) return;
      if (Array.isArray(value)) value.forEach((v) => params.append(name, v));
      else params.append(name, value);
    };

    append('status', filter.status as any);
    append('typeCronJob', CronJobType.Membership);
    if (filter.search) params.append('search', filter.search);
    if (filter.fromDate)
      params.append(
        'fromDate',
        typeof filter.fromDate === 'string'
          ? filter.fromDate
          : filter.fromDate.toISOString().split('T')[0],
      );
    if (filter.toDate)
      params.append(
        'toDate',
        typeof filter.toDate === 'string'
          ? filter.toDate
          : filter.toDate.toISOString().split('T')[0],
      );

    return params;
  }

  static toList(response: MembershipCronjobPaginatedResponse) {
    return {
      data: (response.data as MembershipCronjobItem[]) || [],
      page: response.page ?? 1,
      pageSize: response.pageSize ?? 10,
      totalPage: response.totalPage ?? 1,
      total: response.total ?? (response.data as MembershipCronjobItem[])?.length ?? 0,
      statistics: response.statistics ?? undefined,
    };
  }

  static toDynamicValue<T = any>(response: { data: Record<string, T[]> }) {
    const firstTypeKey = Object.keys(response?.data || {})[0];
    const items = (firstTypeKey ? (response.data as any)[firstTypeKey] : []) as Array<any>;
    return items.map((item) => item?.field).filter(Boolean);
  }

  static toChartSearchParams(filter?: MembershipCronjobFilterRequest): URLSearchParams {
    const params = new URLSearchParams();

    // Add default parameters for chart
    params.append('page', '1');
    params.append('pageSize', '10');
    params.append('typeCronJob', CronJobType.Membership);

    if (!filter) return params;

    const append = (name: string, value?: string | string[] | null) => {
      if (value == null) return;
      if (Array.isArray(value)) value.forEach((v) => params.append(name, v));
      else params.append(name, value);
    };

    append('status', filter.status as any);
    if (filter.search) params.append('search', filter.search);
    if (filter.fromDate)
      params.append(
        'fromDate',
        typeof filter.fromDate === 'string'
          ? filter.fromDate
          : filter.fromDate.toISOString().split('T')[0],
      );
    if (filter.toDate)
      params.append(
        'toDate',
        typeof filter.toDate === 'string'
          ? filter.toDate
          : filter.toDate.toISOString().split('T')[0],
      );

    return params;
  }
}
