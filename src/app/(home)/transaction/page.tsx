'use client';

import Loading from '@/components/common/atoms/Loading';
import {
  updateFilterCriteria,
  updateVisibleColumns,
} from '@/features/home/module/transaction/slices';
import { TransactionTableColumnKey } from '@/features/home/module/transaction/types';
import {
  DEFAULT_TRANSACTION_FILTER_CRITERIA,
  DEFAULT_TRANSACTION_TABLE_COLUMNS,
} from '@/features/home/module/transaction/utils/constants';
import { useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const TransactionPage = dynamic(() => import('@/features/home/module/transaction'), {
  loading: () => <Loading />,
});

const Transaction = () => {
  const { data } = useSession();
  const dispatch = useAppDispatch();

  const visibleColumnsFromLocalStorage: TransactionTableColumnKey = JSON.parse(
    localStorage.getItem('config' + (data?.user.id.split('-')[0] ?? '')) || '{}',
  );

  useEffect(() => {
    // Nếu chưa có data thì lưu data mặc định vào localStorage và redux state
    if (Object.keys(visibleColumnsFromLocalStorage).length === 0) {
      localStorage.setItem(
        'config' + (data?.user.id.split('-')[0] ?? ''),
        JSON.stringify(DEFAULT_TRANSACTION_TABLE_COLUMNS),
      );
      dispatch(updateVisibleColumns(DEFAULT_TRANSACTION_TABLE_COLUMNS));
    } else {
      // Nếu có data thì lưu vào redux state
      dispatch(updateVisibleColumns(visibleColumnsFromLocalStorage));
    }

    dispatch(updateFilterCriteria(DEFAULT_TRANSACTION_FILTER_CRITERIA));
  }, []);

  return <TransactionPage />;
};

export default Transaction;
