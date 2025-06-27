'use client';

import { FAQ_IMPORT_CONSTANTS } from '../../constants/import';

interface EmptyStateProps {
  filter: string;
}

const EmptyState = ({ filter }: EmptyStateProps) => (
  <div className="py-8 text-center text-gray-500">
    No {filter !== FAQ_IMPORT_CONSTANTS.FILTER_TYPES.ALL ? filter : ''} records found.
  </div>
);

export default EmptyState;
