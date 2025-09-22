import { SavingInterestTableData } from '@/features/setting/module/cron-job/module/saving-interest/presentation/types/saving-interest.type';

// Mock data store - singleton pattern
class MockSavingInterestDataStore {
  private static instance: MockSavingInterestDataStore;
  private data: SavingInterestTableData[] | null = null;

  private constructor() {}

  public static getInstance(): MockSavingInterestDataStore {
    if (!MockSavingInterestDataStore.instance) {
      MockSavingInterestDataStore.instance = new MockSavingInterestDataStore();
    }
    return MockSavingInterestDataStore.instance;
  }

  public getData(): SavingInterestTableData[] {
    if (!this.data) {
      this.data = this.generateMockSavingInterestData();
    }
    return this.data;
  }

  public updateSavingInterest(id: string, updates: Partial<SavingInterestTableData>): boolean {
    const data = this.getData();
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      return true;
    }
    return false;
  }

  private generateMockSavingInterestData(): SavingInterestTableData[] {
    const data: SavingInterestTableData[] = [];
    const membershipTiers = [
      'Titan Egg',
      'Silver Egg',
      'Platinum Egg',
      'Gold Egg',
      'Diamond Egg',
      'Titan Tortoise',
      'Silver Tortoise',
      'Gold Tortoise',
      'Platinum Tortoise',
      'Diamond Tortoise',
      'Titan Phoenix',
      'Silver Phoenix',
      'Gold Phoenix',
      'Platinum Phoenix',
      'Diamond Phoenix',
      'Titan Oil',
      'Silver Oil',
      'Gold Oil',
      'Platinum Oil',
      'Diamond Oil',
      'Titan Dragon',
      'Silver Dragon',
      'Gold Dragon',
      'Platinum Dragon',
      'Diamond Dragon',
    ];
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
      'userK',
      'userL',
      'userM',
      'userN',
      'userO',
      'userP',
      'userQ',
      'userR',
      'userS',
      'userT',
    ];
    const updatedByOptions = ['System', 'Admin-001', 'Admin-002', 'Admin-003'];

    // Use fixed seed for consistent data generation
    const seed = 54321;
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    let currentId = 1;

    // First, ensure each tier has at least 1 successful record + 0-2 additional records
    membershipTiers.forEach((tier, tierIndex) => {
      const additionalRecords = Math.floor(seededRandom(seed + tierIndex * 100) * 3); // 0-2 additional records
      const totalRecordsForThisTier = 1 + additionalRecords; // At least 1 record per tier

      for (let i = 0; i < totalRecordsForThisTier; i++) {
        // First record for each tier is always successful
        const randomStatus =
          i === 0
            ? 'successful'
            : statuses[Math.floor(seededRandom(seed + currentId + 100) * statuses.length)];
        const userIndex = Math.floor(seededRandom(seed + currentId + 200) * users.length);
        const updatedByIndex = Math.floor(
          seededRandom(seed + currentId + 300) * updatedByOptions.length,
        );
        const randomUser = users[userIndex];
        const randomUpdatedBy = updatedByOptions[updatedByIndex];

        // Generate interest rates based on membership tier
        const tierRates: { [key: string]: number } = {
          'Titan Egg': 1.5,
          'Silver Egg': 2.0,
          'Platinum Egg': 2.5,
          'Gold Egg': 3.0,
          'Diamond Egg': 3.5,
          'Titan Tortoise': 2.0,
          'Silver Tortoise': 2.5,
          'Gold Tortoise': 3.0,
          'Platinum Tortoise': 3.5,
          'Diamond Tortoise': 4.0,
          'Titan Phoenix': 3.0,
          'Silver Phoenix': 3.5,
          'Gold Phoenix': 4.0,
          'Platinum Phoenix': 4.5,
          'Diamond Phoenix': 5.0,
          'Titan Oil': 2.5,
          'Silver Oil': 3.0,
          'Gold Oil': 3.5,
          'Platinum Oil': 4.0,
          'Diamond Oil': 4.5,
          'Titan Dragon': 4.0,
          'Silver Dragon': 4.5,
          'Gold Dragon': 5.0,
          'Platinum Dragon': 5.5,
          'Diamond Dragon': 6.0,
        };
        const baseRate = tierRates[tier] || 2.0;
        const savingInterestRate = (baseRate + seededRandom(seed + currentId + 400) * 0.5).toFixed(
          2,
        );

        // Generate balances and amounts
        const activeBalance = (seededRandom(seed + currentId + 500) * 50000 + 1000).toFixed(2);
        const savingInterestAmount =
          randomStatus === 'fail'
            ? '0 FX'
            : ((parseFloat(activeBalance) * parseFloat(savingInterestRate)) / 100 / 12).toFixed(2) +
              ' FX';

        // Generate consistent date
        const randomDate = new Date();
        randomDate.setDate(
          randomDate.getDate() - Math.floor(seededRandom(seed + currentId + 600) * 30),
        );
        randomDate.setHours(Math.floor(seededRandom(seed + currentId + 700) * 24));
        randomDate.setMinutes(Math.floor(seededRandom(seed + currentId + 800) * 60));
        randomDate.setSeconds(Math.floor(seededRandom(seed + currentId + 900) * 60));

        data.push({
          id: currentId.toString(),
          email: `${randomUser}@gmail.com`,
          executionTime: randomDate.toISOString(),
          membershipTier: tier,
          savingInterestRate: `${savingInterestRate}%`,
          activeBalance: `${activeBalance} FX`,
          savingInterestAmount: savingInterestAmount,
          status: randomStatus,
          updatedBy: {
            id: Math.floor(seededRandom(seed + currentId + 1000) * 1000).toString(),
            email: randomUpdatedBy,
          },
          reason: randomStatus === 'fail' ? 'Insufficient Balance' : null,
        });

        currentId++;
      }
    });

    // Add some additional random records to make data more realistic
    for (let i = 0; i < 20; i++) {
      const tierIndex = Math.floor(seededRandom(seed + currentId) * membershipTiers.length);
      const statusIndex = Math.floor(seededRandom(seed + currentId + 100) * statuses.length);
      const userIndex = Math.floor(seededRandom(seed + currentId + 200) * users.length);
      const updatedByIndex = Math.floor(
        seededRandom(seed + currentId + 300) * updatedByOptions.length,
      );

      const randomTier = membershipTiers[tierIndex];
      const randomStatus = statuses[statusIndex];
      const randomUser = users[userIndex];
      const randomUpdatedBy = updatedByOptions[updatedByIndex];

      const tierRates: { [key: string]: number } = {
        'Titan Egg': 1.5,
        'Silver Egg': 2.0,
        'Platinum Egg': 2.5,
        'Gold Egg': 3.0,
        'Diamond Egg': 3.5,
        'Titan Tortoise': 2.0,
        'Silver Tortoise': 2.5,
        'Gold Tortoise': 3.0,
        'Platinum Tortoise': 3.5,
        'Diamond Tortoise': 4.0,
        'Titan Phoenix': 3.0,
        'Silver Phoenix': 3.5,
        'Gold Phoenix': 4.0,
        'Platinum Phoenix': 4.5,
        'Diamond Phoenix': 5.0,
        'Titan Oil': 2.5,
        'Silver Oil': 3.0,
        'Gold Oil': 3.5,
        'Platinum Oil': 4.0,
        'Diamond Oil': 4.5,
        'Titan Dragon': 4.0,
        'Silver Dragon': 4.5,
        'Gold Dragon': 5.0,
        'Platinum Dragon': 5.5,
        'Diamond Dragon': 6.0,
      };
      const baseRate = tierRates[randomTier] || 2.0;
      const savingInterestRate = (baseRate + seededRandom(seed + currentId + 400) * 0.5).toFixed(2);

      const activeBalance = (seededRandom(seed + currentId + 500) * 50000 + 1000).toFixed(2);
      const savingInterestAmount =
        randomStatus === 'fail'
          ? '0 FX'
          : ((parseFloat(activeBalance) * parseFloat(savingInterestRate)) / 100 / 12).toFixed(2) +
            ' FX';

      const randomDate = new Date();
      randomDate.setDate(
        randomDate.getDate() - Math.floor(seededRandom(seed + currentId + 600) * 30),
      );
      randomDate.setHours(Math.floor(seededRandom(seed + currentId + 700) * 24));
      randomDate.setMinutes(Math.floor(seededRandom(seed + currentId + 800) * 60));
      randomDate.setSeconds(Math.floor(seededRandom(seed + currentId + 900) * 60));

      data.push({
        id: currentId.toString(),
        email: `${randomUser}@gmail.com`,
        executionTime: randomDate.toISOString(),
        membershipTier: randomTier,
        savingInterestRate: `${savingInterestRate}%`,
        activeBalance: `${activeBalance} FX`,
        savingInterestAmount: savingInterestAmount,
        status: randomStatus,
        updatedBy: {
          id: Math.floor(seededRandom(seed + currentId + 1000) * 1000).toString(),
          email: randomUpdatedBy,
        },
        reason: randomStatus === 'fail' ? 'Insufficient Balance' : null,
      });

      currentId++;
    }

    return data;
  }
}

export const mockSavingInterestDataStore = MockSavingInterestDataStore.getInstance();
