'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { GetPackageFXPaginatedRequest } from '../../data/dto/request/GetPackageFXPaginatedRequest';
import { getPackageFXAsyncThunk } from '../../slices/actions';
import { WalletDepositPackageCard, WalletPackageCardSkeleton } from '../atoms';
import WalletPackageErrorBoundary from '../molecules/WalletPackageErrorBoundary';
import type { PackageItemData, WalletPackageListProps } from './WalletPackageList.types';

const ITEM_HEIGHT = 92;

function RowComponent({ index, data, style }: ListChildComponentProps<PackageItemData>) {
  const { packages, selectedId, onSelect, getIsPopular } = data;
  const pkg = packages[index];

  if (!pkg) {
    return (
      <div style={style}>
        <WalletPackageCardSkeleton />
      </div>
    );
  }

  return (
    <div style={style}>
      <WalletDepositPackageCard
        packageFX={pkg}
        selected={selectedId === pkg.id}
        onSelect={onSelect}
        isPopular={getIsPopular(pkg)}
      />
    </div>
  );
}

const WalletPackageList: React.FC<WalletPackageListProps> = React.memo(
  ({ selectedId, setSelectedId, className }) => {
    const dispatch = useAppDispatch();
    const { packageFX, packageFXPagination, depositSearch } = useAppSelector(
      (state) => ({
        packageFX: state.wallet.packageFX,
        packageFXPagination: state.wallet.packageFXPagination,
        depositSearch: state.wallet.depositSearch,
      }),
      shallowEqual,
    );

    // LOCAL STATE
    const getIsPopular = useCallback((pkg: { fxAmount: number }) => pkg.fxAmount === 250, []);
    const isFetchingRef = useRef(false);
    const currentPageRef = useRef(1);
    const totalCount = packageFXPagination?.total ?? 0;

    const filteredPackageFX = useMemo(() => {
      if (!packageFX) return [];

      return [...packageFX].sort((a, b) => a.fxAmount - b.fxAmount);
    }, [packageFX]);

    const itemData = useMemo<PackageItemData>(
      () => ({
        packages: filteredPackageFX,
        selectedId,
        onSelect: setSelectedId,
        getIsPopular,
      }),
      [filteredPackageFX, selectedId, setSelectedId, getIsPopular],
    );

    // LOCAL FUNCTIONS
    const isItemLoaded = useCallback(
      (index: number) => {
        return !!filteredPackageFX[index];
      },
      [filteredPackageFX],
    );

    const loadMoreItems = useCallback(
      (startIndex: number, stopIndex: number): Promise<void> => {
        if (
          isFetchingRef.current ||
          !packageFXPagination?.hasMore ||
          startIndex < filteredPackageFX.length
        ) {
          return Promise.resolve();
        }

        isFetchingRef.current = true;
        const nextPage = currentPageRef.current + 1;
        currentPageRef.current = nextPage;

        const request: GetPackageFXPaginatedRequest = {
          page: nextPage,
          limit: 10,
          search: depositSearch ? depositSearch : undefined,
          append: true,
        };

        return dispatch(getPackageFXAsyncThunk(request))
          .unwrap()
          .then(() => {
            isFetchingRef.current = false;
          })
          .catch((err) => {
            console.error('Failed to load more items:', err);
            isFetchingRef.current = false;
            currentPageRef.current = nextPage - 1;
          });
      },
      [dispatch, packageFXPagination?.hasMore, filteredPackageFX.length],
    );

    // EFFECTS
    useEffect(() => {
      const request: GetPackageFXPaginatedRequest = {
        page: 1,
        limit: 10,
        search: depositSearch || undefined,
      };
      currentPageRef.current = 1;
      dispatch(getPackageFXAsyncThunk(request));
    }, [depositSearch]);

    useEffect(() => {
      let isMounted = true;

      const fetchInitial = async () => {
        if (!isMounted) return;

        const request: GetPackageFXPaginatedRequest = {
          page: 1,
          limit: 10,
        };
        currentPageRef.current = 1;
        dispatch(getPackageFXAsyncThunk(request));
      };

      fetchInitial();

      return () => {
        isMounted = false;
      };
    }, [dispatch]);

    return (
      <WalletPackageErrorBoundary>
        <Card className={cn('w-full', className)}>
          <CardHeader>
            <CardTitle className="text-xl">Select FX Package</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Choose the amount of FX you want to deposit
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-4">
            <div className="h-[500px] overflow-hidden">
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={totalCount}
                loadMoreItems={loadMoreItems}
                minimumBatchSize={10}
                threshold={1}
              >
                {({ onItemsRendered, ref }) => {
                  return (
                    <RadioGroup
                      value={selectedId ?? ''}
                      onValueChange={setSelectedId}
                      className="h-full"
                    >
                      <List
                        ref={ref}
                        height={500}
                        width="100%"
                        itemSize={ITEM_HEIGHT}
                        itemCount={totalCount}
                        itemData={itemData}
                        onItemsRendered={onItemsRendered}
                      >
                        {RowComponent}
                      </List>
                    </RadioGroup>
                  );
                }}
              </InfiniteLoader>
            </div>
          </CardContent>
        </Card>
      </WalletPackageErrorBoundary>
    );
  },
);

WalletPackageList.displayName = 'WalletPackageList';

export default WalletPackageList;
