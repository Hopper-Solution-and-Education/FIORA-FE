'use client';

import { useParams } from 'next/navigation';
import { SavingOverview, SavingTableHistory } from '../organisms';

function SavingDashboardPage() {
  const params = useParams();
  const walletId = params?.id as string;

  return (
    <div>
      <SavingOverview walletId={walletId} />
      <SavingTableHistory />
    </div>
  );
}

export default SavingDashboardPage;
