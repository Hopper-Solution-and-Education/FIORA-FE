'use client';

import { useWalletSetting } from '../hooks';
import { WalletSettingTable, WalletSettingTopBarAction } from '../organisms';

const WalletSetting = () => {
  const { data, loading, pagination, setPage, handleView, handleApprove, handleReject } =
    useWalletSetting();

  console.log(data);

  return (
    <div className="space-y-6">
      <WalletSettingTopBarAction />

      <WalletSettingTable
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default WalletSetting;
