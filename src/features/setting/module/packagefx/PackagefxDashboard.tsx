'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteDialog, EditPackageForm } from './components';
import CreatePackageForm from './components/CreatePackageForm';
import { useDeletePackageFx } from './hooks/useDeletePackageFx';
import { useInfiniteObserver } from './hooks/useInfiniteObserver';
import { usePackageFxInfiniteData } from './hooks/usePackageFxInfiniteData';
import { usePackageFxSort } from './hooks/usePackageFxSort';

type SortField = 'fxAmount' | 'createdAt';

const PackageFxDashboard = () => {
  const [localItems, setLocalItems] = useState<any[]>([]);
  const [localTotal, setLocalTotal] = useState(0);
  const { sortField, sortOrder, handleSort } = usePackageFxSort();
  const { items, total, hasMore, isInitialLoading, isFetching, loadMore, refetch } =
    usePackageFxInfiniteData({ sortField: sortField as SortField, sortOrder, limit: 20 });

  const containerRef = useRef<HTMLDivElement>(null!);
  const sentinelRef = useRef<HTMLDivElement>(null!);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackageToDelete, setSelectedPackageToDelete] = useState<any | null>(null);

  const { deletePackageFx, loading: deleteLoading } = useDeletePackageFx();

  const onHitBottom = useCallback(() => {
    if (!isFetching && hasMore) loadMore();
  }, [isFetching, hasMore, loadMore]);

  useInfiniteObserver(containerRef, sentinelRef, onHitBottom);

  useEffect(() => {
    setLocalItems(items);
    setLocalTotal(total);
  }, [items, total]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  const isEmpty = useMemo(
    () => !isInitialLoading && items.length === 0,
    [isInitialLoading, items.length],
  );

  const handleCreate = () => setCreateDialogOpen(true);
  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditDialogOpen(true);
  };
  const handleDelete = (pkg: any) => {
    setSelectedPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };
  const handleEditSubmit = () => {
    setEditDialogOpen(false);
    refetch?.();
  };
  const handleCreated = () => {
    refetch?.();
    setCreateDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedPackageToDelete) return;

    const deletedId = selectedPackageToDelete.id;
    const success = await deletePackageFx(deletedId);

    if (success) {
      setLocalItems((prev) => prev.filter((pkg) => pkg.id !== deletedId));
      setLocalTotal((prev) => prev - 1);
    }

    setDeleteDialogOpen(false);
    setSelectedPackageToDelete(null);
  };

  const SortArrowBtn = ({
    sortOrder,
    isActivated,
  }: {
    sortOrder: 'asc' | 'desc' | 'none';
    isActivated: boolean;
  }) => (
    <span
      className={`inline-block h-fit transition-transform duration-300 overflow-visible ${isActivated ? 'text-blue-500' : 'text-gray-400'} ${sortOrder === 'asc' ? 'rotate-0' : sortOrder === 'desc' ? 'rotate-180' : ''}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 2C7.77614 2 8 2.22386 8 2.5V11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645L7 11.2929V2.5C7 2.22386 7.22386 2 7.5 2Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  return (
    <div className="m-4 md:m-6 p-6 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex justify-between items-center gap-1 mb-4">
        <div className="text-sm text-gray-700 font-medium">
          Displaying{' '}
          <span className="text-black font-bold">
            {localItems.length}/{localTotal}
          </span>{' '}
          packagefx records
        </div>
        <Button
          onClick={handleCreate}
          variant="outline"
          className="flex items-center justify-center w-10 h-8 p-0 border border-gray-400 hover:bg-gray-50 hover:border-gray-500"
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-center text-[#09090b]">No.</TableHead>
              <TableHead
                className="w-1/5 text-center cursor-pointer select-none"
                onClick={() => handleSort('fxAmount')}
              >
                <span
                  className={`flex items-center justify-center ${sortField === 'fxAmount' ? 'text-blue-500' : 'text-[#09090b]'}`}
                >
                  FX Amount
                  <span className="ml-1 align-middle">
                    <SortArrowBtn
                      sortOrder={sortField === 'fxAmount' ? sortOrder : 'none'}
                      isActivated={sortField === 'fxAmount'}
                    />
                  </span>
                </span>
              </TableHead>
              <TableHead className="w-1/5 text-center text-[#09090b]">Attachments</TableHead>
              <TableHead
                className="w-1/5 text-center cursor-pointer select-none"
                onClick={() => handleSort('createdAt')}
              >
                <span
                  className={`flex items-center justify-center ${sortField === 'createdAt' ? 'text-blue-500' : 'text-[#09090b]'}`}
                >
                  Package Date
                  <span className="ml-1 align-middle">
                    <SortArrowBtn
                      sortOrder={sortField === 'createdAt' ? sortOrder : 'none'}
                      isActivated={sortField === 'createdAt'}
                    />
                  </span>
                </span>
              </TableHead>
              <TableHead className="w-1/5 text-center text-[#09090b]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localItems.map((pkg, index) => (
              <TableRow key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="font-medium text-center text-blue-600">{index + 1}</TableCell>
                <TableCell className="text-center">
                  <span className="text-green-600 font-medium">{pkg.fxAmount} FX</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="min-h-[100px] flex items-center justify-center">
                    {Array.isArray(pkg.attachments) && pkg.attachments.length > 0 ? (
                      <div className="min-h-[100px] flex items-center justify-center relative">
                        <div
                          className="relative"
                          style={{
                            width: 64 + (Math.min(pkg.attachments.length, 3) - 1) * 32,
                            height: 60,
                            marginLeft: 16,
                          }}
                        >
                          {pkg.attachments.map((file: any, idx: number) => {
                            const baseWidth = 40;
                            const baseHeight = 52;
                            const scaleFactor = 1 + idx * 0.12;
                            const width = baseWidth * scaleFactor;
                            const height = baseHeight * scaleFactor;
                            const leftOffset = idx * 24;
                            const rotateAngle = idx === 0 ? 0 : 6 + idx * 2;

                            return (
                              <Image
                                key={file.id || `${pkg.id}-att-${idx}`}
                                src={file.url || '/images/logo.jpg'}
                                alt={`Attachment ${idx + 1}`}
                                width={80}
                                height={104}
                                className="absolute rounded-lg border border-gray-300 shadow bg-white object-cover transition-all duration-300"
                                style={{
                                  top: '50%',
                                  left: leftOffset,
                                  width,
                                  height,
                                  zIndex: idx,
                                  transform: `translateY(-50%) rotate(${rotateAngle}deg)`,
                                  transformOrigin: 'left center',
                                }}
                                loading="lazy"
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.src = '/images/logo.jpg';
                                }}
                                unoptimized
                              />
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative"
                        style={{
                          width: 64,
                          height: 60,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                        }}
                      >
                        <Icons.post className="h-10 w-10 text-red-600" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">{formatDate(pkg.createdAt)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 h-7 w-7"
                    >
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(pkg)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-7 w-7"
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isEmpty && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No packages found
                </TableCell>
              </TableRow>
            )}

            {(isInitialLoading || isFetching) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        pkg={selectedPackageToDelete}
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      {createDialogOpen && (
        <CreatePackageForm
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {editDialogOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="p-6">
            <EditPackageForm
              pkg={selectedPackage}
              onCancel={() => setEditDialogOpen(false)}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageFxDashboard;
