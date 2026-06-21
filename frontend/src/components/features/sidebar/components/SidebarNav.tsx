import { ListItem } from '@/components/primitives/list-item/ListItem';

import type { SidebarItem } from '../Sidebar.types';
import { getSidebarItemClassName } from '../utils/Sidebar.utils';

interface SidebarNavProps {
  ariaLabel?: string;
  activeHref?: string;
  isCollapsed: boolean;
  items: SidebarItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  ariaLabel,
  activeHref,
  isCollapsed,
  items,
}) => {
  const itemList = (
    <ul className="sidebar-list">
      {items.map(({ href, label, icon, alternativeText }) => {
        const isActive = href === activeHref;

        return (
          <ListItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            aria-current={isActive ? 'page' : undefined}
            className={getSidebarItemClassName(href, activeHref)}
            title={isCollapsed ? alternativeText : undefined}
          />
        );
      })}
    </ul>
  );

  if (!ariaLabel) {
    return itemList;
  }

  return (
    <nav className="sidebar-nav" aria-label={ariaLabel}>
      {itemList}
    </nav>
  );
};
