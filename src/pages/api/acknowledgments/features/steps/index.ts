import { AcknowledgmentFeatureStepRequestDto } from '@/features/acknowledgment/data/dto/request';
import { createNewAcknowledgmentFeatureSteps } from '@/features/acknowledgment/infrastructure/services/acknowledgment.service';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  POST: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
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

  const { tour }: { tour: AcknowledgmentFeatureStepRequestDto } = req.body;

  const response = await createNewAcknowledgmentFeatureSteps(userId, tour);

  return res.status(RESPONSE_CODE.CREATED).json({
    message: 'success',
    data: response,
  });
}
