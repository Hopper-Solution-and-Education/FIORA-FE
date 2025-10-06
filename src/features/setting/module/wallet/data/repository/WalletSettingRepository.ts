import { FilterObject } from '@/shared/types/filter.types';
import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain';
import { DepositRequestsPaginated } from '../../presentation';
import type { IWalletSettingApi } from '../api';
import { MOCK_DEPOSIT_REQUESTS } from '../constant/mockDepositRequests';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';
import { WalletSettingMapper } from '../mapper';
import { IWalletSettingRepository } from './IWalletSettingRepository';

// Flag để bật/tắt mock data
// Đổi thành true để sử dụng mock data, false để gọi API thật
const USE_MOCK_DATA = true;

export class WalletSettingRepository implements IWalletSettingRepository {
  private walletSettingApi: IWalletSettingApi;

  constructor(walletSettingApi: IWalletSettingApi) {
    this.walletSettingApi = walletSettingApi;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<DepositRequestsPaginated> {
    // Sử dụng mock data nếu flag được bật
    if (USE_MOCK_DATA) {
      return this.getMockDepositRequestsPaginated(page, pageSize, filter);
    }

    const response = await this.walletSettingApi.getDepositRequestsPaginated(
      page,
      pageSize,
      filter,
    );
    return WalletSettingMapper.toDepositRequestsPaginated(response);
  }

  /**
   * Trả về mock data với pagination và filtering
   */
  private async getMockDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<DepositRequestsPaginated> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredData = [...MOCK_DEPOSIT_REQUESTS];

    // Apply filters if exists
    if (filter) {
      filteredData = this.applyFilterToMockData(filteredData, filter);
    }

    // Calculate pagination
    const total = filteredData.length;
    const totalPage = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredData.slice(startIndex, endIndex);

    return {
      items,
      page,
      pageSize,
      totalPage,
      total,
    };
  }

  /**
   * Áp dụng filter lên mock data
   */
  private applyFilterToMockData(data: any[], filter: FilterObject): any[] {
    let result = [...data];

    // Handle AND/OR conditions
    if ('AND' in filter && filter.AND) {
      filter.AND.forEach((subFilter) => {
        result = this.applyFilterToMockData(result, subFilter);
      });
      return result;
    }

    if ('OR' in filter && filter.OR) {
      const orResults: any[] = [];
      filter.OR.forEach((subFilter) => {
        const filtered = this.applyFilterToMockData(data, subFilter);
        orResults.push(...filtered);
      });
      // Remove duplicates
      return Array.from(new Set(orResults.map((item) => item.id))).map((id) =>
        orResults.find((item) => item.id === id),
      );
    }

    // Handle field-based filters
    Object.keys(filter).forEach((field) => {
      const condition = (filter as any)[field];

      if (typeof condition === 'object' && condition !== null) {
        // Handle search with contains
        if ('contains' in condition && condition.contains !== undefined) {
          const searchTerm = condition.contains.toLowerCase();
          result = result.filter((item) => {
            if (field === 'search') {
              // Search across multiple fields
              return (
                item.refCode?.toLowerCase().includes(searchTerm) ||
                item.user?.name?.toLowerCase().includes(searchTerm) ||
                item.user?.email?.toLowerCase().includes(searchTerm)
              );
            }
            return item[field]?.toString().toLowerCase().includes(searchTerm);
          });
        }

        // Handle equals
        if ('equals' in condition && condition.equals !== undefined) {
          result = result.filter((item) => item[field] === condition.equals);
        }

        // Handle range filters
        if ('gte' in condition && condition.gte !== undefined) {
          result = result.filter((item) => item[field] >= condition.gte);
        }
        if ('lte' in condition && condition.lte !== undefined) {
          result = result.filter((item) => item[field] <= condition.lte);
        }
        if ('gt' in condition && condition.gt !== undefined) {
          result = result.filter((item) => item[field] > condition.gt);
        }
        if ('lt' in condition && condition.lt !== undefined) {
          result = result.filter((item) => item[field] < condition.lt);
        }

        // Handle in operator
        if ('in' in condition && condition.in !== undefined && Array.isArray(condition.in)) {
          result = result.filter((item) => condition.in.includes(item[field]));
        }
      } else if (condition !== undefined) {
        // Simple equality check
        result = result.filter((item) => item[field] === condition);
      }
    });

    return result;
  }

  async updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<UpdateDepositRequestStatusResponse> {
    const response = await this.walletSettingApi.updateDepositRequestStatus(id, status, remark);
    return WalletSettingMapper.toUpdateDepositRequestStatus(response.data);
  }
}

decorate(injectable(), WalletSettingRepository);
decorate(inject(WALLET_SETTING_TYPES.IWalletSettingApi), WalletSettingRepository, 0);

export const createWalletSettingRepository = (
  walletSettingApi: IWalletSettingApi,
): IWalletSettingRepository => {
  return new WalletSettingRepository(walletSettingApi);
};
