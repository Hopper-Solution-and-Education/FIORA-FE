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
    const safePage = Number.isFinite(page as any) && page ? page : 1;
    const safePageSize = Number.isFinite(pageSize as any) && pageSize ? pageSize : 20;
    params.append('page', String(safePage));
    params.append('pageSize', String(safePageSize));

    if (!filter) return params;

    const append = (name: string, value?: string | string[] | null) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        // Join array values with comma for backend
        params.append(name, value.join(','));
      } else {
        params.append(name, value);
      }
    };

    append('status', filter.status as any);
    append('typeCronJob', CronJobType.Membership);
    append('fromTier', filter.fromTier as any);
    append('toTier', filter.toTier as any);
    append('email', filter.email as any);
    append('userIds', filter.email as any);
    append('updatedBy', filter.updatedBy as any);

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
    // API returns pagination at root level, not inside data
    const items: MembershipCronjobItem[] = Array.isArray(response.data)
      ? (response.data as any)
      : [];

    // Get pagination from root level
    const page = (response as any).page;
    const pageSize = (response as any).pageSize;
    const totalPage = (response as any).totalPage;
    const total = (response as any).total ?? items.length;

    return {
      data: items || [],
      page,
      pageSize,
      totalPage,
      total,
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
