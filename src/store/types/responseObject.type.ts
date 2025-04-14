export interface ResponseObject {
  statusCode: number;
  status: string;
  data: any;
  message: string;
  error?: { [key: string]: string } | null;
}
