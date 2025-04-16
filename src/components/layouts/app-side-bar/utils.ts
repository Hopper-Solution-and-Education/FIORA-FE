// sidebarUtils.ts
import { NavItem } from '@/features/home/types/Nav.types';
import { GrowthBook } from '@growthbook/growthbook';

export const isItemActive = (item: NavItem, pathname: string): boolean => {
  // Điều kiện 1: Khớp chính xác item.url với pathname
  if (item.url === pathname) return true;

  // Điều kiện 2: Kiểm tra nếu pathname là đường dẫn con của item.url
  if (
    pathname?.startsWith(item.url) &&
    (pathname === item.url || pathname[item.url.length] === '/')
  ) {
    return true;
  }

  // Điều kiện 3: Kiểm tra nếu có subItem nào active (khớp chính xác hoặc là đường dẫn con)
  if (
    item.items?.some((subItem) => {
      // Khớp chính xác subItem.url với pathname
      if (subItem.url === pathname) return true;
      // Kiểm tra nếu pathname là đường dẫn con của subItem.url
      if (
        pathname?.startsWith(subItem.url) &&
        (pathname === subItem.url || pathname[subItem.url.length] === '/')
      ) {
        return true;
      }
      return false;
    })
  ) {
    return true;
  }

  return false;
};

export const filterNavItems = (
  items: NavItem[],
  gb: GrowthBook,
  userRole: string | undefined,
): NavItem[] => {
  return items.flatMap((item) => {
    const hasFeatureFlag = !item.featureFlags || gb.isOn(item.featureFlags);
    const hasRoleAccess = !item.role || userRole === item.role;

    if (hasFeatureFlag && hasRoleAccess) {
      return [
        {
          ...item,
          items: item.items ? filterNavItems(item.items, gb, userRole) : undefined,
        },
      ];
    }
    return [];
  });
};
