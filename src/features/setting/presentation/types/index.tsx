export interface CategoryType {
  id: string;
  name: string;
  type: string;
  subCategories: { id: string; name: string }[];
}
