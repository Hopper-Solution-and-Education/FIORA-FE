import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FinanceSummary() {
  const [FBalance, setFBalance] = useState('0.0');
  const [FDebt, setFDebt] = useState('0.0');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/accounts/balance');
      const data = await response.json();

      if (data.status !== 200) {
        return;
      } else {
        const { balance, dept } = data.data;
        const formatBalance = formatCurrency(balance);
        const formatDept = formatCurrency(dept);

        setFBalance(formatBalance);
        setFDebt(formatDept);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  return (
    <div className="flex flex-col gap-1 mt-2 w-[400px] flex-grow md:flex-grow-0">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 rounded-md px-2 py-0.5 font-semibold text-white"
        style={{
          background: COLORS.DEPS_SUCCESS.LEVEL_1,
          height: 24,
          fontSize: 13,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <span>FBalance:</span>
        <span className="ml-auto truncate">{isLoading ? 'Loading...' : FBalance}</span>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 rounded-md px-2 py-0.5 font-semibold text-white"
        style={{
          background: COLORS.DEPS_DANGER.LEVEL_1,
          height: 24,
          fontSize: 13,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <span>FDebt:</span>
        <span className="ml-auto truncate">{isLoading ? 'Loading...' : FDebt}</span>
      </motion.div>
    </div>
  );
}
