import { Icons } from '@/components/Icon';
import { GlobalNavItem, IconsOptions } from '@/shared/types';
import { Currency } from '@prisma/client';

// FEATURE FLAGS
export enum FeatureFlags {
  CATEGORY_FEATURE = 'CAT_SETTING',
  TRANSACTION_FEATURE = 'TRANX',
  PARTNER_FEATURE = 'PART_SETTING',
  PRODUCT_FEATURE = 'PROD_SETTING',
  ACCOUNT_FEATURE = 'ACC',
  BUDGET_FEATURE = 'BUDGET_CONTROL',
  FINANCE_FEATURE = 'FINANCE_REPORT',
  WALLET_FEATURE = 'WALLET',
  EXCHANGE_RATE_FEATURE = 'EXCHANGE_RATE',
  MEMBERSHIP_FEATURE = 'MEMBERSHIP',
  FAQ_FEATURE = 'FAQs',
  PACKAGE_FX_FEATURE = 'PACKAGE_FX',
  FLEXI_INTEREST = 'FLEXI_INTEREST',
  REFERRAL_FEATURE = 'REFERRAL',
}

export const MODULE = {
  HOME: 'HOME',
  WALLET: 'WALLET',
  ACCOUNT: 'ACCOUNT',
  CATEGORY: 'CATEGORY',
  TRANSACTION: 'TRANSACTION',
  BUDGET: 'BUDGET',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  CS: 'CS',
} as const;

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  CS = 'CS',
}

export enum CronJobType {
  Membership = 'MEMBERSHIP',
  Referral = 'REFERRAL',
}

export enum SavingWalletAction {
  DEPOSIT = 'Deposit',
  TRANSFER = 'Transfer',
}

// CURRENCY & EXCHANGE RATE
export const FIXED_NUMBER_OF_DECIMALS = 8;
export const DEFAULT_BASE_CURRENCY = 'USD';
export const EXCHANGE_RATE_STALE_TIME = 6 * 60 * 60 * 1000;
export const CACHE_KEY = 'fiora_exchange_rates';
export const CURRENCY: Record<Currency, string> = {
  USD: 'USD',
  VND: 'VND',
  FX: 'FX',
} as const;

// UPLLOAD
export const SUPPORTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
export const FIREBASE_STORAGE_URL = 'https://firebasestorage.googleapis.com';
export const FIREBASE_GS_URL = 'gs://';

// DATA
export const DEFAULT_AMOUNT_PACKAGES: number[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
];

export const globalNavItems: GlobalNavItem[] = [
  {
    title: 'Profile',
    url: '/profile',
    icon: 'dashboard',
    props: { size: 20, strokeWidth: 1 },
    isActive: false,
    shortcut: ['d', 'd'],
  },
];

export const notSignInNavItems: GlobalNavItem[] = [
  {
    title: 'Sign In',
    url: '/auth/sign-in',
    icon: 'dashboard',
    props: { size: 20, strokeWidth: 1 },
    isActive: false,
    shortcut: ['d', 'd'],
  },
  {
    title: 'Sign Up',
    url: '/auth/sign-up',
    icon: 'banknote',
    props: { size: 20, strokeWidth: 1 },
    shortcut: ['p', 'p'],
    isActive: false,
  },
];

export const ICON_SIZE = {
  XS: 14, // Extra Small
  SM: 18, // Small
  MD: 22, // Medium (Default)
  LG: 30, // Large
  XL: 46, // Extra Large
  XXL: 62, // 2X Large
  XXXL: 94, // 3X Large
} as const;

export const iconOptions: IconsOptions[] = [
  {
    label: 'None',
    options: [{ value: '', label: 'None', icon: Icons.none }],
  },
  {
    // Hành động/Điều hướng / Action/Navigation
    label: 'Action/Navigation',
    options: [
      { value: 'add', label: 'Plus', icon: Icons.add },
      { value: 'arrowRight', label: 'Arrow Right', icon: Icons.arrowRight },
      { value: 'chevronLeft', label: 'ChevronLeft', icon: Icons.chevronLeft },
      { value: 'chevronRight', label: 'ChevronRight', icon: Icons.chevronRight },
      { value: 'close', label: 'Close', icon: Icons.close },
      { value: 'ellipsis', label: 'More Vertical', icon: Icons.ellipsis },
      { value: 'login', label: 'Sign In', icon: Icons.login },
      { value: 'trash', label: 'Trash', icon: Icons.trash },
    ],
  },
  {
    // Giao diện người dùng/Trạng thái / UI/State
    label: 'UI/State',
    options: [
      { value: 'check', label: 'Check', icon: Icons.check },
      { value: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
      { value: 'eye', label: 'Eye', icon: Icons.eye },
      { value: 'help', label: 'Help Circle', icon: Icons.help },
      { value: 'spinner', label: 'Loader', icon: Icons.spinner },
      { value: 'warning', label: 'Alert Triangle', icon: Icons.warning },
    ],
  },
  {
    // Biểu tượng người dùng/Hồ sơ / User/Profile
    label: 'User/Profile',
    options: [
      { value: 'employee', label: 'Employee', icon: Icons.employee },
      { value: 'user', label: 'User', icon: Icons.user },
      { value: 'user2', label: 'User Circle', icon: Icons.user2 },
      { value: 'userPen', label: 'User Pen', icon: Icons.userPen },
    ],
  },
  {
    // Tài chính/Thương mại / Finance/Commerce
    label: 'Finance/Commerce',
    options: [
      { value: 'banknote', label: 'Banknote', icon: Icons.banknote },
      { value: 'billing', label: 'Credit Card', icon: Icons.billing },
      { value: 'dollarSign', label: 'Dollar Sign', icon: Icons.dollarSign },
      { value: 'piggyBank', label: 'Piggy Bank', icon: Icons.piggyBank },
      { value: 'shoppingCart', label: 'Shopping Cart', icon: Icons.shoppingCart },
      { value: 'trendingUp', label: 'TrendingUp', icon: Icons.trendingUp },
      { value: 'chartBar', label: 'Chart Bar', icon: Icons.chartBar },
      { value: 'shieldCheck', label: 'Shield Check', icon: Icons.shieldCheck },
      { value: 'wallet', label: 'Wallet', icon: Icons.wallet },
    ],
  },
  {
    // Phương tiện/Tài liệu / Media/Document
    label: 'Media/Document',
    options: [
      { value: 'media', label: 'Image', icon: Icons.media },
      { value: 'page', label: 'File', icon: Icons.page },
      { value: 'post', label: 'File Text', icon: Icons.post },
    ],
  },
  {
    // Phương tiện giao thông/Đồ vật / Transportation/Objects
    label: 'Transportation/Objects',
    options: [
      { value: 'car', label: 'Car', icon: Icons.car },
      { value: 'home', label: 'Home', icon: Icons.home },
      { value: 'laptop', label: 'Laptop', icon: Icons.laptop },
      { value: 'phone', label: 'Phone', icon: Icons.phone },
    ],
  },
  {
    // Thực phẩm / Food
    label: 'Food',
    options: [
      { value: 'pizza', label: 'Pizza', icon: Icons.pizza },
      { value: 'utensils', label: 'Utensils', icon: Icons.utensils },
    ],
  },
  {
    // Cài đặt/Công cụ / Settings/Tools
    label: 'Settings/Tools',
    options: [
      { value: 'kanban', label: 'Kanban', icon: Icons.kanban },
      { value: 'pencil', label: 'Pencil', icon: Icons.pencil },
      { value: 'settings', label: 'Settings', icon: Icons.settings },
    ],
  },
  {
    // Thương hiệu/Nền tảng / Brand/Platform
    label: 'Brand/Platform',
    options: [
      { value: 'logo', label: 'Command', icon: Icons.logo },
      { value: 'trello', label: 'Trello', icon: Icons.trello },
      { value: 'twitter', label: 'Twitter', icon: Icons.twitter },
    ],
  },
  {
    // Thời tiết/Chế độ / Weather/Mode
    label: 'Weather/Mode',
    options: [
      { value: 'moon', label: 'Moon', icon: Icons.moon },
      { value: 'sun', label: 'Sun Medium', icon: Icons.sun },
    ],
  },
  {
    // Thông báo / Notification
    label: 'Notification',
    options: [{ value: 'bellRing', label: 'BellRing', icon: Icons.bellRing }],
  },
  {
    // Sản phẩm/Mua sắm / Product/Shopping
    label: 'Product/Shopping',
    options: [{ value: 'product', label: 'Shopping', icon: Icons.product }],
  },
  {
    // Thương hiệu/Nền tảng / Brand/Platform
    label: 'Brand/Platform',
    options: [
      { value: 'logo', label: 'Command', icon: Icons.logo },
      { value: 'trello', label: 'Trello', icon: Icons.trello },
      { value: 'twitter', label: 'Twitter', icon: Icons.twitter },
    ],
  },
  {
    // Giáo dục/Học tập / Education/Learning
    label: 'Education',
    options: [
      { value: 'book', label: 'Book', icon: Icons.book },
      { value: 'graduationCap', label: 'Graduation Cap', icon: Icons.graduationCap },
    ],
  },
];

// EMAIL
export enum EmailTemplateEnum {
  OTP_VERIFICATION = '2b651d0c-f041-47b7-ba6d-e84673aaa000',
  DEPOSIT_APPROVED_EMAIL_TEMPLATE_ID = 'd191b380-3a52-4904-b39c-490360eb41c6',
  DEPOSIT_REJECTED_EMAIL_TEMPLATE_ID = '0c03e649-d219-4098-b886-f62ec5b8e233',
  WITHDRAWAL_APPROVED_EMAIL_TEMPLATE_ID = 'a42b478c-0ba7-4bba-9a69-e10cdc5e9bc5',
  WITHDRAWAL_REJECTED_EMAIL_TEMPLATE_ID = '806deaf6-a528-4254-a3d7-2f6e8ba21d4c',
}

// ACKNOWLEDGMENT
export enum AcknowledgmentFeatureKey {
  HOMEPAGE = 'homepage_tour',
  PROFILE = 'profile_tour',
}
