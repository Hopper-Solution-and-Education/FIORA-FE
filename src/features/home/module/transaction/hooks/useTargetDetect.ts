type HookProps = {
  type: 'Expense' | 'Income' | 'Transfer';
  target: 'from' | 'to';
};

const useTargetDetect = ({ type, target }: HookProps) => {};

export default useTargetDetect;
