import type { SidebarItem } from '../Sidebar.types';

export const mobileSidebarQuery = '(max-width: 768px)';

export const getSidebarItemClassName = (href: string, activeHref?: string): string | undefined =>
  href === activeHref ? 'selected' : undefined;

const isSidebarItemActive = (pathname: string, href: string): boolean => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const getActiveSidebarHref = (
  pathname: string,
  items: SidebarItem[],
): string | undefined => {
  return items
    .filter((item) => isSidebarItemActive(pathname, item.href))
    .sort((currentItem, nextItem) => nextItem.href.length - currentItem.href.length)[0]?.href;
};
