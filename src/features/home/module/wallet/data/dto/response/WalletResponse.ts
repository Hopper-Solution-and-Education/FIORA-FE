import { HttpResponse } from '@/shared/types';
import { Wallet } from '../../../domain/entity/Wallet';

export type WalletResponse = HttpResponse<Wallet>;

export type WalletsResponse = HttpResponse<Wallet[]>;
