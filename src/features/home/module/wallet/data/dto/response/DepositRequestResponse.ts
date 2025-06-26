import { HttpResponse } from '@/shared/types';
import { DepositRequest } from '../../../domain';

export type DepositRequestResponse = HttpResponse<DepositRequest>;
