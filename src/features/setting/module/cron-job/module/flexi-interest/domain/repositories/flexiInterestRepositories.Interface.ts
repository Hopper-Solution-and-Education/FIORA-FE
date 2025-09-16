export interface IFlexiInterestRepository {
  getFlexiInterestPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    search?: string,
  ): Promise<{ items: any[]; total: number }>;

  getFlexiInterestStatistics(): Promise<{
    tierInterestAmount: Array<{ 
      tierName: string; 
      interestAmount: string
    }>;
    totalInterestAmount: string;
  }>;
}
