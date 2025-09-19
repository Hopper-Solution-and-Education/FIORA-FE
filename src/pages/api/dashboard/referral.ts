import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock data generator function
function generateMockReferralData(): ReferralCronjobTableData[] {
  const data: ReferralCronjobTableData[] = [];
  const types = ['Referral Campaign', 'Referral Bonus', 'Referral Kickback'];
  const statuses = ['successful', 'fail'];
  const users = [
    'userA',
    'userB',
    'userC',
    'userD',
    'userE',
    'userF',
    'userG',
    'userH',
    'userI',
    'userJ',
  ];
  const updatedByOptions = ['System', 'Admin-001', 'Admin-002', 'Admin-003'];

  for (let i = 1; i <= 50; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomReferrer = users[Math.floor(Math.random() * users.length)];
    const randomReferee = users[Math.floor(Math.random() * users.length)];
    const randomUpdatedBy = updatedByOptions[Math.floor(Math.random() * updatedByOptions.length)];

    const spent = (Math.random() * 1000).toFixed(2);
    const amount = (Math.random() * 500).toFixed(2);

    // Generate random date within last 30 days
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    randomDate.setHours(Math.floor(Math.random() * 24));
    randomDate.setMinutes(Math.floor(Math.random() * 60));
    randomDate.setSeconds(Math.floor(Math.random() * 60));

    data.push({
      id: i.toString(),
      emailReferrer: `${randomReferrer}@gmail.com`,
      emailReferee: `${randomReferee}@gmail.com`,
      executionTime: randomDate.toISOString(),
      typeOfBenefit: randomType,
      spent: spent,
      amount: amount,
      status: randomStatus,
      updatedBy: {
        id: Math.floor(Math.random() * 1000).toString(),
        email: randomUpdatedBy,
      },
      reason: randomStatus === 'fail' ? 'System Error' : null,
      transactionId: `txn_${i.toString().padStart(6, '0')}`,
    });
  }

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    page = '1',
    pageSize = '10',
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
  let mockData = generateMockReferralData();

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

  // Apply pagination
  const total = mockData.length;
  const totalPages = Math.ceil(total / parseInt(pageSize as string));
  const startIndex = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  const endIndex = startIndex + parseInt(pageSize as string);
  const paginatedData = mockData.slice(startIndex, endIndex);

  return res.status(200).json({
    data: {
      items: paginatedData,
      total,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
      totalPages,
    },
    message: 'Success',
    success: true,
  });
}
