import { BASE_API } from '@/shared/constants/ApiEndpointEnum';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  POST: ['User', 'Admin', 'CS'],
  GET: ['User', 'Admin', 'CS'],
})((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { isParent } = req.query;
    const url = isParent
      ? `${BASE_API}/accounts/search?isParent=true`
      : `${BASE_API}/accounts/search`;

    const beResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await beResponse.json();
    return res.status(beResponse.status).json(data);
  } catch (error: any) {
    console.error('Error proxying to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
