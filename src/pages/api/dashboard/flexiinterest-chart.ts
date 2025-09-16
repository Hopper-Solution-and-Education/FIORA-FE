import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

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

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { typeCronJob } = req.query;

    if (typeCronJob !== 'FLEXI_INTEREST') {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Invalid typeCronJob parameter' });
    }


    const chartData = {
      totalAmount: "1000000",
      chartData: [
        { name: 'Gold', amount: '500000' },
        { name: 'Silver', amount: '300000' },
        { name: 'Bronze', amount: '200000' },
      ],
    };

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Chart data retrieved successfully', chartData));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
}
