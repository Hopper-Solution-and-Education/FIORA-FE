export interface IPostCategoryRepository {
  categoryExists(id: string): Promise<boolean>;
}
