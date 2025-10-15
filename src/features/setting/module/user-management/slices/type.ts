export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  registrationDate: string;
  avatarUrl?: string | null;
  eKYC?: {
    id: string;
    status: string;
    method: string;
    type: string;
    fieldName: string;
    createdAt: string;
  }[];
}

export interface FilterState {
  roles: string[];
  status: string[];
  fromDate: Date | null;
  toDate: Date | null;
  emails: string[];
  userFromDate: Date | null;
  userToDate: Date | null; 
}

export interface UserManagementState {
  loading: boolean;
  error: string | null;
  filters: FilterState;
  searchQuery: string;
}
