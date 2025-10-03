import { useCallback } from 'react';
import { FilterState } from '../../slices/type';
import UserManagementFilterMenu from './UserManagementFilterMenu';
import UserManagementSearch from './UserManagementSearch';

interface UserManagementHeaderLeftProps {
  searchQuery: string;
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

const UserManagementHeaderLeft: React.FC<UserManagementHeaderLeftProps> = ({
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
}) => {
  const handleSearchChange = useCallback(
    (value: string) => {
      onSearchChange(value);
    },
    [onSearchChange],
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      onFilterChange(newFilters);
    },
    [onFilterChange],
  );

  return (
    <div className="flex gap-4 items-center">
      <UserManagementSearch value={searchQuery} onChange={handleSearchChange} />

      <UserManagementFilterMenu value={filters} onFilterChange={handleFilterChange} />
    </div>
  );
};

export default UserManagementHeaderLeft;
