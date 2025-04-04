export class Transaction {
  productId: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  constructor(
    productId: string,
    transactionId: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    updatedBy: string,
  ) {
    this.productId = productId;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}
