import { BASE_API } from '@/shared/constants/ApiEndpointEnum';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response);
        case 'DELETE':
          return DELETE(request, response);
        default:
          return response.status(405).json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  ),
);

// Create a new account - proxy to BE
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const beResponse = await fetch(`${BASE_API}/accounts/create`, {
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
    console.error('Error proxying create to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Delete sub-account - proxy to BE
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const beResponse = await fetch(`${BASE_API}/accounts/sub-account/delete`, {
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
    console.error('Error proxying delete sub-account to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
