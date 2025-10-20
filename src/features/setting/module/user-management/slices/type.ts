// export interface User {
//   id: string;
//   name: string | null;
//   email: string;
//   role: string;
//   status: string;
//   registrationDate: string;
//   avatarUrl?: string | null;
//   eKYC?: {
//     id: string;
//     status: string;
//     method: string;
//     type: string | null;
//     fieldName: string;
//     createdAt: string;
//   }[];
// }

export interface EkycResponse {
  id: string;
  status: string;
  method: string;
  type: string | null;
  fieldName: string;
  createdAt: string;
  User: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    status: string;
    isBlocked: boolean | null;
    createdAt: string;
    avatarUrl?: string | null;
  };
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
