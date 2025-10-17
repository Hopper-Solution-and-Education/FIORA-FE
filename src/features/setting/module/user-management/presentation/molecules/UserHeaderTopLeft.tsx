import { useCallback, useMemo } from 'react';
import { FilterState } from '../../slices/type';
import UserManagementFilterMenu from './UserManagementFilterMenu';
import UserManagementSearch from './UserManagementSearch';

interface UserManagementHeaderLeftProps {
  searchQuery: string;
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
  users?: Array<{ id: string; email: string }>;
}

const UserManagementHeaderLeft: React.FC<UserManagementHeaderLeftProps> = ({
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
  users = [],
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

  // Create email options - use EMAIL as both value and label
  const emailOptions = useMemo(() => {
    // Remove duplicates based on email
    const uniqueEmails = Array.from(new Set(users.map((user) => user.email)));

    return uniqueEmails.map((email) => ({
      value: email, // Email for filtering
      label: email, // Email for display
    }));
  }, [users]);

  return (
    <div className="flex gap-4 items-center">
      <UserManagementSearch value={searchQuery} onChange={handleSearchChange} />

      <UserManagementFilterMenu
        value={filters}
        onFilterChange={handleFilterChange}
        emailOptions={emailOptions}
      />
    </div>
  );
};

export default UserManagementHeaderLeft;
