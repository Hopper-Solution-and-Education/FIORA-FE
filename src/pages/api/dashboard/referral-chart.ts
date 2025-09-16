import { NextApiRequest, NextApiResponse } from 'next';

// Mock data generator - same as table API for consistency
function generateMockReferralData() {
  const data = [];
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

  for (let i = 1; i <= 100; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomReferrer = users[Math.floor(Math.random() * users.length)];
    const randomReferee = users[Math.floor(Math.random() * users.length)];

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

  const { search = '', status = [], fromDate = '', toDate = '' } = req.query;

  // Generate mock summary data (all data)
  let allData = generateMockReferralData();

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
