import type { IHttpClient } from '@/config';
import { IMembershipCronjobDashboardApi } from './IMembershipCronjobDashboardApi';

export class MembershipCronjobDashboardApi implements IMembershipCronjobDashboardApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }
}
