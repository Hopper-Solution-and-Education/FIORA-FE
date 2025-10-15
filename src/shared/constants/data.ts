import { Icons } from '@/components/Icon';
import { GlobalNavItem, IconsOptions } from '@/shared/types';

export const globalNavItems: GlobalNavItem[] = [
  {
    title: 'Profile',
    url: '/profile',
    icon: 'dashboard',
    props: { size: 20, strokeWidth: 1 },
    isActive: false,
    shortcut: ['d', 'd'],
  },
  {
    title: 'Subscription',
    url: '#subscription',
    icon: 'billing',
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
