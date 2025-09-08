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
    params.append('lmit', pageSize.toString());

    if (!filter) return params;

    const append = (name: string, value?: string | string[] | null) => {
      if (value == null) return;
      if (Array.isArray(value)) value.forEach((v) => params.append(name, v));
      else params.append(name, value);
    };

    append('status', filter.status as any);
    append('typeCronJob', filter.typeCronJob as any);
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
      data: response.data.data as MembershipCronjobItem[],
      page: response.data.page,
      pageSize: response.data.pageSize ?? 10,
      totalPage: response.data.totalPage,
      total: response.data.total,
      statistics: response.data.statistics ?? undefined,
    };
  }
}
