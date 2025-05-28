export class Partner {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  identify: string | null;
  dob: string | null;
  taxNo: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  parentId: string | null;
  parent: Partner | null;
  children: Partner[];
  expense: number;
  income: number;
  icon: string;

  constructor(
    id: string,
    userId: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    children: Partner[] = [],
    logo: string | null = null,
    identify: string | null = null,
    dob: string | null = null,
    taxNo: string | null = null,
    address: string | null = null,
    email: string | null = null,
    phone: string | null = null,
    description: string | null = null,
    updatedBy: string | null = null,
    parentId: string | null = null,
    parent: Partner | null = null,
    expense: number = 0,
    income: number = 0,
    icon: string = '',
  ) {
    this.id = id;
    this.userId = userId;
    this.logo = logo;
    this.name = name;
    this.identify = identify;
    this.dob = dob;
    this.taxNo = taxNo;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.parentId = parentId;
    this.parent = parent;
    this.children = children;
    this.expense = expense;
    this.income = income;
    this.icon = icon;
  }
}

export interface GetListPartnerRequest {
  page: number;
  pageSize: number;
}

export interface GetListPartnerResponse {
  data: Partner[];
}
