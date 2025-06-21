import {
  GetListMembershipsRequest,
  GetListMembershipsResponse,
  Membership,
  UpsertMembershipRequest,
  UpsertMembershipResponse,
} from '../../domain/entities';
import {
  GetListMembershipsRequestDTO,
  GetListMembershipsResponseDTO,
  UpsertMembershipRequestDTO,
  UpsertMembershipResponseDTO,
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

  static toUpsertMembershipRequest(data: UpsertMembershipRequest): UpsertMembershipRequestDTO {
    return {
      id: data.id,
      tierName: data.tier,
      mainIconUrl: data.mainIcon,
      passedIconUrl: data.activeIcon,
      inactiveIconUrl: data.inActiveIcon,
      themeIconUrl: data.themeIcon,
      story: data.story,
      tierBenefits: Object.entries(data)
        .filter(
          ([key]) =>
            key !== 'tier' &&
            key !== 'story' &&
            key !== 'activeIcon' &&
            key !== 'inActiveIcon' &&
            key !== 'themeIcon' &&
            key !== 'mainIcon',
        )
        .map(([key, value]) => ({
          slug: key.toLowerCase(),
          value: Number(value),
        })),
    };
  }

  static toUpsertMembershipResponse(data: UpsertMembershipResponseDTO): UpsertMembershipResponse {
    return {
      data: new Membership(data.data),
      message: data.message,
    };
  }
}
