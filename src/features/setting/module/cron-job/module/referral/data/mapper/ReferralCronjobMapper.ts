import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';

export class ReferralCronjobMapper {
  static toSearchParams(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): URLSearchParams {
    const params = new URLSearchParams();

    // Only append page and pageSize if they are valid (> 0)
    if (page > 0) {
      params.append('page', page.toString());
    }
    if (pageSize > 0) {
      params.append('pageSize', pageSize.toString());
    }

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

  static toPostBody(page: number, pageSize: number, filter?: ReferralCronjobFilterRequest): any {
    const body: any = {
      page: page > 0 ? page : 1,
      pageSize: pageSize > 0 ? pageSize : 10,
    };

    if (filter) {
      if (filter.status && filter.status.length > 0) {
        // Transform UI status format to API format
        body.status = filter.status.map((status: string) => {
          const statusMap: { [key: string]: string } = {
            successful: 'SUCCESSFUL',
            fail: 'FAIL',
          };
          return statusMap[status] || status.toUpperCase();
        });
      }
      if (filter.typeOfBenefit && filter.typeOfBenefit.length > 0) {
        // Transform UI typeOfBenefit format to API format
        body.typeBenefits = filter.typeOfBenefit.map((type: string) => {
          const typeMap: { [key: string]: string } = {
            'Referral Campaign': 'REFERRAL_CAMPAIGN',
            'Referral Bonus': 'REFERRAL_BONUS',
            'Referral Kickback': 'REFERRAL_KICKBACK',
          };
          return typeMap[type] || type;
        });
      }
      if (filter.emailReferrer && filter.emailReferrer.length > 0) {
        body.emailReferrer = filter.emailReferrer;
      }
      if (filter.emailReferee && filter.emailReferee.length > 0) {
        body.emailReferee = filter.emailReferee;
      }
      if (filter.updatedBy && filter.updatedBy.length > 0) {
        body.updatedBy = filter.updatedBy;
      }
      if (filter.search) {
        body.searchParam = filter.search;
      }
      if (filter.fromDate) {
        body.fromDate = filter.fromDate;
      }
      if (filter.toDate) {
        body.toDate = filter.toDate;
      }
    }

    return body;
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
