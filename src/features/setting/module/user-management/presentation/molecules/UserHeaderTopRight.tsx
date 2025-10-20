import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

interface UserManagementHeaderRightProps {
  total: number;
  current: number;
  totalActive?: number;
  totalBlocked?: number;
}

const UserManagementHeaderRight: FC<UserManagementHeaderRightProps> = ({
  total,
  current,
  totalActive = 0,
  totalBlocked = 0,
}) => {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role;
  const isCS = currentUserRole === UserRole.CS;

  return (
    <div className=" border border-border rounded-md px-3 py-1 bg-background">
      <div className="flex flex-col items-end gap-1">
        {/* Show count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <span className="text-sm font-medium">
            {current} / {total}
          </span>
        </div>

        {/* A|B statistics only show if NOT CS*/}
        {!isCS && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-green-600">A</span>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-sm font-medium text-red-600">B:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">{totalActive}</span>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-sm font-medium text-red-600">{totalBlocked}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementHeaderRight;
