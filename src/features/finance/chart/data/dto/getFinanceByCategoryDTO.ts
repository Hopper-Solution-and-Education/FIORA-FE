import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { HttpResponse } from '@/shared/types';
import { FinanceByCategory } from '../../domain/entities';

export type GetFinanceByCategoryRequestDTO = {
  type: FinanceReportEnum;
  filter: FinanceReportFilterEnum;
};

export type GetFinanceByCategoryResponseDTO = HttpResponse<FinanceByCategory>;
