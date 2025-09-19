import { NextApiRequest, NextApiResponse } from 'next';
import { mockReferralDataStore } from './mockReferralDataStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { search = '', status = [], fromDate = '', toDate = '' } = req.query;

  // Generate mock summary data (all data)
  let allData = mockReferralDataStore.getData();

  // Apply filters
  if (search && typeof search === 'string') {
    allData = allData.filter(
      (item) =>
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.emailReferrer.toLowerCase().includes(search.toLowerCase()) ||
        item.emailReferee.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (status && Array.isArray(status) && status.length > 0) {
    allData = allData.filter((item) => status.includes(item.status));
  }

  if (fromDate && typeof fromDate === 'string') {
    const from = new Date(fromDate);
    allData = allData.filter((item) => new Date(item.executionTime) >= from);
  }

  if (toDate && typeof toDate === 'string') {
    const to = new Date(toDate);
    allData = allData.filter((item) => new Date(item.executionTime) <= to);
  }

  // Calculate summary by typeOfBenefit
  const summary = allData.reduce(
    (acc, item) => {
      const existingItem = acc.find((d) => d.typeOfBenefit === item.typeOfBenefit);
      if (existingItem) {
        existingItem.totalAmount += parseFloat(item.amount) || 0;
        existingItem.count += 1;
      } else {
        acc.push({
          typeOfBenefit: item.typeOfBenefit,
          totalAmount: parseFloat(item.amount) || 0,
          count: 1,
        });
      }
      return acc;
    },
    [] as { typeOfBenefit: string; totalAmount: number; count: number }[],
  );

  return res.status(200).json({
    data: {
      summary,
      totalItems: allData.length,
    },
    message: 'Success',
    success: true,
  });
}
