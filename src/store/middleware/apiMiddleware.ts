// import { getTitleFromStatusCode } from '@/config/getTitleFromStatusCode';
import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const apiMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    try {
      const errorResponse = JSON.parse((action.payload as any).message as string);
      // const title = getTitleFromStatusCode(errorResponse.statusCode);

      toast.error(errorResponse.message || errorResponse.error || 'Something went wrong!');
    } catch {
      toast.error('Something went wrong!');
    }
  }
  return next(action);
};

export default apiMiddleware;
