export type CategoryProductUpdateRequestDTO = {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description?: string;
  tax_rate?: number | null;
};
