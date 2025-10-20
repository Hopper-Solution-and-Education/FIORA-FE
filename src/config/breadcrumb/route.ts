import { BreadcrumbItem } from './type';

export const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ title: 'Home', link: '/' }],

  // ACCOUNT
  '/account': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
  ],
  '/account/update/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
    { title: 'Update', link: '/account/update/[id]' },
  ],
  '/account/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
    { title: 'Create', link: '/account/create' },
  ],

  // TRANSACTION
  '/transaction': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
  ],
  '/profile': [{ title: 'Profile', link: '/profile' }],
  '/profile/ekyc': [
    { title: 'Profile', link: '/profile' },
    { title: 'eKYC', link: '/profile/ekyc' },
  ],
  '/ekyc/[userId]/verify': [
    { title: 'KYC', link: '/' },
    { title: 'Profile', link: '/ekyc/[userId]/profile' },
    { title: 'Verify', link: '/ekyc/[userId]/verify' },
  ],
  '/ekyc/[userId]/profile': [
    { title: 'KYC', link: '/' },
    { title: 'Profile', link: '/ekyc/[userId]/profile' },
  ],
  '/transaction/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Create', link: '/transaction/create' },
  ],
  '/transaction/details/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Details', link: '/transaction/details/[id]' },
  ],
  '/transaction/edit/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Edit', link: '/transaction/edit/[id]' },
  ],

  // CATEGORY
  '/category': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
  ],
  '/category/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
    { title: 'Create', link: '/category/create' },
  ],
  '/category/update/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
    { title: 'Update', link: '/category/update/[id]' },
  ],

  // FINANCE REPORT
  '/finance/report': [{ title: 'Finance', link: '/finance/report' }],

  // BUDGET
  '/budgets': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
  ],
  '/budgets/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Create', link: '/budgets/create' },
  ],
  '/budgets/summary/update/[year]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
    { title: 'Update', link: '/budgets/summary/update/[year]' },
  ],
  '/budgets/summary/[year]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
  ],
  '/budgets/summary/detail/[year]': [
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
    { title: 'Detail', link: '/budgets/summary/detail/[year]' },
  ],

  // WALLET
  '/wallet': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Wallet', link: '/wallet' },
  ],
  '/wallet/deposit': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Wallet', link: '/wallet' },
    { title: 'Deposit', link: '/wallet/deposit' },
  ],

  // MEMBERSHIP
  '/membership': [{ title: 'Membership', link: '/membership' }],

  // HELPS CENTER
  '/helps-center/about-us': [{ title: 'About Us', link: '/helps-center/about-us' }],
  '/helps-center/about-us/edit/[id]': [
    { title: 'About Us', link: '/helps-center/about-us' },
    { title: 'Edit', link: '/helps-center/about-us/edit/[id]' },
  ],
  '/helps-center/faqs': [{ title: 'FAQs', link: '/helps-center/faqs' }],
  '/helps-center/faqs/details/[id]': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Details', link: '/helps-center/faqs/details/[id]' },
  ],
  '/helps-center/faqs/details/[id]/edit': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Details', link: '/helps-center/faqs/details/[id]' },
    { title: 'Edit', link: '/helps-center/faqs/details/[id]/edit' },
  ],
  '/helps-center/faqs/create': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Create', link: '/helps-center/faqs/create' },
  ],
  '/helps-center/faqs/import': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Import', link: '/helps-center/faqs/import' },
  ],
  '/helps-center/contact-us': [{ title: 'Contact Us', link: '/helps-center/contact-us' }],
  '/helps-center/terms-and-conditions': [
    { title: 'Terms and Conditions', link: '/helps-center/terms-and-conditions' },
  ],
  '/helps-center/user-tutorial': [{ title: 'User Tutorial', link: '/helps-center/user-tutorial' }],
  '/helps-center/user-tutorial/edit/[id]': [
    { title: 'User Tutorial', link: '/helps-center/user-tutorial' },
    { title: 'Edit', link: '/helps-center/user-tutorial/edit/[id]' },
  ],
  '/helps-center/terms-and-conditions/edit/[id]': [
    { title: 'Terms and Conditions', link: '/helps-center/terms-and-conditions' },
    { title: 'Edit', link: '/helps-center/terms-and-conditions/edit/[id]' },
  ],

  // NEWS
  '/news': [{ title: 'News', link: '/news' }],
  '/news/details/[id]/edit': [
    { title: 'News', link: '/news' },
    { title: 'Details', link: '/news/details/[id]' },
    { title: 'Edit', link: '/news/details/[id]/edit' },
  ],
  '/news/details/[id]': [
    { title: 'News', link: '/news' },
    { title: 'Details', link: '/news/details/[id]' },
  ],
  '/news/create': [
    { title: 'News', link: '/news' },
    { title: 'Create', link: '/news/create' },
  ],

  // SETTING
  // USER MODE
  '/setting/product': [{ title: 'Product', link: '/setting/product' }],
  '/setting/product/update/[id]': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Update', link: '/setting/product/update/[id]' },
  ],
  '/setting/product/create': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Create', link: '/setting/product/create' },
  ],
  '/setting/partner': [{ title: 'Partner', link: '/setting/partner' }],
  '/setting/partner/update/[id]': [
    { title: 'Partner', link: '/setting/partner' },
    { title: 'Update', link: '/setting/partner/update/[id]' },
  ],
  '/setting/partner/create': [
    { title: 'Partner', link: '/setting/partner' },
    { title: 'Create', link: '/setting/partner/create' },
  ],
  '/setting/role-permission': [{ title: 'Role Permission', link: '/setting/role-permission' }],
  '/setting/user': [{ title: 'User', link: '/setting/user' }],

  // ADMIN MODE
  '/setting/landing': [{ title: 'Landing Setting', link: '/setting/landing' }],
  '/setting/exchange-rate': [{ title: 'Exchange Rate Setting', link: '/setting/exchange-rate' }],
  '/setting/membership': [{ title: 'Membership Setting', link: '/setting/membership' }],
  '/setting/wallet': [{ title: 'FX Request', link: '/setting/wallet' }],
  '/setting/notification': [{ title: 'Notification', link: '/setting/notification' }],
  '/setting/packagefx': [{ title: 'Package FX', link: '/setting/packagefx' }],
  '/setting/packagefx/create': [
    { title: 'Package FX', link: '/setting/packagefx' },
    { title: 'Create', link: '/setting/packagefx/create' },
  ],
  '/setting/packagefx/edit/[id]': [
    { title: 'Package FX', link: '/setting/packagefx' },
    { title: 'Edit', link: '' },
  ],
  '/setting/cron-job/membership': [
    { title: 'Cron Job', link: '/setting/cron-job' },
    { title: 'Membership', link: '/setting/cron-job/membership' },
  ],
  '/setting/cron-job/flexi-interest': [
    { title: 'Cron Job', link: '/setting/cron-job' },
    { title: 'Flexi Interest', link: '/setting/cron-job/flexi-interest' },
  ],

  '/setting/cron-job/referral': [
    { title: 'Cron Job', link: '/setting/cron-job' },
    { title: 'Referral', link: '/setting/cron-job/referral' },
  ],
};
