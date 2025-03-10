export interface CategoryType {
  id: string;
  name: string;
  type: string;
  subCategories: { id: string; name: string }[];
}

export interface AccountCreate {
  name: string;
  type: string;
  currency: string;
  balance: number;
  parentId?: string;
  limit?: number;
}
