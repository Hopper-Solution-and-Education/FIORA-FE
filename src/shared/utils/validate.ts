import { ObjectSchema } from 'joi';

export const validateBody = <T>(
  schema: ObjectSchema,
  payload: T,
): { value?: T; error?: { [key: string]: string } } => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      const field = detail.path.join('.');
      formattedErrors[field] = detail.message.replace(/"/g, ''); // Remove double quotes from the error message
    });

    return { error: formattedErrors };
  }

  return { value };
};
