export type CategoryProductCreateRequestDTO = {
  icon: string;
  name: string;
  userId: string;
  description?: string;
  tax_rate?: number | null;
};
