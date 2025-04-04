import { Pagination } from '@/shared/types/Common.types';

export type ProductGetTransactionRequestDTO = Pagination & {
  userId: string;
};
