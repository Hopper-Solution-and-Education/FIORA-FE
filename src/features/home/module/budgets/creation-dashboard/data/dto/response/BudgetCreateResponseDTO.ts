import { HttpResponse } from '@/features/setting/module/product/model';
import { Budget } from '../../../domain/entities/Budget';

export type BudgetCreateResponseDTO = HttpResponse<Budget>;
