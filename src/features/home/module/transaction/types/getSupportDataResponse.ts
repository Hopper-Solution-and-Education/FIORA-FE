export interface SupportFromAccountResponse {
  id: string;
  name: string;
  type?: string;
}

export interface SupportFromCategoryResponse {
  id: string;
  name: string;
  type?: string;
}

export interface SupportToAccountResponse {
  id: string;
  name: string;
  type?: string;
}

export interface SupportToCategoryResponse {
  id: string;
  name: string;
  type?: string;
}

export interface GetSupportDataResponse {
  fromAccounts: SupportFromAccountResponse[];
  fromCategories: SupportFromCategoryResponse[];
  toAccounts: SupportToAccountResponse[];
  toCategories: SupportToCategoryResponse[];
}
