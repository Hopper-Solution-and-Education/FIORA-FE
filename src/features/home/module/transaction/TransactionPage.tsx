'use client';
import { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import CreateTransactionModal from './components/CreateTransactionModal';
import UpdateTransactionModal from './components/UpdateTransactionModal';
import DeleteTransactionModal from './components/DeleteTransactionModal';
import { Transaction } from './types/types';

const TransactionPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);

  const openUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="w-full h-[90%] px-[2vw] pb-[2vh] overflow-scroll">
      <TransactionTable
        openCreateModal={openCreateModal}
        openUpdateModal={openUpdateModal}
        openDeleteModal={openDeleteModal}
      />

      <CreateTransactionModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
      <UpdateTransactionModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        transaction={selectedTransaction || ({} as Transaction)}
      />
      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        transactionId={selectedTransaction?.id || ''}
      />
    </div>
  );
};

export default TransactionPage;
