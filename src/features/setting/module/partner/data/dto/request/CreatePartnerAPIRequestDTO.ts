export interface CreatePartnerAPIRequestDTO {
  userId: string;
  name: string;
  logo?: string;
  identify?: string;
  dob?: string;
  taxNo?: string;
  address?: string;
  email?: string;
  phone?: string;
  description?: string;
  parentId?: string;
}
