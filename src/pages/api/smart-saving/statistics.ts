import { smartSavingUsecaseInstance } from '@/features/setting/module/cron-job/module/smart-saving/application/smartSavingUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from '../../../shared/lib/responseUtils/createResponse';

export default withAuthorization({
  GET: ['Admin'],
})((request: NextApiRequest, response: NextApiResponse) => {
  switch (request.method) {
    case 'GET':
      return GET(request, response);
    default:
      return response
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const smartsavingdata = await smartSavingUsecaseInstance.getSmartSavingStatistics();
  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        Messages.GET_SMART_SAVING_STATISTICS_SUCCESS,
        smartsavingdata,
      ),
    );
}
