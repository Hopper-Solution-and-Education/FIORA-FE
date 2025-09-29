export interface IFlexiInterestRepository {
  getFlexiInterestPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }>;
  getFlexiInterestFilerOptions(): Promise<{
    emailOptions: { id: string; email: string }[];
    tierNameOptions: { id: string; tierName: string | null }[];
    updateByOptions: { id: string; email: string }[];
  }>;
}
