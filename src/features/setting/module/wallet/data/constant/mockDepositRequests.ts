import { DepositRequestStatus, FXRequestType } from '../../domain';
import { DepositRequest } from '../../domain/entity/DepositRequest';

/**
 * Mock data for FX Requests (Deposit & Withdraw)
 * Sử dụng cho testing và development UI
 */
export const MOCK_DEPOSIT_REQUESTS: DepositRequest[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    refCode: 'DEP-2025-001',
    packageFXId: 'pkg-fx-001',
    attachmentId: 'att-001',
    status: DepositRequestStatus.Requested,
    type: FXRequestType.Deposit,
    remark: 'Yêu cầu nạp FX cho tháng 10/2025',
    createdAt: '2025-10-01T08:30:00Z',
    updatedAt: '2025-10-01T08:30:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174001',
    updatedBy: null,
    fxAmount: 1000,
    package: {
      id: 'pkg-fx-001',
      fxAmount: '1000',
    },
    attachment: {
      id: 'att-001',
      type: 'image/png',
      size: 2458624,
      url: 'https://example.com/attachments/proof-001.png',
      path: '/uploads/proof-001.png',
    },
    user: {
      name: 'Nguyễn Văn An',
      email: 'nguyen.van.an@example.com',
      image: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    userId: '123e4567-e89b-12d3-a456-426614174002',
    refCode: 'WIT-2025-001',
    packageFXId: 'pkg-fx-002',
    attachmentId: 'att-002',
    status: DepositRequestStatus.Requested,
    type: FXRequestType.Withdraw,
    remark: 'Yêu cầu rút FX về tài khoản ngân hàng',
    createdAt: '2025-10-01T09:15:00Z',
    updatedAt: '2025-10-01T14:20:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174002',
    updatedBy: null,
    fxAmount: 2500,
    package: {
      id: 'pkg-fx-002',
      fxAmount: '2500',
    },
    attachment: {
      id: 'att-002',
      type: 'application/pdf',
      size: 1024000,
      url: 'https://example.com/attachments/invoice-002.pdf',
      path: '/uploads/invoice-002.pdf',
    },
    user: {
      name: 'Trần Thị Bình',
      email: 'tran.thi.binh@example.com',
      image: 'https://i.pravatar.cc/150?img=5',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    userId: '123e4567-e89b-12d3-a456-426614174003',
    refCode: 'DEP-2025-003',
    packageFXId: 'pkg-fx-003',
    attachmentId: 'att-003',
    status: DepositRequestStatus.Rejected,
    type: FXRequestType.Deposit,
    remark: 'Thông tin chuyển khoản không chính xác',
    createdAt: '2025-10-01T10:45:00Z',
    updatedAt: '2025-10-01T15:30:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174003',
    updatedBy: 'admin-002',
    fxAmount: 500,
    package: {
      id: 'pkg-fx-003',
      fxAmount: '500',
    },
    attachment: {
      id: 'att-003',
      type: 'image/jpeg',
      size: 3145728,
      url: 'https://example.com/attachments/transfer-003.jpg',
      path: '/uploads/transfer-003.jpg',
    },
    user: {
      name: 'Lê Minh Cường',
      email: 'le.minh.cuong@example.com',
      image: 'https://i.pravatar.cc/150?img=12',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    userId: '123e4567-e89b-12d3-a456-426614174004',
    refCode: 'WIT-2025-002',
    packageFXId: 'pkg-fx-004',
    attachmentId: undefined,
    status: DepositRequestStatus.Requested,
    type: FXRequestType.Withdraw,
    remark: null,
    createdAt: '2025-10-02T07:00:00Z',
    updatedAt: '2025-10-02T07:00:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174004',
    updatedBy: null,
    fxAmount: 3000,
    package: {
      id: 'pkg-fx-004',
      fxAmount: '3000',
    },
    attachment: undefined,
    user: {
      name: 'Phạm Thu Hằng',
      email: 'pham.thu.hang@example.com',
      image: 'https://i.pravatar.cc/150?img=23',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    userId: '123e4567-e89b-12d3-a456-426614174005',
    refCode: 'DEP-2025-005',
    packageFXId: 'pkg-fx-005',
    attachmentId: 'att-005',
    status: DepositRequestStatus.Approved,
    type: FXRequestType.Deposit,
    remark: 'Gói VIP - Ưu tiên xử lý',
    createdAt: '2025-10-02T08:30:00Z',
    updatedAt: '2025-10-02T09:00:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174005',
    updatedBy: 'admin-001',
    fxAmount: 5000,
    package: {
      id: 'pkg-fx-005',
      fxAmount: '5000',
    },
    attachment: {
      id: 'att-005',
      type: 'image/png',
      size: 1835008,
      url: 'https://example.com/attachments/bank-transfer-005.png',
      path: '/uploads/bank-transfer-005.png',
    },
    user: {
      name: 'Đỗ Văn Đức',
      email: 'do.van.duc@example.com',
      image: 'https://i.pravatar.cc/150?img=33',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    userId: '123e4567-e89b-12d3-a456-426614174006',
    refCode: 'WIT-2025-003',
    packageFXId: 'pkg-fx-001',
    attachmentId: 'att-006',
    status: DepositRequestStatus.Approved,
    type: FXRequestType.Withdraw,
    remark: 'Rút FX đã được duyệt',
    createdAt: '2025-10-02T11:20:00Z',
    updatedAt: '2025-10-02T11:20:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174006',
    updatedBy: 'admin-001',
    fxAmount: 1000,
    package: {
      id: 'pkg-fx-001',
      fxAmount: '1000',
    },
    attachment: {
      id: 'att-006',
      type: 'application/pdf',
      size: 512000,
      url: 'https://example.com/attachments/receipt-006.pdf',
      path: '/uploads/receipt-006.pdf',
    },
    user: {
      name: 'Hoàng Thị Lan',
      email: 'hoang.thi.lan@example.com',
      image: 'https://i.pravatar.cc/150?img=44',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    userId: '123e4567-e89b-12d3-a456-426614174007',
    refCode: 'DEP-2025-007',
    packageFXId: 'pkg-fx-002',
    attachmentId: 'att-007',
    status: DepositRequestStatus.Approved,
    type: FXRequestType.Deposit,
    remark: 'Xác nhận thành công',
    createdAt: '2025-10-02T13:45:00Z',
    updatedAt: '2025-10-02T16:00:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174007',
    updatedBy: 'admin-003',
    fxAmount: 2500,
    package: {
      id: 'pkg-fx-002',
      fxAmount: '2500',
    },
    attachment: {
      id: 'att-007',
      type: 'image/jpeg',
      size: 2097152,
      url: 'https://example.com/attachments/payment-007.jpg',
      path: '/uploads/payment-007.jpg',
    },
    user: {
      name: 'Vũ Quang Hải',
      email: 'vu.quang.hai@example.com',
      image: null,
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    userId: '123e4567-e89b-12d3-a456-426614174008',
    refCode: 'DEP-2025-008',
    packageFXId: 'pkg-fx-003',
    attachmentId: 'att-008',
    status: DepositRequestStatus.Requested,
    type: FXRequestType.Deposit,
    remark: 'Chuyển khoản qua MoMo',
    createdAt: '2025-10-02T14:15:00Z',
    updatedAt: '2025-10-02T14:15:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174008',
    updatedBy: null,
    fxAmount: 500,
    package: {
      id: 'pkg-fx-003',
      fxAmount: '500',
    },
    attachment: {
      id: 'att-008',
      type: 'image/png',
      size: 1572864,
      url: 'https://example.com/attachments/momo-008.png',
      path: '/uploads/momo-008.png',
    },
    user: {
      name: 'Bùi Thị Mai',
      email: 'bui.thi.mai@example.com',
      image: 'https://i.pravatar.cc/150?img=16',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    userId: '123e4567-e89b-12d3-a456-426614174009',
    refCode: 'WIT-2025-004',
    packageFXId: 'pkg-fx-005',
    attachmentId: 'att-009',
    status: DepositRequestStatus.Rejected,
    type: FXRequestType.Withdraw,
    remark: 'Thông tin tài khoản ngân hàng không hợp lệ',
    createdAt: '2025-10-02T15:00:00Z',
    updatedAt: '2025-10-02T17:30:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174009',
    updatedBy: 'admin-002',
    fxAmount: 5000,
    package: {
      id: 'pkg-fx-005',
      fxAmount: '5000',
    },
    attachment: {
      id: 'att-009',
      type: 'image/jpeg',
      size: 4194304,
      url: 'https://example.com/attachments/blurry-009.jpg',
      path: '/uploads/blurry-009.jpg',
    },
    user: {
      name: 'Ngô Văn Phúc',
      email: 'ngo.van.phuc@example.com',
      image: 'https://i.pravatar.cc/150?img=52',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    userId: '123e4567-e89b-12d3-a456-426614174010',
    refCode: 'DEP-2025-010',
    packageFXId: 'pkg-fx-004',
    attachmentId: 'att-010',
    status: DepositRequestStatus.Approved,
    type: FXRequestType.Deposit,
    remark: 'Thanh toán qua ZaloPay - Đã xác nhận',
    createdAt: '2025-10-02T16:30:00Z',
    updatedAt: '2025-10-02T18:00:00Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174010',
    updatedBy: 'admin-001',
    fxAmount: 3000,
    package: {
      id: 'pkg-fx-004',
      fxAmount: '3000',
    },
    attachment: {
      id: 'att-010',
      type: 'application/pdf',
      size: 768000,
      url: 'https://example.com/attachments/zalopay-010.pdf',
      path: '/uploads/zalopay-010.pdf',
    },
    user: {
      name: 'Đinh Thị Hương',
      email: 'dinh.thi.huong@example.com',
      image: 'https://i.pravatar.cc/150?img=24',
    },
  },
];

/**
 * Mock data cho paginated response
 */
export const MOCK_DEPOSIT_REQUESTS_PAGINATED = {
  items: MOCK_DEPOSIT_REQUESTS,
  page: 1,
  pageSize: 20,
  totalPage: 1,
  total: MOCK_DEPOSIT_REQUESTS.length,
};

/**
 * Helper function để lấy mock data theo status
 */
export const getMockDepositRequestsByStatus = (status: DepositRequestStatus) => {
  return MOCK_DEPOSIT_REQUESTS.filter((request) => request.status === status);
};

/**
 * Helper function để lấy mock data theo khoảng số tiền
 */
export const getMockDepositRequestsByAmountRange = (min: number, max: number) => {
  return MOCK_DEPOSIT_REQUESTS.filter(
    (request) => request.fxAmount >= min && request.fxAmount <= max,
  );
};

/**
 * Helper function để lấy mock data theo type (Deposit/Withdraw)
 */
export const getMockDepositRequestsByType = (type: FXRequestType) => {
  return MOCK_DEPOSIT_REQUESTS.filter((request) => request.type === type);
};
