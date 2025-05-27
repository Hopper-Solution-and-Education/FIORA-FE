import * as yup from 'yup';
import { FinanceReportEnum } from '../../constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '../../constant/FinanceReportFilterEnum';

export const GetFinanceReportSchema = yup.object().shape({
  type: yup.string().oneOf(Object.values(FinanceReportEnum)).required('Report type is required'),
  filter: yup
    .string()
    .oneOf(Object.values(FinanceReportFilterEnum))
    .default(FinanceReportFilterEnum.ALL),
});

export type GetFinanceReportRequest = {
  type: FinanceReportEnum;
  filter?: FinanceReportFilterEnum;
};
