export interface ValidationError {
  field: string;
  message: string;
}

export interface PartnerValidationData {
  userId: string;
  email?: string | null;
  phone?: string | null;
  taxNo?: string | null;
  identify?: string | null;
  name?: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
  dob?: string | Date | null;
  parentId?: string | null;
  id?: string; // For update
}
