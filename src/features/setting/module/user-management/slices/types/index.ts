import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  creationDate: string;
  avatarUrl?: string | StaticImport;
}

export interface FilterState {
  roles: string[];
  statuses: string[];
  dateRange: string;
}
