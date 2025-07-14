'use client';

import { DispatchTableProvider, TableProvider } from '../context';
import { useWalletSetting } from '../hooks';
import { WalletSettingTable, WalletSettingTopBarAction } from '../organisms';

const WalletSetting = () => {
  const { tableData, loading, loadMore, dispatchTable } = useWalletSetting();

  return (
    // DispatchTableProvider: Provides dispatch function for table actions (filter, sort, pagination)
    // Separation of concerns: Dispatch actions and table data are managed independently
    // Performance: Only re-render components that need updates when data or actions change
    // Reusability: Each context can be used independently in different components
    <DispatchTableProvider value={{ dispatchTable }}>
      {/* TableProvider: Provides table data state to child components */}
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
