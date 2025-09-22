import { NextApiRequest, NextApiResponse } from 'next';
import { mockSavingInterestDataStore } from './mockSavingInterestDataStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    page,
    pageSize,
    search = '',
    status = [],
    membershipTier = [],
    email = [],
    updatedBy = [],
    fromDate = '',
    toDate = '',
  } = req.query;

  // Generate mock data
  let mockData = mockSavingInterestDataStore.getData();

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
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.membershipTier.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const statusFilter = normalizeArrayParam(status);
  if (statusFilter.length > 0) {
    mockData = mockData.filter((item) => statusFilter.includes(item.status));
  }

  const membershipTierFilter = normalizeArrayParam(membershipTier);
  if (membershipTierFilter.length > 0) {
    mockData = mockData.filter((item) => membershipTierFilter.includes(item.membershipTier));
  }

  const emailFilter = normalizeArrayParam(email);
  if (emailFilter.length > 0) {
    mockData = mockData.filter((item) => emailFilter.includes(item.email));
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
    items: paginatedData,
    total,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages,
  });
}
