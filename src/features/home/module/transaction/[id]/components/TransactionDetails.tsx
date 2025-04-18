import { IRelationalTransaction } from '../../types';

type TransactionDetailsProps = {
  data: IRelationalTransaction;
};

const TransactionDetails = ({ data }: TransactionDetailsProps) => {
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default TransactionDetails;
