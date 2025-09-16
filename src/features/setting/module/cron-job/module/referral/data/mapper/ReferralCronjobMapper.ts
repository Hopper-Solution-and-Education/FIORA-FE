import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';

export class ReferralCronjobMapper {
  static toSearchParams(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): URLSearchParams {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach((status) => params.append('status', status));
      }
      if (filter.search) {
        params.append('search', filter.search);
      }
      if (filter.fromDate) {
        params.append('fromDate', filter.fromDate);
      }
      if (filter.toDate) {
        params.append('toDate', filter.toDate);
      }
    }

    return params;
  }

  static toChartSearchParams(filter?: ReferralCronjobFilterRequest): URLSearchParams {
    const params = new URLSearchParams();

    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filter.status.forEach((status) => params.append('status', status));
      }
      if (filter.search) {
        params.append('search', filter.search);
      }
      if (filter.fromDate) {
        params.append('fromDate', filter.fromDate);
      }
      if (filter.toDate) {
        params.append('toDate', filter.toDate);
      }
    }

    return params;
  }
}
