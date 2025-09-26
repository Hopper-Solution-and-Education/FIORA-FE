export interface IAccountRepository {
  getRoleByUserId(userId: string): Promise<string | null>;
}
