import { FilterOperator } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { act, renderHook, waitFor } from '@testing-library/react';
import { walletSettingContainer } from '../../../di/walletSettingDIContainer';
import * as walletSettingSlices from '../../../slices';
import * as utils from '../../utils';
import { useWalletSetting } from '../useWalletSetting';

// Mock dependencies
jest.mock('@/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../../di/walletSettingDIContainer', () => ({
  walletSettingContainer: {
    get: jest.fn(),
  },
}));

jest.mock('../../../slices', () => ({
  clearError: jest.fn(),
  setError: jest.fn(),
  setLoading: jest.fn(),
}));

jest.mock('../../utils', () => ({
  convertToTableData: jest.fn((item) => ({ ...item, converted: true })),
}));

const mockDispatch = jest.fn();
const mockUseCase = {
  execute: jest.fn(),
};

describe('useWalletSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (walletSettingContainer.get as jest.Mock).mockReturnValue(mockUseCase);
  });

  const mockReduxState = {
    loading: false,
    filter: { rules: [] },
    search: '',
    skipFilters: false,
  };

  const mockApiResponse = {
    items: [
      { id: 1, amount: 100, status: 'Requested' },
      { id: 2, amount: 200, status: 'Approved' },
    ],
    page: 1,
    pageSize: 20,
    total: 50,
  };

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);

      const { result } = renderHook(() => useWalletSetting());

      expect(result.current.tableData.data).toEqual([]);
      expect(result.current.tableData.hasMore).toBe(true);
      expect(result.current.tableData.isLoadingMore).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Data fetching', () => {
    it('should fetch initial data on mount', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledWith(1, 20, { undefined: [] });
      });

      await waitFor(() => {
        expect(result.current.tableData.data).toHaveLength(2);
      });

      expect(result.current.tableData.hasMore).toBe(true);
      expect(utils.convertToTableData).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors gracefully', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      const error = new Error('API Error');
      mockUseCase.execute.mockRejectedValue(error);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(walletSettingSlices.setError).toHaveBeenCalledWith('API Error');
      });

      expect(result.current.tableData.data).toEqual([]);
    });

    it('should prevent concurrent API calls', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const { result } = renderHook(() => useWalletSetting());

      // Trigger multiple calls rapidly
      act(() => {
        result.current.dispatchTable({ type: 'SET_PAGE', payload: 2 });
      });

      act(() => {
        result.current.dispatchTable({ type: 'SET_PAGE', payload: 3 });
      });

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Filtering and search', () => {
    it('should merge search term into filter rules', async () => {
      const stateWithSearch = {
        ...mockReduxState,
        search: 'test search',
        filter: {
          rules: [{ field: 'status', operator: FilterOperator.IN, value: ['Requested'] }],
        },
      };
      (useAppSelector as jest.Mock).mockReturnValue(stateWithSearch);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledWith(1, 20, {
          undefined: [{ search: { contains: 'test search' } }, { status: { in: ['Requested'] } }],
        });
      });
    });

    it('should skip filters when skipFilters is true', async () => {
      const stateWithSkipFilters = {
        ...mockReduxState,
        skipFilters: true,
      };
      (useAppSelector as jest.Mock).mockReturnValue(stateWithSkipFilters);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledWith(1, 20, { undefined: [] });
      });
    });

    it('should refetch data when filter changes', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      const { rerender } = renderHook(() => useWalletSetting());

      // Wait for initial fetch
      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      });

      // Change filter
      const newState = {
        ...mockReduxState,
        filter: { rules: [{ field: 'status', operator: FilterOperator.IN, value: ['Approved'] }] },
      };
      (useAppSelector as jest.Mock).mockReturnValue(newState);

      rerender();

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Load more functionality', () => {
    it('should load more data when loadMore is called', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useWalletSetting());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.tableData.data).toHaveLength(2);
      });

      // Mock second page response
      const secondPageResponse = {
        ...mockApiResponse,
        page: 2,
        items: [{ id: 3, amount: 300, status: 'Rejected' }],
      };
      mockUseCase.execute.mockResolvedValue(secondPageResponse);

      // Call loadMore
      await act(async () => {
        await result.current.loadMore();
      });

      await waitFor(() => {
        expect(mockUseCase.execute).toHaveBeenCalledWith(2, 20, { undefined: [] });
      });

      expect(result.current.tableData.data).toHaveLength(3);
    });

    it('should not load more when hasMore is false', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      const responseWithNoMore = {
        ...mockApiResponse,
        total: 20, // Same as page * pageSize, so no more pages
      };
      mockUseCase.execute.mockResolvedValue(responseWithNoMore);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(result.current.tableData.hasMore).toBe(false);
      });

      await act(async () => {
        await result.current.loadMore();
      });

      // Should not make additional API call
      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should not load more when already loading', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(result.current.tableData.data).toHaveLength(2);
      });

      // Set loading more state
      act(() => {
        result.current.dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      });

      await act(async () => {
        await result.current.loadMore();
      });

      // Should not make additional API call
      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Table state management', () => {
    it('should update pagination state correctly', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(result.current.tableData.pagination).toEqual({
          current: 1,
          pageSize: 20,
          total: 50,
        });
      });
    });

    it('should handle empty response correctly', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      const emptyResponse = {
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
      };
      mockUseCase.execute.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(result.current.tableData.data).toEqual([]);
        expect(result.current.tableData.hasMore).toBe(false);
        expect(result.current.tableData.pagination.total).toBe(0);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      const networkError = new Error('Network Error');
      mockUseCase.execute.mockRejectedValue(networkError);

      const { result } = renderHook(() => useWalletSetting());

      await waitFor(() => {
        expect(walletSettingSlices.setError).toHaveBeenCalledWith('Network Error');
      });

      expect(result.current.tableData.data).toEqual([]);
    });

    it('should handle load more errors', async () => {
      (useAppSelector as jest.Mock).mockReturnValue(mockReduxState);
      mockUseCase.execute.mockResolvedValueOnce(mockApiResponse);
      mockUseCase.execute.mockRejectedValueOnce(new Error('Load more error'));

      const { result } = renderHook(() => useWalletSetting());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.tableData.data).toHaveLength(2);
      });

      // Try to load more
      await act(async () => {
        await result.current.loadMore();
      });

      await waitFor(() => {
        expect(walletSettingSlices.setError).toHaveBeenCalledWith('Load more error');
      });

      // Data should remain unchanged
      expect(result.current.tableData.data).toHaveLength(2);
    });
  });
});
