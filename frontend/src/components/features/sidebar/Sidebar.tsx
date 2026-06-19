import './Sidebar.scss';

import { Button } from '@/components/primitives/button/Button';
import { Icon } from '@/components/primitives/icon/Icon';
/**
 * Sidebar component for displaying a vertical navigation menu or additional content.
 * Should contain a list of links for navigation (dashboard, content, media, users, settings) and can also include user profile information and a logout button.
 * The sidebar should be collapsible to save screen space on smaller devices.
 * The component should be designed to be reusable across different pages of the application, providing a consistent navigation experience.
 * At the bottom of the sidebar should be a button where users can quickly create a new content item, which should be prominently displayed and easily accessible.
 */
import { Logo } from '@/components/primitives/logo/Logo';

import { sidebarItems } from './SidebarItems';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo assetType="wordmark" />
        <nav className="sidebar-nav">
          <ul>
            {sidebarItems.map((sidebarItem) => (
              <li key={sidebarItem.href}>
                <a href={sidebarItem.href} aria-label={sidebarItem.alternativeText}>
                  <Icon icon={sidebarItem.icon} />
                  {sidebarItem.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Button
          variant="primary"
          href="/content/new"
          icon="add"
          iconVariant="white"
          size="large"
          ariaLabel="Create new content"
        >
          New Content
        </Button>
      </div>
    </aside>
  );
};
