import {
  AddUpdateBenefitTierRequest,
  AddUpdateBenefitTierResponse,
  DeleteBenefitTierRequest,
  DeleteBenefitTierResponse,
  GetListMembershipsRequest,
  GetListMembershipsResponse,
  Membership,
  UpsertMembershipRequest,
  UpsertMembershipResponse,
} from '../../domain/entities';
import {
  AddUpdateBenefitTierRequestDTO,
  AddUpdateBenefitTierResponseDTO,
  DeleteBenefitTierRequestDTO,
  DeleteBenefitTierResponseDTO,
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

  static toAddBenefitTierRequest(
    data: AddUpdateBenefitTierRequest,
  ): AddUpdateBenefitTierRequestDTO {
    return {
      tierBenefit: {
        tierId: data.tierBenefit.tierId,
        value: data.tierBenefit.value,
      },
      membershipBenefit: {
        name: data.membershipBenefit.name,
        slug: data.membershipBenefit.slug,
        description: data.membershipBenefit.description,
        suffix: data.membershipBenefit.suffix,
        userId: data.membershipBenefit.userId,
      },
      mode: data.mode,
    };
  }

  static toAddBenefitTierResponse(
    data: AddUpdateBenefitTierResponseDTO,
  ): AddUpdateBenefitTierResponse {
    return {
      data: {
        id: data.data.id,
        name: data.data.name,
        slug: data.data.slug,
        description: data.data.description,
        suffix: data.data.suffix,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        createdBy: data.data.createdBy,
        updatedBy: data.data.updatedBy,
        userId: data.data.userId,
      },
      message: data.message,
    };
  }

  static toDeleteBenefitTierRequest(data: DeleteBenefitTierRequest): DeleteBenefitTierRequestDTO {
    return {
      slug: data.slug,
      tierId: data.tierId,
      mode: data.mode,
    };
  }

  static toDeleteBenefitTierResponse(
    data: DeleteBenefitTierResponseDTO,
  ): DeleteBenefitTierResponse {
    return {
      data: data.data,
      message: data.message,
    };
  }
}
