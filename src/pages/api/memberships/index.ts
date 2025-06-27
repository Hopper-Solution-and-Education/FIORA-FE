import { prisma } from '@/config';
import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { membershipTierSchema } from '@/shared/validators/membershipValidator';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin'],
  PUT: ['Admin'],
  GET: ['User', 'Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const memberShipList = await membershipSettingUseCase.getMembershipTiersDashboard();

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          Messages.GET_MEMBERSHIP_TIERS_DASHBOARD_SUCCESS,
          memberShipList,
        ),
      );
  } catch (error) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
        ),
      );
  }
}

// Membership Tier Upsert
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { error } = validateBody(membershipTierSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, error.message, error));
    }
    const newMembershipTier = await membershipSettingUseCase.upsertMembershipTier(req.body, userId);

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(
          RESPONSE_CODE.CREATED,
          Messages.UPSERT_MEMBERSHIP_TIER_SUCCESS,
          newMembershipTier,
        ),
      );
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const mockDataMembershipBenefit = [
      {
        name: 'Referral Bonus',
        slug: 'referral-bonus',
        suffix: 'FX',
        userId: userId,
      },
      {
        name: 'Saving Interest',
        slug: 'saving-interest',
        suffix: '/year',
        userId: userId,
      },
      {
        name: 'Staking Interest',
        slug: 'staking-interest',
        suffix: '/year',
        userId: userId,
      },
      {
        name: 'Investment Interest',
        slug: 'investment-interest',
        suffix: '/year',
        userId: userId,
      },
      {
        name: 'Loan Interest',
        slug: 'loan-interest',
        suffix: '/year',
        userId: userId,
      },
      {
        name: 'Cashback',
        slug: 'cashback',
        suffix: '% total spent',
        userId: userId,
      },
      {
        name: 'Referral Kickback',
        slug: 'referral-kickback',
        suffix: '% referral spent',
        userId: userId,
      },
      {
        name: 'BNPL Fee',
        slug: 'bnpl-fee',
        suffix: 'FX/day',
        userId: userId,
      },
    ] as Prisma.MembershipBenefitCreateManyInput[];

    await prisma.membershipBenefit.createMany({
      data: mockDataMembershipBenefit,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          Messages.GET_PARTNER_FILTERED_SUCCESS,
          mockDataMembershipBenefit,
        ),
      );
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
