import { z } from 'zod';

export const sendingSchema = z.object({
  receiver: z
    .string({ required_error: 'Receiver email is required' })
    .email('Invalid email format'),
  amountInput: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  description: z.string().max(150, 'Description must be at most 150 characters').optional(),
  otp: z.string().optional(),
});

export type SendingInputs = z.infer<typeof sendingSchema>;
