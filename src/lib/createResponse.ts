import { NextApiResponse } from 'next';

export const createResponse = (status: number, message: string, data?: any) => {
  return {
    status,
    message,
    data,
  };
};

export const createError = (response: NextApiResponse, status: number, message: string) => {
  return response.status(status).json(createResponse(status, message));
};
