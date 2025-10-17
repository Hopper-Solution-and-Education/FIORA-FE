import { ResponseObject } from '@/store/types/responseObject.type';

export function createResponse<T>(
  statusCode: number,
  status: string,
  data: T,
  message: string,
): ResponseObject {
  return {
    statusCode,
    status,
    data,
    message,
  };
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  error?: { [key: string]: string },
): ResponseObject {
  return {
    statusCode,
    status: 'error',
    data: null,
    message,
    error: error,
  };
}

export const isUrl = (value: string) => /^(https?|blob):\/\//.test(value);
export const isImageFile = (value: string) => {
  if (value.startsWith('blob:')) return true;
  return /\.(png|jpe?g|svg|gif|webp)$/i.test(value);
};
