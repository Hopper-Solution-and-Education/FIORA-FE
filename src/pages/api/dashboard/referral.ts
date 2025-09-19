import { NextApiRequest, NextApiResponse } from 'next';
import { mockReferralDataStore } from './mockReferralDataStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    page,
    pageSize,
    search = '',
    status = [],
    typeOfBenefit = [],
    emailReferrer = [],
    emailReferee = [],
    updatedBy = [],
    fromDate = '',
    toDate = '',
  } = req.query;

  // Generate mock data
  let mockData = mockReferralDataStore.getData();

  // Helper function to normalize array parameters
  const normalizeArrayParam = (param: any): string[] => {
    if (Array.isArray(param)) {
      return param.filter((item) => typeof item === 'string' && item.length > 0);
    }
    if (typeof param === 'string' && param.length > 0) {
      return [param];
    }
    return [];
  };

  // Apply filters
  if (search && typeof search === 'string') {
    mockData = mockData.filter(
      (item) =>
        item.emailReferrer.toLowerCase().includes(search.toLowerCase()) ||
        item.emailReferee.toLowerCase().includes(search.toLowerCase()) ||
        item.typeOfBenefit.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const statusFilter = normalizeArrayParam(status);
  if (statusFilter.length > 0) {
    mockData = mockData.filter((item) => statusFilter.includes(item.status));
  }

  const typeOfBenefitFilter = normalizeArrayParam(typeOfBenefit);
  if (typeOfBenefitFilter.length > 0) {
    mockData = mockData.filter((item) => typeOfBenefitFilter.includes(item.typeOfBenefit));
  }

  const emailReferrerFilter = normalizeArrayParam(emailReferrer);
  if (emailReferrerFilter.length > 0) {
    mockData = mockData.filter((item) => emailReferrerFilter.includes(item.emailReferrer));
  }

  const emailRefereeFilter = normalizeArrayParam(emailReferee);
  if (emailRefereeFilter.length > 0) {
    mockData = mockData.filter((item) => emailRefereeFilter.includes(item.emailReferee));
  }

  const updatedByFilter = normalizeArrayParam(updatedBy);
  if (updatedByFilter.length > 0) {
    mockData = mockData.filter((item) => updatedByFilter.includes(item.updatedBy.email));
  }

  if (fromDate && typeof fromDate === 'string') {
    const from = new Date(fromDate);
    mockData = mockData.filter((item) => new Date(item.executionTime) >= from);
  }

  if (toDate && typeof toDate === 'string') {
    const to = new Date(toDate);
    mockData = mockData.filter((item) => new Date(item.executionTime) <= to);
  }

  // Apply pagination - if no page/pageSize provided, return all data
  const total = mockData.length;

  let paginatedData;
  let totalPages;
  let pageNum;
  let pageSizeNum;

  if (!page || !pageSize || page === '0' || pageSize === '0') {
    // Return all data if no pagination parameters or page/pageSize is 0
    paginatedData = mockData;
    totalPages = 1;
    pageNum = 1;
    pageSizeNum = total;
  } else {
    // Normal pagination
    pageSizeNum = parseInt(pageSize as string);
    pageNum = parseInt(page as string);
    totalPages = Math.ceil(total / pageSizeNum);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;
    paginatedData = mockData.slice(startIndex, endIndex);
  }

  return res.status(200).json({
    data: {
      items: paginatedData,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
    },
    message: 'Success',
    success: true,
  });
}
