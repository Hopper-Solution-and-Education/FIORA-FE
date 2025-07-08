'use client';

import { DispatchTableProvider, TableProvider } from '../context';
import { useWalletSetting } from '../hooks';
import { WalletSettingTable, WalletSettingTopBarAction } from '../organisms';

const WalletSetting = () => {
  const { tableData, loading, loadMore, dispatchTable } = useWalletSetting();

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
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
      </TableProvider>
    </DispatchTableProvider>
  );
};

export default WalletSetting;
