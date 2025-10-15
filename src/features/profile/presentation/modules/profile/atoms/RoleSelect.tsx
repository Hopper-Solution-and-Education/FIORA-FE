import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';

interface RoleSelectProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSelect({ selectedRole, onRoleChange }: RoleSelectProps) {
  return (
    <div className="mt-2">
      <label htmlFor="role" className="text-sm font-medium block mb-2">
        Select a role
      </label>
      <Select value={selectedRole} onValueChange={(value: UserRole) => onRoleChange(value)}>
        <SelectTrigger className="w-full rounded-lg h-10 px-4 border border-gray-200">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UserRole.User}>User</SelectItem>
          <SelectItem value={UserRole.CS}>Customer Service</SelectItem>
          <SelectItem value={UserRole.Admin}>Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
