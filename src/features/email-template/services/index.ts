import { httpClient } from '@/config/http-client/HttpClient';
import { Notification } from '@/shared/types';

import { Response } from '@/shared/types';

const emailTemplateServices = {
  fetchEmailTemplates: async (): Promise<Response<Array<Notification>>> => {
    return httpClient.get<Response<Array<Notification>>>('/api/email-template');
  },
};

export default emailTemplateServices;
