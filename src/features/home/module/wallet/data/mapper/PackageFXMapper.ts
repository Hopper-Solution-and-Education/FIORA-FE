import { PackageFX } from '../../domain/entity/PackageFX';
import { PackageFXPaginatedResponse, PackageFXResponse } from '../dto/response/PackageFXResponse';

export interface PackageFXMappedResult {
  packages: PackageFX[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  } | null;
}

export class PackageFXMapper {
  static toPackageFX(response: PackageFX): PackageFX {
    return {
      ...response,
    };
  }

  static toPackageFXs(response: PackageFXResponse): PackageFX[] {
    const { data } = response;
    if (Array.isArray(data)) {
      return data.map((item) => PackageFXMapper.toPackageFX(item));
    }
    return [PackageFXMapper.toPackageFX(data)];
  }

  /**
   * Maps response to packages with pagination metadata
   */
  static toPackageFXsWithPagination(response: PackageFXPaginatedResponse): PackageFXMappedResult {
    const { data } = response;

    // Handle paginated response
    if (!Array.isArray(data) && 'items' in data) {
      const packages = data.items.map((item) => PackageFXMapper.toPackageFX(item));
      const total = Number(data.total || 0);
      const page = Number(data.page || 1);
      const limit = Number(data.limit || 0);
      const hasMore = data.hasMore || false;

      return {
        packages,
        pagination: {
          total,
          page,
          limit,
          hasMore,
        },
      };
    }

    // Handle simple array response
    const packages = Array.isArray(data)
      ? data.map((item) => PackageFXMapper.toPackageFX(item))
      : [PackageFXMapper.toPackageFX(data as PackageFX)];

    return {
      packages,
      pagination: null,
    };
  }
}
