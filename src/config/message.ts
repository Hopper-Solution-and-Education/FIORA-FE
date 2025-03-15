export enum Messages {
  // Giao dịch
  GET_TRANSACTION_SUCCESS = 'Lấy danh sách giao dịch thành công',
  CREATE_TRANSACTION_SUCCESS = 'Tạo giao dịch thành công',
  UPDATE_TRANSACTION_SUCCESS = 'Cập nhật giao dịch thành công',
  DELETE_TRANSACTION_SUCCESS = 'Xóa giao dịch thành công',
  INVALID_TRANSACTION_TYPE = 'Type của transaction không hợp lệ',

  // Lỗi chung
  INTERNAL_ERROR = 'Có lỗi xảy ra, vui lòng thử lại sau',

  // Lỗi liên quan tới transaction
  CREATE_TRANSACTION_FAILED = 'Tạo giao dịch thất bại',

  // Lỗi liên quan đến tài khoản
  ACCOUNT_NOT_FOUND = 'Không tìm thấy tài khoản',
  INVALID_ACCOUNT_TYPE_FOR_INCOME = 'Loại tài khoản không hợp lệ. Chỉ tài khoản Thanh toán (Payment) được phép sử dụng cho thu nhập.',
  UNSUPPORTED_ACCOUNT_TYPE = 'Loại tài khoản {type} không được hỗ trợ',
  INVALID_ACCOUNT_TYPE_FOR_EXPENSE = 'Loại tài khoản không hợp lệ. Chỉ hỗ trợ Payment và CreditCard.',

  // Lỗi liên quan đến danh mục
  CATEGORY_NOT_FOUND = 'Không tìm thấy danh mục',
  INVALID_CATEGORY_TYPE_INCOME = 'Loại danh mục không hợp lệ. Danh mục phải là Thu nhập (Income).',
  INVALID_CATEGORY_TYPE_EXPENSE = 'Danh mục phải là chi tiêu (Expense).',

  // Lỗi liên quan đến số dư tài khoản
  INSUFFICIENT_BALANCE = 'Tài khoản phải có số dư lớn hơn hoặc bằng số tiền giao dịch.',
  INSUFFICIENT_CREDIT_LIMIT = 'Thẻ tín dụng không đủ hạn mức khả dụng.',

  // Lỗi liên quan tới product
  PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm',
  NO_PRODUCTS_PROVIDED = 'Không có sản phẩm nào được cung cấp',

  PARTNER_NOT_FOUND = 'Không tìm thấy partner.',
  PARTNER_NAME_TAKEN = 'Partner với tên này đã tồn tại.',
  CREATE_PARTNER_FAILED = 'Tạo partner thất bại.',
  UPDATE_PARTNER_FAILED = 'Cập nhật partner thất bại.',
  DELETE_PARTNER_FAILED = 'Xóa partner thất bại.',
  PARTNER_ALREADY_EXISTS = 'Partner bạn tạo đã tồn tại.',

  INVALID_USER = 'Người dùng không hợp lệ.',
  INVALID_PHONE = 'Số điện thoại không hợp lệ.',
  INVALID_DOB = 'Ngày sinh không hợp lệ.',

  GET_PARTNER_SUCCESS = 'Lấy danh sách đối tác thành công.',
  CREATE_PARTNER_SUCCESS = 'Tạo đối tác thành công.',
  UPDATE_PARTNER_SUCCESS = 'Cập nhật đối tác thành công.',
  DELETE_PARTNER_SUCCESS = 'Xóa đối tác thành công.',

  UNAUTHORIZED = 'Chưa đăng nhập',
  METHOD_NOT_ALLOWED = 'Phương thức không được hỗ trợ',
  GET_CATEGORY_SUCCESS = 'Lấy danh sách danh mục thành công',
  CREATE_CATEGORY_SUCCESS = 'Tạo danh mục thành công',
  UPDATE_CATEGORY_SUCCESS = 'Cập nhật danh mục thành công',
  DELETE_CATEGORY_SUCCESS = 'Xóa danh mục thành công',
}
