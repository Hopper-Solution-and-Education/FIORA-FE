import {
  createNewAcknowledgmentFeature,
  updateCompletedFeature,
} from '@/features/acknowledgment/infrastructure/services/acknowledgment.service';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  POST: ['Admin'],
  PATCH: ['User'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'PATCH':
      return PATCH(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res
      .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
      .json({ error: Messages.METHOD_NOT_ALLOWED });
  }

  const { featureKey, description } = req.body;

  const response = await createNewAcknowledgmentFeature(userId, featureKey, description);

  return res.status(RESPONSE_CODE.CREATED).json({
    message: 'success',
    data: response,
  });
}

export async function PATCH(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'PATCH') {
    return res
      .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
      .json({ error: Messages.METHOD_NOT_ALLOWED });
  }

  const { featureKey } = req.body;

  const response = await updateCompletedFeature(userId, featureKey);

  return res.status(RESPONSE_CODE.OK).json({
    message: 'success',
    data: response,
  });
}
