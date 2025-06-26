import {
  GetCurrentTierResponse,
  GetListMembershipsRequest,
  GetListMembershipsResponse,
  Membership,
} from '../../domain/entities';
import {
  getCurrentTierResponseDTO,
  GetListMembershipsRequestDTO,
  GetListMembershipsResponseDTO,
} from '../dto';

export class MemberMapper {
  static toGetListMembershipsRequest(
    data: GetListMembershipsRequest,
  ): GetListMembershipsRequestDTO {
    return {
      page: data.page,
      limit: data.limit,
    };
  }

  static toGetListMembershipsResponse(
    data: GetListMembershipsResponseDTO,
  ): GetListMembershipsResponse {
    return {
      data: data.data.map((item) => new Membership(item)),
      message: data.message,
    };
  }

  static toGetCurrentTierResponse(data: getCurrentTierResponseDTO): GetCurrentTierResponse {
    return {
      currentTier: new Membership(data.data.currentTier),
      nextSpendingTier: new Membership(data.data.nextSpendingTier),
      nextBalanceTier: new Membership(data.data.nextBalanceTier),
    };
  }
}
