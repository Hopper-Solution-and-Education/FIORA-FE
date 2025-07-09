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

export enum TierBenefitName {
  REFERRAL_BONUS = 'referral-bonus',
  SAVING_INTEREST = 'saving-interest',
  STAKING_INTEREST = 'staking-interest',
  INVESTMENT_INTEREST = 'investment-interest',
  LOAN_INTEREST = 'loan-interest',
  CASHBACK = 'cashback',
  REFERRAL_KICKBACK = 'referral-kickback',
  BNPL_FEE = 'bnpl-fee',
}

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
            key !== 'mainIcon' &&
            key !== 'id',
        )
        .map(([key, value]) => ({
          slug: key,
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
