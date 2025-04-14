import { NextApiResponse } from 'next';

export const createResponse = (
  status: number,
  message: string | { [key: string]: string },
  data?: any,
) => {
  return {
    status,
    message,
    data,
  };
};

export const createError = (
  response: NextApiResponse,
  status: number = 500,
  message: string | { [key: string]: string },
) => {
  return response.status(status).json(createResponse(status, message));
};
