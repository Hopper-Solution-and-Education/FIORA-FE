import { WalletType } from '@prisma/client';
import { z } from 'zod';

export const WalletTypeSchema = z.nativeEnum(WalletType);
