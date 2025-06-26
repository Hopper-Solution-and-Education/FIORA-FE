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

const TIER_BENEFIT_KEYS = {
  bnplFee: 'bnpl-fee',
  cashback: 'cashback',
  investmentInterest: 'investment-interest',
  loanInterest: 'loan-interest',
  referralBonus: 'referral-bonus',
  referralKickback: 'referral-kickback',
  savingInterest: 'saving-interest',
  stakingInterest: 'staking-interest',
};

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
          slug: TIER_BENEFIT_KEYS[key as keyof typeof TIER_BENEFIT_KEYS],
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
