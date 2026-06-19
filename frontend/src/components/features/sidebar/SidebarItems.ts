import type { IconName } from '@/components/primitives/icon/Icons';

interface SidebarItem {
  href: string;
  label: string;
  icon: IconName;
  alternativeText: string;
}

export const sidebarItems: SidebarItem[] = [
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
];
