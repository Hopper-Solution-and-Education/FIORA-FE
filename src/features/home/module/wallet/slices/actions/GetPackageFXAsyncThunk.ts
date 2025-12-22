import { createAsyncThunk } from '@reduxjs/toolkit';
import type { GetPackageFXPaginatedRequest } from '../../data/dto/request/GetPackageFXPaginatedRequest';
import type { PackageFXMappedResult } from '../../data/mapper/PackageFXMapper';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { PackageFX } from '../../domain/entity/PackageFX';
import type { IGetAllPackageFXUsecase } from '../../domain/usecase/GetAllPackageFXUsecase';

export interface GetPackageFXResult {
  packages: PackageFX[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  } | null;
  append: boolean; // Flag to indicate if packages should be appended or replaced
  search?: string;
}

export const getPackageFXAsyncThunk = createAsyncThunk<
  GetPackageFXResult,
  (GetPackageFXPaginatedRequest & { append?: boolean }) | undefined,
  { rejectValue: string }
>('wallet/getPackageFX', async (request, { rejectWithValue }) => {
  try {
    const usecase = walletContainer.get<IGetAllPackageFXUsecase>(
      WALLET_TYPES.IGetAllPackageFXUseCase,
    );

    const result = await usecase.execute(request);

    // Handle both return types
    if (Array.isArray(result)) {
      // Simple array response
      return {
        packages: result,
        pagination: null,
        append: false,
        search: request?.search,
      };
    }

    // Paginated response
    const mappedResult = result as PackageFXMappedResult;
    return {
      packages: mappedResult.packages,
      pagination: mappedResult.pagination,
      append: request?.append ?? false,
      search: request?.search,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch packageFX';
    return rejectWithValue(errorMessage);
  }
});
