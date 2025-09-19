import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';

// Mock data store - singleton pattern
class MockReferralDataStore {
  private static instance: MockReferralDataStore;
  private data: ReferralCronjobTableData[] | null = null;

  private constructor() {}

  public static getInstance(): MockReferralDataStore {
    if (!MockReferralDataStore.instance) {
      MockReferralDataStore.instance = new MockReferralDataStore();
    }
    return MockReferralDataStore.instance;
  }

  public getData(): ReferralCronjobTableData[] {
    if (!this.data) {
      this.data = this.generateMockReferralData();
    }
    return this.data;
  }

  public updateReferral(id: string, updates: Partial<ReferralCronjobTableData>): boolean {
    const data = this.getData();
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      return true;
    }
    return false;
  }

  private generateMockReferralData(): ReferralCronjobTableData[] {
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

    // Use fixed seed for consistent data generation
    const seed = 12345;
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 1; i <= 50; i++) {
      const typeIndex = Math.floor(seededRandom(seed + i) * types.length);
      const statusIndex = Math.floor(seededRandom(seed + i + 100) * statuses.length);
      const referrerIndex = Math.floor(seededRandom(seed + i + 200) * users.length);
      const refereeIndex = Math.floor(seededRandom(seed + i + 300) * users.length);
      const updatedByIndex = Math.floor(seededRandom(seed + i + 400) * updatedByOptions.length);

      const randomType = types[typeIndex];
      const randomStatus = statuses[statusIndex];
      const randomReferrer = users[referrerIndex];
      const randomReferee = users[refereeIndex];
      const randomUpdatedBy = updatedByOptions[updatedByIndex];

      const spent = (seededRandom(seed + i + 500) * 1000).toFixed(2);
      const amount =
        randomStatus === 'fail' ? '0' : (seededRandom(seed + i + 600) * 500).toFixed(2);

      // Generate consistent date
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(seededRandom(seed + i + 700) * 30));
      randomDate.setHours(Math.floor(seededRandom(seed + i + 800) * 24));
      randomDate.setMinutes(Math.floor(seededRandom(seed + i + 900) * 60));
      randomDate.setSeconds(Math.floor(seededRandom(seed + i + 1000) * 60));

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
          id: Math.floor(seededRandom(seed + i + 1100) * 1000).toString(),
          email: randomUpdatedBy,
        },
        reason: randomStatus === 'fail' ? 'System Error' : null,
        transactionId: `txn_${i.toString().padStart(6, '0')}`,
      });
    }

    return data;
  }
}

export const mockReferralDataStore = MockReferralDataStore.getInstance();
