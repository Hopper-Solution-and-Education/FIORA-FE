import { smartSavingUsecaseInstance } from '@/features/setting/module/cron-job/module/smart-saving/application/smartSavingUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from '../../../shared/lib/responseUtils/createResponse';

export default withAuthorization({
  GET: ['Admin'],
  PUT: ['Admin'],
})((request: NextApiRequest, response: NextApiResponse, userId: string) => {
  switch (request.method) {
    case 'GET':
      return GET(request, response);
    case 'PUT':
      return PUT(request, response, userId);
    default:
      return response
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, pagesize = 20, search = '', filter } = req.query;
  const filterConverted = typeof filter === 'string' ? JSON.parse(filter) : {};
  console.log('🚀 ~ GET ~ filterConverted:', filterConverted);

  const smartsavingdata = await smartSavingUsecaseInstance.getSmartSavingPaginated({
    page: Number(page),
    pageSize: Number(pagesize),
    filter: filterConverted,
    search: String(search),
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_SMART_SAVING_SUCCESS, smartsavingdata));
}
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const cronJobId = req.query.cronJobId as string;
  const dataCronJob: {
    amount: number;
    reason: string;
  } = req.body;
  const updatedData = await smartSavingUsecaseInstance.updateSmartSavingAmount(
    dataCronJob,
    cronJobId,
    userId,
  );
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_SMART_SAVING_SUCCESS, updatedData));
}
