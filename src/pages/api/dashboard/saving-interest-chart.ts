import { NextApiRequest, NextApiResponse } from 'next';
import { mockSavingInterestDataStore } from './mockSavingInterestDataStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { search = '', status = [], fromDate = '', toDate = '' } = req.query;

  // Generate mock summary data (all data)
  let allData = mockSavingInterestDataStore.getData();

  // Apply filters
  if (search && typeof search === 'string') {
    allData = allData.filter(
      (item) =>
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.membershipTier.toLowerCase().includes(search.toLowerCase()),
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

  // Calculate summary by membershipTier
  const summary = allData.reduce(
    (acc, item) => {
      const existingItem = acc.find((d) => d.membershipTier === item.membershipTier);
      if (existingItem) {
        existingItem.totalAmount += parseFloat(item.savingInterestAmount.replace(' FX', '')) || 0;
        existingItem.count += 1;
      } else {
        acc.push({
          membershipTier: item.membershipTier,
          totalAmount: parseFloat(item.savingInterestAmount.replace(' FX', '')) || 0,
          count: 1,
        });
      }
      return acc;
    },
    [] as { membershipTier: string; totalAmount: number; count: number }[],
  );

  return res.status(200).json({
    summary,
    totalItems: allData.length,
  });
}
