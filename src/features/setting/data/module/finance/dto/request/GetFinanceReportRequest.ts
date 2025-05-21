import { FinanceReportEnum } from '../../constant/FinanceReportEnum';
import * as yup from 'yup';

// Schema dùng yup
export const GetFinanceReportSchema = yup.object({
  type: yup.mixed<FinanceReportEnum>().oneOf(Object.values(FinanceReportEnum)).required(),
});

export type GetFinanceReportRequest = yup.InferType<typeof GetFinanceReportSchema>;
