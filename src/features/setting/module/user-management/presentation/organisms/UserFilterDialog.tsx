'use client';

import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { FilterState } from '../../slices/types/index';

interface UserFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tempFilters: FilterState;
  selectedDateRange: DateRange | undefined;
  onRoleToggle: (role: string) => void;
  onStatusToggle: (status: string) => void;
  onDateRangeSelect: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function UserFilterDialog({
  open,
  onOpenChange,
  tempFilters,
  selectedDateRange,
  onRoleToggle,
  onStatusToggle,
  onDateRangeSelect,
  onClearFilters,
  onApplyFilters,
}: UserFilterDialogProps) {
  const handleApply = () => {
    onApplyFilters();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Filter & Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Filter */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Role</h3>
            <div className="flex flex-wrap gap-2">
              {['User', 'CS'].map((role) => (
                <div
                  key={role}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    tempFilters.roles.includes(role)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => onRoleToggle(role)}
                >
                  <span>{role}</span>
                  {tempFilters.roles.includes(role) && <X className="h-3 w-3" />}
                </div>
              ))}
              {tempFilters.roles.length > 0 && (
                <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                  +{tempFilters.roles.length}
                </div>
              )}
            </div>
          </div>

          {/* Creation Date Filter - Replace with DateRangeFilter*/}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Creation Date</h3>
            <DateRangeFilter
              dateRange={selectedDateRange}
              label=""
              onChange={onDateRangeSelect}
              colorScheme="default"
              pastDaysLimit={365} // Example: Limit to past year
              disableFuture={true} // Example: Disable future dates
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Status</h3>
            <div className="flex flex-wrap gap-2">
              {[{ value: 'blocked', label: 'Blocked' },
                { value: 'active', label: 'Active' },].map(({value, label}) => (
                <div
                  key={value}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    tempFilters.statuses.includes(value)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => onStatusToggle(value)}
                >
                  <span>{label}</span>
                  {tempFilters.statuses.includes(value) && <X className="h-3 w-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
              onClick={onClearFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button className="flex-1 bg-black text-white hover:bg-gray-800" onClick={handleApply}>
              ✓ Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
