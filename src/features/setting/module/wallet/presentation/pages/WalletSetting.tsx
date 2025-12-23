'use client';

import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { resetColumns, setColumnConfig } from '../../slices';
import { loadColumnConfigFromStorage, saveColumnConfigToStorage } from '../../slices/persist';
import { DispatchTableProvider, TableProvider } from '../context';
import { useWalletSetting } from '../hooks';
import { WalletSettingTable, WalletSettingTopBarAction } from '../organisms';
import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKey,
} from '../types/setting.type';

/**
 * Main wallet setting page component
 * Manages the overall layout and provides context for child components
 */
const WalletSetting = () => {
  const { tableData, loading, loadMore, dispatchTable, reloadData } = useWalletSetting();
  const dispatch = useAppDispatch();

  // Initialize wallet setting on component mount
  useEffect(() => {
    // Load saved column configuration from localStorage
    const config = loadColumnConfigFromStorage();

    if (config) {
      // Check if all required column keys are present
      const requiredKeys = Object.keys(
        WALLET_SETTING_TABLE_COLUMN_CONFIG,
      ) as WalletSettingTableColumnKey[];
      const loadedKeys = Object.keys(config) as WalletSettingTableColumnKey[];

      // Find missing keys and redundant keys
      const missingKeys = requiredKeys.filter((key) => !loadedKeys.includes(key));
      const redundantKeys = loadedKeys.filter((key) => !requiredKeys.includes(key));

      if (missingKeys.length > 0 || redundantKeys.length > 0) {
        // Remove redundant keys from loaded config
        const cleanedConfig = Object.fromEntries(
          Object.entries(config).filter(([key]) =>
            requiredKeys.includes(key as WalletSettingTableColumnKey),
          ),
        );

        // Merge with default config to add missing fields
        const updatedConfig = {
          ...WALLET_SETTING_TABLE_COLUMN_CONFIG,
          ...cleanedConfig,
        };

        // Save updated config to storage
        saveColumnConfigToStorage(updatedConfig);
        dispatch(setColumnConfig(updatedConfig));
      } else {
        // All required keys are present and no redundant keys, use loaded config as-is
        dispatch(setColumnConfig(config));
      }
    } else {
      // No saved config, use default and save it
      saveColumnConfigToStorage(WALLET_SETTING_TABLE_COLUMN_CONFIG);
      dispatch(resetColumns());
    }
  }, [dispatch]);

  return (
    // DispatchTableProvider: Provides dispatch function for table actions (filter, sort, pagination)
    // Separation of concerns: Dispatch actions and table data are managed independently
    // Performance: Only re-render components that need updates when data or actions change
    // Reusability: Each context can be used independently in different components
    <DispatchTableProvider value={{ dispatchTable, reloadData }}>
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
