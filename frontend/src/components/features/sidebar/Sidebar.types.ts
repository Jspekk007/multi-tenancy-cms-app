import type { IconName } from '@/components/primitives/icon/Icons';

export interface SidebarItem {
  href: string;
  label: string;
  icon: IconName;
  alternativeText: string;
}

export interface SidebarCollection {
  header: SidebarItem[];
  footer: SidebarItem[];
}

export interface SidebarProps {
  activeHref?: string;
  defaultCollapsed?: boolean;
}

export interface SidebarViewProps {
  activeHref?: string;
  isCollapsed: boolean;
  onToggle: () => void;
}
