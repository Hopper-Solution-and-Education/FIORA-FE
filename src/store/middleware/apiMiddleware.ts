import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';

const apiMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const errorMessage =
      (action.payload as { message?: string })?.message || 'Something went wrong';
    console.log('Error', errorMessage);
  }
  return next(action);
};

export default apiMiddleware;
