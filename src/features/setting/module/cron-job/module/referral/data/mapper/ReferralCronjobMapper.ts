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
      if (filter.typeOfBenefit && filter.typeOfBenefit.length > 0) {
        filter.typeOfBenefit.forEach((type) => params.append('typeOfBenefit', type));
      }
      if (filter.emailReferrer && filter.emailReferrer.length > 0) {
        filter.emailReferrer.forEach((email) => params.append('emailReferrer', email));
      }
      if (filter.emailReferee && filter.emailReferee.length > 0) {
        filter.emailReferee.forEach((email) => params.append('emailReferee', email));
      }
      if (filter.updatedBy && filter.updatedBy.length > 0) {
        filter.updatedBy.forEach((user) => params.append('updatedBy', user));
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
      if (filter.typeOfBenefit && filter.typeOfBenefit.length > 0) {
        filter.typeOfBenefit.forEach((type) => params.append('typeOfBenefit', type));
      }
      if (filter.emailReferrer && filter.emailReferrer.length > 0) {
        filter.emailReferrer.forEach((email) => params.append('emailReferrer', email));
      }
      if (filter.emailReferee && filter.emailReferee.length > 0) {
        filter.emailReferee.forEach((email) => params.append('emailReferee', email));
      }
      if (filter.updatedBy && filter.updatedBy.length > 0) {
        filter.updatedBy.forEach((user) => params.append('updatedBy', user));
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
