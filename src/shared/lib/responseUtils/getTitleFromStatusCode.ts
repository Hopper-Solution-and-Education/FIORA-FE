import errorMessages from './errorMessages.json';

export const getTitleFromStatusCode = (statusCode: keyof typeof errorMessages): string => {
  return errorMessages[statusCode] || 'Unknown Error';
};
