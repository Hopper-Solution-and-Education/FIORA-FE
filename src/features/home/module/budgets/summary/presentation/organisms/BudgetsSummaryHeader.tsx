import React from 'react';
import BudgetSummaryFilter from '../atoms/BudgetSummaryFilter';

interface BudgetsSummaryHeaderProps {
  onFilter: (searchTerm: string) => void;
  year: number;
}

const BudgetsSummaryHeader = ({ onFilter }: BudgetsSummaryHeaderProps) => {
  return (
    <div className="mb-6">
      <BudgetSummaryFilter onFilter={onFilter} />
    </div>
  );
};

export default BudgetsSummaryHeader;
