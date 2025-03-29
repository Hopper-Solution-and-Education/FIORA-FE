import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const apiMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.log(action.payload);
    const errorMessage = action.payload as string;
    toast.error('Error', {
      description: errorMessage || 'Something went wrong !',
      style: {
        color: 'red',
      },
    });
  }
  return next(action);
};

export default apiMiddleware;
