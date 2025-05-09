import { HttpResponse } from '@/features/setting/module/product/model';
import { BudgetGetResponse } from '../../../domain/entities/Budget';

export type BudgetGetResponseDTO = HttpResponse<BudgetGetResponse>;
