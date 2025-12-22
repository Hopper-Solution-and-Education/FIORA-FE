import { BASE_API } from '@/shared/constants/ApiEndpointEnum';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'PUT':
          return PUT(request, response);
        case 'DELETE':
          return DELETE(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Missing account id' });
    }

    const beResponse = await fetch(`${BASE_API}/accounts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      },
    });

    const data = await beResponse.json();
    return res.status(beResponse.status).json(data);
  } catch (error: any) {
    console.error('Error proxying GET to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Missing account id' });
    }

    const beResponse = await fetch(`${BASE_API}/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await beResponse.json();
    return res.status(beResponse.status).json(data);
  } catch (error: any) {
    console.error('Error proxying PUT to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Missing account id' });
    }

    const beResponse = await fetch(`${BASE_API}/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      },
    });

    const data = await beResponse.json();
    return res.status(beResponse.status).json(data);
  } catch (error: any) {
    console.error('Error proxying DELETE to BE:', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
