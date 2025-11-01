import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';

const apiMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // try {
    //   const errorResponse = JSON.parse((action.payload as any).message as string);
    //   toast.error(errorResponse.message || errorResponse.error || 'Something went wrong!');
    // } catch {
    //   console.error(action.payload);
    // }

    return action?.payload;
  }
  return next(action);
};

export default apiMiddleware;
