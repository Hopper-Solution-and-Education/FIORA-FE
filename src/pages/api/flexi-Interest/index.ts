import { flexiInterestUsecases } from '@/features/setting/module/cron-job/module/flexi-interest/application/flexiInterestUsecases';
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
  const { page = 1, pagesize = 20, search = '', filter } = req.query;
  const filterConverted = typeof filter === 'string' ? JSON.parse(filter) : {};
  console.log('🚀 ~ GET ~ filterConverted:', filterConverted);

  const flexiInterest = await flexiInterestUsecases.getFlexiInterestPaginated({
    page: Number(page),
    pageSize: Number(pagesize),
    filter: filterConverted,
    search: String(search),
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FLEXI_INTEREST_SUCCESS, flexiInterest));
}
