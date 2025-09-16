export interface IFlexiInterestRepository {
  getFlexiInterestPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }>;
}
