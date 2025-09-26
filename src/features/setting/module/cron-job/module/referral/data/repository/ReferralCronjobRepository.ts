import { decorate, inject, injectable } from 'inversify';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { IReferralCronjobDashboardApi } from '../api/IReferralCronjobDashboardApi';
import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import { ReferralCronjobPaginatedResponse } from '../dto/response/ReferralCronjobResponse';
import { IReferralCronjobRepository } from './IReferralCronjobRepository';

export class ReferralCronjobRepository implements IReferralCronjobRepository {
  private api: IReferralCronjobDashboardApi;

  constructor(api: IReferralCronjobDashboardApi) {
    this.api = api;
  }

  async getReferralCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse> {
    const response = await this.api.getReferralCronjobsPaginated(page, pageSize, filter);

    // Transform API response to expected format
    if (response.data && Array.isArray(response.data)) {
      const transformedItems = (response.data as any[]).map((item, index) => ({
        id: item.id || String((page - 1) * pageSize + index + 1), // Use API id or generate unique ID based on pagination
        emailReferrer: item.referrerEmail || '',
        emailReferee: item.referredEmail || '',
        executionTime: item.dateTime || '',
        typeOfBenefit: this.mapTypeOfBenefit(item.type),
        spent: String(item.spent || 0),
        amount: String(item.amount || 0),
        status: item.status?.toLowerCase() === 'successful' ? 'successful' : 'fail',
        updatedBy: {
          id: '1',
          email: item.updatedBy || 'System',
        },
        reason: item.reason && item.reason !== 'NaN' ? item.reason : null,
        transactionId: item.transactionId || null,
      }));

      return {
        ...response,
        data: {
          items: transformedItems,
          total: (response as any).total || 0,
          page: (response as any).page || 1,
          pageSize: (response as any).pageSize || 10,
          totalPages: (response as any).totalPage || 1,
        },
      };
    }

    return response;
  }

  private mapTypeOfBenefit(type: string): string {
    const typeMap: { [key: string]: string } = {
      REFERRAL_CAMPAIGN: 'Referral Campaign',
      REFERRAL_BONUS: 'Referral Bonus',
      REFERRAL_KICKBACK: 'Referral Kickback',
    };
    return typeMap[type] || type;
  }

  async getReferralChartData(
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralChartResponse> {
    const response = await this.api.getReferralChartData(filter);

    // Transform API response to expected format
    if (response.data && typeof response.data === 'object') {
      const { referralKickbackValue, referralBonusValue, referralCampaignValue } =
        response.data as any;

      const summary = [
        {
          typeOfBenefit: 'Referral Kickback',
          totalAmount: referralKickbackValue || 0,
          count: referralKickbackValue > 0 ? 1 : 0,
        },
        {
          typeOfBenefit: 'Referral Bonus',
          totalAmount: referralBonusValue || 0,
          count: referralBonusValue > 0 ? 1 : 0,
        },
        {
          typeOfBenefit: 'Referral Campaign',
          totalAmount: referralCampaignValue || 0,
          count: referralCampaignValue > 0 ? 1 : 0,
        },
      ]; // Show all items regardless of value

      return {
        ...response,
        data: {
          summary,
          totalItems: summary.length,
        },
      };
    }

    return response;
  }

  async getReferralFilterOptions(): Promise<any> {
    return this.api.getReferralFilterOptions();
  }
}

decorate(injectable(), ReferralCronjobRepository);
decorate(inject(REFERRAL_CRONJOB_TYPES.IReferralCronjobDashboardApi), ReferralCronjobRepository, 0);
