import { AcknowledgmentFeatureStepRequestDto } from '@/features/acknowledgment/data/dto/request';
import {
  createNewAcknowledgmentFeatureSteps,
  getFeatureSteps,
} from '@/features/acknowledgment/infrastructure/services/acknowledgment.service';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['User'],
  POST: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    case 'POST':
      return POST(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res
      .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
      .json({ error: Messages.METHOD_NOT_ALLOWED });
  }

  const { featureId } = req.query;

  if (!featureId) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: Messages.MISSING_PARAMS_INPUT });
  }

  const response = await getFeatureSteps(userId, featureId as string);

  if (!response) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json({ error: Messages.ACKNOWLEDGMENT_FEATURE_STEPS_NOT_FOUND });
  }

  return res.status(RESPONSE_CODE.CREATED).json({
    message: 'success',
    data: response,
  });
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res
      .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
      .json({ error: Messages.METHOD_NOT_ALLOWED });
  }

  const { tour }: { tour: AcknowledgmentFeatureStepRequestDto } = req.body;

  const response = await createNewAcknowledgmentFeatureSteps(userId, tour);

  return res.status(RESPONSE_CODE.CREATED).json({
    message: 'success',
    data: response,
  });
}
