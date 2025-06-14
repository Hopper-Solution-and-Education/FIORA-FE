export class Account {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string,
    name: string,
    description: string,
    icon: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export type GetListAccountRequest = {
  page: number;
  pageSize: number;
  search: string;
};

export type GetListAccountResponse = {
  accounts: Account[];
};
