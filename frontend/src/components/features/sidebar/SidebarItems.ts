import type { SidebarCollection, SidebarItem } from './Sidebar.types';

export const getSidebarItems = (items: SidebarCollection = sidebarItems): SidebarItem[] => [
  ...items.header,
  ...items.footer,
];

export const sidebarItems: SidebarCollection = {
  header: [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      alternativeText: 'Go to dashboard',
    },
    {
      href: '/content',
      label: 'Content',
      icon: 'content',
      alternativeText: 'Go to content',
    },
    {
      href: '/media',
      label: 'Media',
      icon: 'media',
      alternativeText: 'Go to media',
    },
    {
      href: '/users',
      label: 'Users',
      icon: 'users',
      alternativeText: 'Go to users',
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: 'settings',
      alternativeText: 'Go to settings',
    },
  ],
  footer: [
    {
      href: '/support',
      label: 'Support',
      icon: 'support',
      alternativeText: 'Go to support',
    },
    {
      href: '/logs',
      label: 'Logs',
      icon: 'logs',
      alternativeText: 'Go to logs',
    },
  ],
};
