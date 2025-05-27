export const formatMessage = (message: string, params: Record<string, any>): string => {
  let formattedMessage = message;

  Object.entries(params).forEach(([key, value]) => {
    formattedMessage = formattedMessage.replace(`{{${key}}}`, String(value));
  });

  return formattedMessage;
};
