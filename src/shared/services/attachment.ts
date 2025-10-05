import { httpClient } from '@/config/http-client/HttpClient';
import { Response } from '@/shared/types';
import { Attachment } from '@prisma/client';

const attachmentServices = {
  createAttachment: async (data: {
    url: string;
    path: string;
    type: string;
    size: number;
  }): Promise<Response<Attachment>> => {
    return httpClient.post<Response<Attachment>>('/api/attachments', data);
  },
};

export default attachmentServices;
