'use client';

import { useWalletSetting } from '../hooks';
import { WalletSettingTable, WalletSettingTopBarAction } from '../organisms';
import { WalletSettingProvider } from '../context';

const WalletSetting = () => {
  const { tableData, loading, loadMore, handleUpdateStatus } = useWalletSetting();

  return (
    <WalletSettingProvider value={{ handleUpdateStatus }}>
      <div className="space-y-6 border p-4 rounded-2xl mb-12">
        <WalletSettingTopBarAction />

        <WalletSettingTable
          data={tableData.data}
          loading={loading}
          hasMore={tableData.hasMore}
          isLoadingMore={tableData.isLoadingMore}
          onLoadMore={loadMore}
        />
      </div>
    </WalletSettingProvider>
  );
};

export default WalletSetting;
